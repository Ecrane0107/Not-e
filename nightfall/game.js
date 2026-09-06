/*
 * Nightfall — a top-down zombie-siege tower defense.
 * The "tower" is a house with four walls (N/E/S/W). Survivors assigned
 * to a wall auto-fire at zombies approaching it. Hold until dawn, then
 * pick one reward and do it again, harder.
 *
 * Everything renders at a fixed low internal resolution (384x216) which
 * is then scaled up in CSS with pixelated rendering — the classic trick
 * for crisp pixel art at any screen size, and it also keeps the amount
 * of actual pixel-fill work tiny. Sprites are pre-rendered once onto
 * small offscreen canvases and blitted with drawImage from then on —
 * no shadowBlur, no per-frame gradients, nothing that fights the GPU.
 */

const CW = 384, CH = 216;
const MAX_SURVIVORS = 20;
const WALL_IDS = ["N", "E", "S", "W"];
const BASE_WALL_HP = 100;
const NIGHT_DURATION = 42; // seconds

const HOUSE = { x: 150, y: 88, w: 84, h: 46 };
const DEFENSE_POINT = {
  N: { x: 192, y: HOUSE.y - 8 },
  S: { x: 192, y: HOUSE.y + HOUSE.h + 8 },
  E: { x: HOUSE.x + HOUSE.w + 8, y: 111 },
  W: { x: HOUSE.x - 8, y: 111 },
};
const WALL_AXIS = { N: "x", S: "x", E: "y", W: "y" }; // which coordinate zombies spread along

// ---------------------------------------------------------------
// pixel sprites: tiny ASCII grids rendered once to an offscreen canvas
// ---------------------------------------------------------------
function makeSprite(rows, palette) {
  const h = rows.length, w = rows[0].length;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const cx = c.getContext("2d");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      const color = palette[ch];
      if (color) { cx.fillStyle = color; cx.fillRect(x, y, 1, 1); }
    }
  }
  return c;
}

const SPR_SURVIVOR = makeSprite(
  [
    "..HHH..",
    ".HFFFH.",
    ".HFFFH.",
    "..FFF..",
    ".JJJJJ.",
    ".JJJJJ.",
    ".JJJJJ.",
    "..P.P..",
    "..P.P..",
  ],
  { H: "#2b2117", F: "#d8a97a", J: "#3f6fa8", P: "#20242b" },
);

const SPR_ZOMBIE = makeSprite(
  [
    "..hhh..",
    ".hzrzh.",
    ".hzzzh.",
    "..zzz..",
    ".jjjjj.",
    ".jjjjj.",
    ".jj.jj.",
    "..p.p..",
    "..p.p..",
  ],
  { h: "#241f14", z: "#6b8f3a", r: "#c0392b", j: "#4a4a34", p: "#1c1c14" },
);

const SPR_BRUTE = makeSprite(
  [
    "...HHH...",
    "..HZZZH..",
    ".HZZrZZH.",
    ".HZZZZZH.",
    "..ZZZZZ..",
    ".JJJJJJJ.",
    ".JJJJJJJ.",
    ".JJJJJJJ.",
    ".JJ.J.JJ.",
    "..P...P..",
    "..P...P..",
  ],
  { H: "#241f14", Z: "#4f6b28", r: "#c0392b", J: "#3a3a28", P: "#17170f" },
);

// ---------------------------------------------------------------
// state
// ---------------------------------------------------------------
function freshState() {
  return {
    phase: "menu", // menu | day | night | reward | gameover
    day: 1,
    survivors: 1,
    unassigned: 1,
    assignment: { N: 0, E: 0, S: 0, W: 0 },
    food: 10,
    ammo: 30,
    weaponTier: 1,
    walls: {
      N: { hp: BASE_WALL_HP, max: BASE_WALL_HP },
      E: { hp: BASE_WALL_HP, max: BASE_WALL_HP },
      S: { hp: BASE_WALL_HP, max: BASE_WALL_HP },
      W: { hp: BASE_WALL_HP, max: BASE_WALL_HP },
    },
    kills: 0,
    nightsSurvived: 0,
  };
}
let S = freshState();

// runtime-only (not persisted between nights)
let zombies = [];
let bullets = [];
let fireCooldown = { N: 0, E: 0, S: 0, W: 0 };
let spawnTimer = 0;
let nightClock = 0;
let breached = false;

