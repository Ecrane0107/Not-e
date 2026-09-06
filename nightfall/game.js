/*
 * Nightfall — a top-down zombie-siege tower defense, rendered in basic
 * flat-shaded 3D (same low-poly spirit as Dead Static) instead of a
 * pixel-art 2D canvas. The house still has four walls (N/E/S/W) that
 * take damage independently, but there's no manual crew assignment
 * anymore — survivors automatically split up to defend whichever
 * wall(s) are actually under attack each night.
 */

import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

// ---------------------------------------------------------------
// gameplay constants
// ---------------------------------------------------------------
const MAX_SURVIVORS = 20;
const WALL_IDS = ["N", "E", "S", "W"];
const BASE_WALL_HP = 100;
const NIGHT_DURATION = 42; // seconds

// world space: the house sits at the origin on a flat ground plane
const GROUND_SIZE = 44;
const HOUSE_HALF_X = 4;
const HOUSE_HALF_Z = 3;
const HOUSE_HEIGHT = 2.6;
const SPAWN_EDGE = 19;

const DEFENSE_POINT = {
  N: { x: 0, z: -(HOUSE_HALF_Z + 1.4) },
  S: { x: 0, z: HOUSE_HALF_Z + 1.4 },
  E: { x: HOUSE_HALF_X + 1.4, z: 0 },
  W: { x: -(HOUSE_HALF_X + 1.4), z: 0 },
};
const WALL_AXIS = { N: "x", S: "x", E: "z", W: "z" }; // which coordinate zombies spread along

// ---------------------------------------------------------------
// state
// ---------------------------------------------------------------
function freshState() {
  return {
    phase: "menu", // menu | day | night | reward | gameover
    day: 1,
    survivors: 1,
    assignment: { N: 0, E: 0, S: 0, W: 0 }, // recomputed automatically each night
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
let autoAssignTimer = 0;

// ---------------------------------------------------------------
// DOM
// ---------------------------------------------------------------
const canvas = document.getElementById("game");

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

let toastTimer = 0;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = 2.4;
}

// ---------------------------------------------------------------
// three.js scene
// ---------------------------------------------------------------
function flatMaterial(color) {
  return new THREE.MeshLambertMaterial({ color, flatShading: true });
}

function makeGroundTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const cx = c.getContext("2d");
  cx.fillStyle = "#1b2410";
  cx.fillRect(0, 0, 256, 256);
  cx.strokeStyle = "rgba(255,255,255,0.035)";
  cx.lineWidth = 1;
  for (let i = 0; i <= 256; i += 16) {
    cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i, 256); cx.stroke();
    cx.beginPath(); cx.moveTo(0, i); cx.lineTo(256, i); cx.stroke();
  }
  cx.fillStyle = "rgba(0,0,0,0.12)";
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 256, y = Math.random() * 256, r = 6 + Math.random() * 14;
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070a);
scene.fog = new THREE.Fog(0x05070a, 28, 58);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 26, 13);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.HemisphereLight(0x9fb0c0, 0x1a1610, 0.9));
const sun = new THREE.DirectionalLight(0xfff2d8, 0.7);
sun.position.set(8, 16, 6);
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE),
  new THREE.MeshLambertMaterial({ map: makeGroundTexture() }),
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

function buildHouse() {
  const group = new THREE.Group();

  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(HOUSE_HALF_X * 2, HOUSE_HEIGHT, HOUSE_HALF_Z * 2),
    flatMaterial(0x8a7a5a),
  );
  walls.position.y = HOUSE_HEIGHT / 2;
  group.add(walls);

  const roofHeight = 1.6;
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.hypot(HOUSE_HALF_X, HOUSE_HALF_Z) * 1.05, roofHeight, 4),
    flatMaterial(0x5a3a2a),
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.y = HOUSE_HEIGHT + roofHeight / 2 - 0.05;
  group.add(roof);

  const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.5, 0.15), flatMaterial(0x2c1d12));
  door.position.set(0, 0.75, HOUSE_HALF_Z + 0.02);
  group.add(door);

  const windowMat = new THREE.MeshBasicMaterial({ color: 0xd8a24a });
  [-1, 1].forEach(side => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.1), windowMat);
    win.position.set(side * 2.2, 1.5, HOUSE_HALF_Z + 0.02);
    group.add(win);
  });

  return group;
}
scene.add(buildHouse());

// damage glow discs on the ground at each defense point
const wallGlow = {};
WALL_IDS.forEach(w => {
  const mat = new THREE.MeshBasicMaterial({ color: 0xc0392b, transparent: true, opacity: 0 });
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.6, 16), mat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.set(DEFENSE_POINT[w].x, 0.02, DEFENSE_POINT[w].z);
  scene.add(disc);
  wallGlow[w] = mat;
});
function updateWallGlow() {
  WALL_IDS.forEach(w => {
    const pct = S.walls[w].hp / S.walls[w].max;
    wallGlow[w].opacity = pct >= 1 ? 0 : 0.5 * (1 - pct);
  });
}

function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", onResize);
onResize();

// ---------------------------------------------------------------
// entity models (shared geometries/materials, built once)
// ---------------------------------------------------------------
const zombieBodyGeo = new THREE.CylinderGeometry(0.32, 0.4, 1.1, 6);
const zombieHeadGeo = new THREE.SphereGeometry(0.28, 6, 5);
const bruteBodyGeo = new THREE.CylinderGeometry(0.52, 0.64, 1.6, 6);
const bruteHeadGeo = new THREE.SphereGeometry(0.42, 6, 5);
const survivorBodyGeo = new THREE.CylinderGeometry(0.26, 0.32, 1.0, 6);
const survivorHeadGeo = new THREE.SphereGeometry(0.22, 6, 5);

const zombieBodyMat = flatMaterial(0x5f7a34);
const zombieHeadMat = flatMaterial(0x6b5f3a);
const bruteBodyMat = flatMaterial(0x3a4f22);
const bruteHeadMat = flatMaterial(0x33301c);
const survivorBodyMat = flatMaterial(0x3f6fa8);
const survivorHeadMat = flatMaterial(0xd8a97a);

const hpBarBgGeo = new THREE.PlaneGeometry(0.8, 0.12);
hpBarBgGeo.rotateX(-Math.PI / 2);
const hpBarBgMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const hpBarFgGeo = new THREE.PlaneGeometry(0.8, 0.12);
hpBarFgGeo.translate(0.4, 0, 0); // pivot at left edge
hpBarFgGeo.rotateX(-Math.PI / 2);

function disposeZombieMesh(group) {
  const fg = group.userData.hpFg;
  if (fg) fg.material.dispose();
}

function createZombieMesh(isBrute) {
  const group = new THREE.Group();
  const bodyGeo = isBrute ? bruteBodyGeo : zombieBodyGeo;
  const headGeo = isBrute ? bruteHeadGeo : zombieHeadGeo;
  const bodyMat = isBrute ? bruteBodyMat : zombieBodyMat;
  const headMat = isBrute ? bruteHeadMat : zombieHeadMat;
  const bodyH = bodyGeo.parameters.height;

  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = bodyH / 2;
  group.add(body);

  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = bodyH + headGeo.parameters.radius * 0.9;
  group.add(head);

  const barY = bodyH + headGeo.parameters.radius * 2 + 0.35;
  const bg = new THREE.Mesh(hpBarBgGeo, hpBarBgMat);
  bg.position.set(0, barY, 0);
  group.add(bg);
  const fg = new THREE.Mesh(hpBarFgGeo, new THREE.MeshBasicMaterial({ color: 0x9ACD32 }));
  fg.position.set(-0.4, barY + 0.001, 0);
  group.add(fg);
  group.userData.hpFg = fg;

  scene.add(group);
  return group;
}

function createSurvivorMesh() {
  const group = new THREE.Group();
  const bodyH = survivorBodyGeo.parameters.height;
  const body = new THREE.Mesh(survivorBodyGeo, survivorBodyMat);
  body.position.y = bodyH / 2;
  group.add(body);
  const head = new THREE.Mesh(survivorHeadGeo, survivorHeadMat);
  head.position.y = bodyH + survivorHeadGeo.parameters.radius * 0.9;
  group.add(head);
  group.visible = false;
  scene.add(group);
  return group;
}
const survivorPool = Array.from({ length: MAX_SURVIVORS }, createSurvivorMesh);

function layoutSurvivors() {
  let idx = 0;
  WALL_IDS.forEach(w => {
    const crew = Math.min(S.assignment[w], 5);
    if (crew <= 0) return;
    const p = DEFENSE_POINT[w];
    const axis = WALL_AXIS[w];
    const spacing = 0.85;
    for (let i = 0; i < crew; i++) {
      const mesh = survivorPool[idx++];
      if (!mesh) return;
      const off = (i - (crew - 1) / 2) * spacing;
      mesh.position.set(axis === "x" ? p.x + off : p.x, 0, axis === "z" ? p.z + off : p.z);
      mesh.visible = true;
    }
  });
  for (; idx < survivorPool.length; idx++) survivorPool[idx].visible = false;
}