// ---------------------------------------------------------------
// DOM
// ---------------------------------------------------------------
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const hud = document.getElementById("hud");
const hudDay = document.getElementById("hudDay");
const hudSurvivors = document.getElementById("hudSurvivors");
const hudFood = document.getElementById("hudFood");
const hudAmmo = document.getElementById("hudAmmo");
const timerWrap = document.getElementById("timerWrap");
const timerBar = document.getElementById("timerBar");
const wallBars = { N: document.getElementById("wallN"), E: document.getElementById("wallE"), S: document.getElementById("wallS"), W: document.getElementById("wallW") };
const toast = document.getElementById("toast");

const menuOverlay = document.getElementById("menuOverlay");
const dayOverlay = document.getElementById("dayOverlay");
const rewardOverlay = document.getElementById("rewardOverlay");
const overOverlay = document.getElementById("overOverlay");

function resizeCanvas() {
  const ratio = CW / CH;
  let w = window.innerWidth, h = window.innerHeight;
  if (w / h > ratio) w = h * ratio; else h = w / ratio;
  canvas.style.width = Math.floor(w) + "px";
  canvas.style.height = Math.floor(h) + "px";
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let toastTimer = 0;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = 2.4;
}

// ---------------------------------------------------------------
// rewards
// ---------------------------------------------------------------
const REWARDS = [
  {
    id: "survivor", icon: "\u{1F464}", title: "New survivor",
    desc: "A stranger made it to your door. +1 survivor.",
    canApply: s => s.survivors < MAX_SURVIVORS,
    apply: s => { s.survivors = Math.min(MAX_SURVIVORS, s.survivors + 1); s.unassigned += 1; },
  },
  {
    id: "ammo", icon: "\u{1F9F0}", title: "Ammo crate",
    desc: "+25 rounds for the whole house.",
    apply: s => { s.ammo += 25; },
  },
  {
    id: "food", icon: "\u{1F96B}", title: "Food supplies",
    desc: "+12 food. Keeps everyone standing a while longer.",
    apply: s => { s.food += 12; },
  },
  {
    id: "weapon", icon: "\u{1F52B}", title: "Weapon upgrade",
    desc: "Every shot hits harder, permanently.",
    apply: s => { s.weaponTier += 1; },
  },
  {
    id: "reinforce", icon: "\u{1F9F1}", title: "Reinforce walls",
    desc: "+20 max HP to every wall, fully repaired.",
    apply: s => { WALL_IDS.forEach(w => { s.walls[w].max += 20; s.walls[w].hp = s.walls[w].max; }); },
  },
  {
    id: "medkit", icon: "⚕️", title: "Field repairs",
    desc: "Fully repair every wall to its current max HP.",
    canApply: s => WALL_IDS.some(w => s.walls[w].hp < s.walls[w].max),
    apply: s => { WALL_IDS.forEach(w => { s.walls[w].hp = s.walls[w].max; }); },
  },
];

function rollRewards() {
  const pool = REWARDS.filter(r => !r.canApply || r.canApply(S));
  const picks = [];
  const bag = pool.slice();
  while (picks.length < 3 && bag.length) {
    const i = Math.floor(Math.random() * bag.length);
    picks.push(bag.splice(i, 1)[0]);
  }
  return picks;
}

// ---------------------------------------------------------------
// difficulty curve
// ---------------------------------------------------------------
function difficultyForDay(day) {
  return {
    spawnInterval: Math.max(0.35, 1.9 - day * 0.09),
    zombieHp: 8 + day * 1.6,
    zombieSpeed: 15 + day * 0.7,
    zombieDamage: 5 + day * 0.5,
    bruteChance: Math.min(0.35, Math.max(0, (day - 3) * 0.05)),
  };
}

// ---------------------------------------------------------------
// UI: day (assignment) screen
// ---------------------------------------------------------------
const assignList = document.getElementById("assignList");
const poolCount = document.getElementById("poolCount");