const bulletMaterial = new THREE.LineBasicMaterial({ color: 0xf4e6b8 });
function spawnBullet(from, target) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(from.x, 0.9, from.z),
    new THREE.Vector3(target.x, 0.6, target.z),
  ]);
  const line = new THREE.Line(geo, bulletMaterial);
  scene.add(line);
  bullets.push({ line, geo, life: 0.08 });
}

function clearZombies() {
  zombies.forEach(z => { scene.remove(z.mesh); disposeZombieMesh(z.mesh); });
  zombies = [];
}
function clearBullets() {
  bullets.forEach(b => { scene.remove(b.line); b.geo.dispose(); });
  bullets = [];
}

// ---------------------------------------------------------------
// rewards
// ---------------------------------------------------------------
const REWARDS = [
  {
    id: "survivor", icon: "\u{1F464}", title: "New survivor",
    desc: "A stranger made it to your door. +1 survivor.",
    canApply: s => s.survivors < MAX_SURVIVORS,
    apply: s => { s.survivors = Math.min(MAX_SURVIVORS, s.survivors + 1); },
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
// difficulty curve (speeds rescaled from the old pixel-canvas space
// into world units; damage-over-time and hp values are unaffected
// by the coordinate-space change)
// ---------------------------------------------------------------
function difficultyForDay(day) {
  return {
    spawnInterval: Math.max(0.35, 1.9 - day * 0.09),
    zombieHp: 8 + day * 1.6,
    zombieSpeed: (15 + day * 0.7) / 9.6,
    zombieDamage: 5 + day * 0.5,
    bruteChance: Math.min(0.35, Math.max(0, (day - 3) * 0.05)),
  };
}

// ---------------------------------------------------------------
// UI: day screen
// ---------------------------------------------------------------
function updateDayScreen() {
  document.getElementById("dayTitle").textContent = "Night " + S.day;
  document.getElementById("daySurvivors").textContent = S.survivors;
  document.getElementById("dayFood").textContent = S.food;
  document.getElementById("dayAmmo").textContent = S.ammo;
  document.getElementById("dayWeapon").textContent = "Tier " + S.weaponTier;
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
  updateWallGlow();
}

// ---------------------------------------------------------------
// phase transitions
// ---------------------------------------------------------------
function goToMenu() {
  S = freshState();
  clearZombies();
  clearBullets();
  layoutSurvivors();
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
  updateDayScreen();
}

function startNight() {
  S.phase = "night";
  dayOverlay.hidden = true;
  hud.hidden = false;
  clearZombies();
  clearBullets();
  spawnTimer = 0.6;
  nightClock = NIGHT_DURATION;
  breached = false;
  fireCooldown = { N: 0, E: 0, S: 0, W: 0 };
  autoAssignTimer = 0;
  timerWrap.hidden = false;
  updateHud();
}

function endNightSuccess() {
  S.phase = "reward";
  S.nightsSurvived += 1;
  timerWrap.hidden = true;
  clearZombies();
  clearBullets();

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

function gameOver() {
  S.phase = "gameover";
  hud.hidden = true;
  timerWrap.hidden = true;
  clearZombies();
  clearBullets();
  document.getElementById("overLead").textContent =
    "You held for " + S.nightsSurvived + (S.nightsSurvived === 1 ? " night." : " nights.") +
    " " + S.kills + " kills.";
  overOverlay.hidden = false;
}

// ---------------------------------------------------------------
// automatic defense assignment — survivors go wherever the horde
// is actually hitting, split evenly across the active walls
// ---------------------------------------------------------------
function updateAutoAssignment(dt) {
  autoAssignTimer -= dt;
  if (autoAssignTimer > 0) return;
  autoAssignTimer = 0.5;

  const activeWalls = WALL_IDS.filter(w => zombies.some(z => z.wall === w));
  WALL_IDS.forEach(w => { S.assignment[w] = 0; });
  if (activeWalls.length === 0) return;

  const per = Math.floor(S.survivors / activeWalls.length);
  const remainder = S.survivors - per * activeWalls.length;
  activeWalls.forEach((w, i) => { S.assignment[w] = per + (i < remainder ? 1 : 0); });
}

// ---------------------------------------------------------------
// entities
// ---------------------------------------------------------------
function jitterTarget(wall) {
  const p = DEFENSE_POINT[wall];
  const spread = wall === "N" || wall === "S" ? 2.6 : 2.0;
  const axis = WALL_AXIS[wall];
  const j = (Math.random() * 2 - 1) * spread;
  return axis === "x" ? { x: p.x + j, z: p.z } : { x: p.x, z: p.z + j };
}

function spawnZombie() {
  const diff = difficultyForDay(S.day);
  const wall = WALL_IDS[Math.floor(Math.random() * 4)];
  const isBrute = Math.random() < diff.bruteChance;
  const along = (Math.random() - 0.5) * 16;
  let x, z;
  if (wall === "N") { x = along; z = -SPAWN_EDGE; }
  else if (wall === "S") { x = along; z = SPAWN_EDGE; }
  else if (wall === "E") { x = SPAWN_EDGE; z = along * 0.6; }
  else { x = -SPAWN_EDGE; z = along * 0.6; }

  const target = jitterTarget(wall);
  const mesh = createZombieMesh(isBrute);
  mesh.position.set(x, 0, z);
  zombies.push({
    x, z, wall, target,
    hp: isBrute ? diff.zombieHp * 3 : diff.zombieHp,
    maxHp: isBrute ? diff.zombieHp * 3 : diff.zombieHp,
    speed: isBrute ? diff.zombieSpeed * 0.6 : diff.zombieSpeed,
    dmg: isBrute ? diff.zombieDamage * 2 : diff.zombieDamage,
    arrived: false,
    bob: Math.random() * Math.PI * 2,
    mesh,
  });
}

function updateZombies(dt) {
  for (let i = zombies.length - 1; i >= 0; i--) {
    const z = zombies[i];
    const dx = z.target.x - z.x, dz = z.target.z - z.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.15) {
      z.arrived = false;
      z.x += (dx / dist) * z.speed * dt;
      z.z += (dz / dist) * z.speed * dt;
    } else {
      z.arrived = true;
      const wallHp = S.walls[z.wall];
      wallHp.hp -= z.dmg * dt;
      if (wallHp.hp <= 0) { wallHp.hp = 0; breached = true; }
    }
    z.bob += dt * 6;
    const bobY = z.arrived ? Math.sin(z.bob) * 0.08 : 0;
    z.mesh.position.set(z.x, bobY, z.z);

    if (z.hp <= 0) {
      scene.remove(z.mesh);
      disposeZombieMesh(z.mesh);
      zombies.splice(i, 1);
      S.kills += 1;
    } else {
      const frac = Math.max(0, z.hp / z.maxHp);
      const fg = z.mesh.userData.hpFg;
      fg.scale.x = frac;
      fg.material.color.setHex(frac > 0.4 ? 0x9ACD32 : 0xc0392b);
    }
  }
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.life -= dt;
    if (b.life <= 0) {
      scene.remove(b.line);
      b.geo.dispose();
      bullets.splice(i, 1);
    }
  }
}

function updateTurrets(dt) {
  WALL_IDS.forEach(w => {
    fireCooldown[w] = Math.max(0, fireCooldown[w] - dt);
    const crew = S.assignment[w];
    if (crew <= 0 || S.ammo <= 0) return;
    if (fireCooldown[w] > 0) return;

    // nearest zombie approaching this wall
    let best = null, bestDist = Infinity;
    for (const z of zombies) {
      if (z.wall !== w) continue;
      const d = Math.hypot(z.x - DEFENSE_POINT[w].x, z.z - DEFENSE_POINT[w].z);
      if (d < bestDist) { bestDist = d; best = z; }
    }
    if (!best) return;

    const dmg = 3 * S.weaponTier;
    best.hp -= dmg;
    S.ammo -= 1;
    spawnBullet(DEFENSE_POINT[w], best);

    const interval = Math.max(0.12, 0.85 / Math.min(crew, 6));
    fireCooldown[w] = interval;
  });
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
    updateAutoAssignment(dt);
    updateTurrets(dt);
    updateBullets(dt);
    layoutSurvivors();
    updateHud();

    nightClock -= dt;
    timerBar.style.width = Math.max(0, (nightClock / NIGHT_DURATION) * 100) + "%";

    if (breached) {
      gameOver();
    } else if (nightClock <= 0) {
      endNightSuccess();
    }
  }

  renderer.render(scene, camera);
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