function renderAssignScreen() {
  document.getElementById("dayTitle").textContent = "Night " + S.day;
  document.getElementById("dayFood").textContent = S.food;
  document.getElementById("dayAmmo").textContent = S.ammo;
  document.getElementById("dayWeapon").textContent = "Tier " + S.weaponTier;
  document.getElementById("dayLead").textContent = S.day === 1
    ? "Put your one survivor on a wall. Whoever isn't posted isn't shooting tonight."
    : "Put your people where you think the horde will hit hardest.";

  assignList.innerHTML = WALL_IDS.map(w => `
    <div class="assign-row">
      <div class="side"><span class="dot"></span>${w === "N" ? "North" : w === "E" ? "East" : w === "S" ? "South" : "West"} wall</div>
      <div class="stepper">
        <button data-w="${w}" data-d="-1" ${S.assignment[w] <= 0 ? "disabled" : ""}>&minus;</button>
        <span class="count">${S.assignment[w]}</span>
        <button data-w="${w}" data-d="1" ${S.unassigned <= 0 ? "disabled" : ""}>+</button>
      </div>
    </div>
  `).join("");
  poolCount.textContent = S.unassigned;

  assignList.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const w = btn.dataset.w, d = Number(btn.dataset.d);
      if (d > 0 && S.unassigned > 0) { S.assignment[w] += 1; S.unassigned -= 1; }
      else if (d < 0 && S.assignment[w] > 0) { S.assignment[w] -= 1; S.unassigned += 1; }
      renderAssignScreen();
    });
  });
}

// ---------------------------------------------------------------
// UI: HUD updates
// ---------------------------------------------------------------
function updateHud() {
  hudDay.textContent = "Night " + S.day;
  hudSurvivors.textContent = S.survivors;
  hudFood.textContent = S.food;
  hudAmmo.textContent = S.ammo;
  WALL_IDS.forEach(w => {
    const pct = Math.max(0, S.walls[w].hp / S.walls[w].max) * 100;
    const bar = wallBars[w];
    bar.querySelector(".hp i").style.width = pct + "%";
    bar.classList.toggle("low", pct < 30);
  });
}

// ---------------------------------------------------------------
// phase transitions
// ---------------------------------------------------------------
function goToMenu() {
  S = freshState();
  hud.hidden = true;
  menuOverlay.hidden = false;
  dayOverlay.hidden = true;
  rewardOverlay.hidden = true;
  overOverlay.hidden = true;
}

function goToDay() {
  S.phase = "day";
  hud.hidden = true;
  dayOverlay.hidden = false;
  rewardOverlay.hidden = true;
  overOverlay.hidden = true;
  renderAssignScreen();
}

function startNight() {
  S.phase = "night";
  dayOverlay.hidden = true;
  hud.hidden = false;
  zombies = [];
  bullets = [];
  spawnTimer = 0.6;
  nightClock = NIGHT_DURATION;
  breached = false;
  fireCooldown = { N: 0, E: 0, S: 0, W: 0 };
  timerWrap.hidden = false;
  updateHud();
}

function endNightSuccess() {
  S.phase = "reward";
  S.nightsSurvived += 1;
  timerWrap.hidden = true;

  // food upkeep: each survivor eats after a night of work
  const need = S.survivors;
  if (S.food >= need) {
    S.food -= need;
  } else {
    const deficit = need - S.food;
    S.food = 0;
    const starved = Math.min(S.survivors - 1, Math.ceil(deficit / 3));
    if (starved > 0) {
      S.survivors -= starved;
      rebalanceAfterLoss();
      showToast(starved === 1 ? "A survivor starved overnight." : starved + " survivors starved overnight.");
    }
  }

  document.getElementById("rewardLead").textContent =
    "Night " + S.day + " is over. Pick one — you can't take them all.";
  const cardsEl = document.getElementById("rewardCards");
  const picks = rollRewards();
  cardsEl.innerHTML = picks.map((r, i) => `
    <button class="card" data-i="${i}">
      <span class="cico">${r.icon}</span>
      <span>
        <span class="ctitle">${r.title}</span>
        <span class="cdesc">${r.desc}</span>
      </span>
    </button>
  `).join("");
  cardsEl.querySelectorAll(".card").forEach(btn => {
    btn.addEventListener("click", () => {
      picks[Number(btn.dataset.i)].apply(S);
      S.day += 1;
      goToDay();
    }, { once: true });
  });
  rewardOverlay.hidden = false;
}

function rebalanceAfterLoss() {
  // if losses left more people assigned than exist, pull them back to the pool
  let assigned = WALL_IDS.reduce((a, w) => a + S.assignment[w], 0);
  let total = S.survivors;
  while (assigned > total) {
    const w = WALL_IDS.find(w => S.assignment[w] > 0);
    if (!w) break;
    S.assignment[w] -= 1;
    assigned -= 1;
  }
  S.unassigned = Math.max(0, total - assigned);
}

function gameOver() {
  S.phase = "gameover";
  hud.hidden = true;
  timerWrap.hidden = true;
  document.getElementById("overLead").textContent =
    "You held for " + S.nightsSurvived + (S.nightsSurvived === 1 ? " night." : " nights.") +
    " " + S.kills + " kills.";
  overOverlay.hidden = false;
}

// ---------------------------------------------------------------
// entities
// ---------------------------------------------------------------
function jitterTarget(wall) {
  const p = DEFENSE_POINT[wall];
  const spread = wall === "N" || wall === "S" ? 26 : 20;
  const axis = WALL_AXIS[wall];
  const j = (Math.random() * 2 - 1) * spread;
  return axis === "x" ? { x: p.x + j, y: p.y } : { x: p.x, y: p.y + j };
}

function spawnZombie() {
  const diff = difficultyForDay(S.day);
  const wall = WALL_IDS[Math.floor(Math.random() * 4)];
  const isBrute = Math.random() < diff.bruteChance;
  let x, y;
  const along = (Math.random() - 0.5) * 160;
  if (wall === "N") { x = 192 + along; y = -12; }
  else if (wall === "S") { x = 192 + along; y = CH + 12; }
  else if (wall === "E") { x = CW + 12; y = 108 + along * 0.5; }
  else { x = -12; y = 108 + along * 0.5; }

  const target = jitterTarget(wall);
  zombies.push({
    x, y, wall, target,
    hp: isBrute ? diff.zombieHp * 3 : diff.zombieHp,
    maxHp: isBrute ? diff.zombieHp * 3 : diff.zombieHp,
    speed: isBrute ? diff.zombieSpeed * 0.6 : diff.zombieSpeed,
    dmg: isBrute ? diff.zombieDamage * 2 : diff.zombieDamage,
    sprite: isBrute ? SPR_BRUTE : SPR_ZOMBIE,
    arrived: false,
    bob: Math.random() * Math.PI * 2,
  });
}

function updateZombies(dt) {
  for (let i = zombies.length - 1; i >= 0; i--) {
    const z = zombies[i];
    const dx = z.target.x - z.x, dy = z.target.y - z.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 2) {
      z.arrived = false;
      z.x += (dx / dist) * z.speed * dt;
      z.y += (dy / dist) * z.speed * dt;
    } else {
      z.arrived = true;
      const wallHp = S.walls[z.wall];
      wallHp.hp -= z.dmg * dt;
      if (wallHp.hp <= 0) {
        wallHp.hp = 0;
        breached = true;
      }
    }
    z.bob += dt * 6;
    if (z.hp <= 0) {
      zombies.splice(i, 1);
      S.kills += 1;
    }
  }
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.t += dt / b.dur;
    if (b.t >= 1) bullets.splice(i, 1);
  }
}

function updateTurrets(dt) {
  WALL_IDS.forEach(w => {
    fireCooldown[w] = Math.max(0, fireCooldown[w] - dt);
    const crew = S.assignment[w];
    if (crew <= 0 || S.ammo <= 0) return;
    if (fireCooldown[w] > 0) return;

    // nearest zombie assigned to (approaching) this wall
    let best = null, bestDist = Infinity;
    for (const z of zombies) {
      if (z.wall !== w) continue;
      const d = Math.hypot(z.x - DEFENSE_POINT[w].x, z.y - DEFENSE_POINT[w].y);
      if (d < bestDist) { bestDist = d; best = z; }
    }
    if (!best) return;

    const dmg = 3 * S.weaponTier;
    best.hp -= dmg;
    S.ammo -= 1;
    bullets.push({ x1: DEFENSE_POINT[w].x, y1: DEFENSE_POINT[w].y, x2: best.x, y2: best.y, t: 0, dur: 0.08 });

    const interval = Math.max(0.12, 0.85 / Math.min(crew, 6));
    fireCooldown[w] = interval;
  });
}

// ---------------------------------------------------------------
// rendering
// ---------------------------------------------------------------
function drawBackground() {
  ctx.fillStyle = "#141a10";
  ctx.fillRect(0, 0, CW, CH);
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= CW; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
  for (let y = 0; y <= CH; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
  // vignette-ish darker border, drawn as flat rects (cheap, no gradients)
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, CW, 10);
  ctx.fillRect(0, CH - 10, CW, 10);
  ctx.fillRect(0, 0, 10, CH);
  ctx.fillRect(CW - 10, 0, 10, CH);
}

function drawHouse() {
  const { x, y, w, h } = HOUSE;
  // roof
  ctx.fillStyle = "#5a3a2a";
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + w / 2, y - 22);
  ctx.lineTo(x + w + 8, y);
  ctx.closePath();
  ctx.fill();
  // walls
  ctx.fillStyle = "#8a7a5a";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#6d6045";
  ctx.fillRect(x, y, w, 4);
  // door
  ctx.fillStyle = "#2c1d12";
  ctx.fillRect(x + w / 2 - 6, y + h - 20, 12, 20);
  // windows
  ctx.fillStyle = "#d8a24a";
  ctx.fillRect(x + 10, y + 14, 10, 8);
  ctx.fillRect(x + w - 20, y + 14, 10, 8);
}

function drawWallGlow(w) {
  const pct = S.walls[w].hp / S.walls[w].max;
  if (pct >= 1) return;
  const p = DEFENSE_POINT[w];
  const alpha = 0.35 * (1 - pct);
  ctx.fillStyle = `rgba(192,57,43,${alpha})`;
  const r = 18;
  ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
}

function drawSurvivors() {
  WALL_IDS.forEach(w => {
    const crew = Math.min(S.assignment[w], 5);
    if (crew <= 0) return;
    const p = DEFENSE_POINT[w];
    const axis = WALL_AXIS[w];
    const spacing = 9;
    for (let i = 0; i < crew; i++) {
      const off = (i - (crew - 1) / 2) * spacing;
      const sx = axis === "x" ? p.x + off - 3 : p.x - 3;
      const sy = axis === "y" ? p.y + off - 4 : p.y - 4;
      ctx.drawImage(SPR_SURVIVOR, Math.round(sx), Math.round(sy));
    }
  });
}

function drawZombies() {
  for (const z of zombies) {
    const bobY = z.arrived ? Math.sin(z.bob) * 1 : 0;
    const w = z.sprite.width, h = z.sprite.height;
    ctx.drawImage(z.sprite, Math.round(z.x - w / 2), Math.round(z.y - h / 2 + bobY));
    // hp sliver above
    if (z.hp < z.maxHp) {
      const pct = Math.max(0, z.hp / z.maxHp);
      ctx.fillStyle = "#000";
      ctx.fillRect(Math.round(z.x - 6), Math.round(z.y - h / 2 - 4), 12, 2);
      ctx.fillStyle = pct > 0.4 ? "#9ACD32" : "#c0392b";
      ctx.fillRect(Math.round(z.x - 6), Math.round(z.y - h / 2 - 4), Math.round(12 * pct), 2);
    }
  }
}

function drawBullets() {
  ctx.strokeStyle = "#f4e6b8";
  ctx.lineWidth = 1;
  for (const b of bullets) {
    const x = b.x1 + (b.x2 - b.x1) * b.t;
    const y = b.y1 + (b.y2 - b.y1) * b.t;
    ctx.beginPath();
    ctx.moveTo(b.x1, b.y1);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function render() {
  drawBackground();
  WALL_IDS.forEach(drawWallGlow);
  drawHouse();
  drawSurvivors();
  drawZombies();
  drawBullets();
}

// ---------------------------------------------------------------
// main loop
// ---------------------------------------------------------------
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (toastTimer > 0) {
    toastTimer -= dt;
    if (toastTimer <= 0) toast.classList.remove("show");
  }

  if (S.phase === "night") {
    const diff = difficultyForDay(S.day);
    spawnTimer -= dt;
    if (spawnTimer <= 0) { spawnZombie(); spawnTimer = diff.spawnInterval; }

    updateZombies(dt);
    updateTurrets(dt);
    updateBullets(dt);
    updateHud();

    nightClock -= dt;
    timerBar.style.width = Math.max(0, (nightClock / NIGHT_DURATION) * 100) + "%";

    if (breached) {
      gameOver();
    } else if (nightClock <= 0) {
      endNightSuccess();
    }
  }

  render();
}

// ---------------------------------------------------------------
// wiring
// ---------------------------------------------------------------
document.getElementById("btnStart").addEventListener("click", () => {
  menuOverlay.hidden = true;
  goToDay();
});
document.getElementById("btnStartNight").addEventListener("click", startNight);
document.getElementById("btnRetry").addEventListener("click", goToMenu);

requestAnimationFrame(frame);
