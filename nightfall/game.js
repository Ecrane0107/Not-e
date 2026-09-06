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

// each wall's fixed (perpendicular) coordinate: at the wall's outer face
// (where windows sit and bullets originate) and just inside it (where a
// stationed survivor actually stands)
const STATION_INSET = 0.55;
const WALL_OUTER = { N: -HOUSE_HALF_Z, S: HOUSE_HALF_Z, E: HOUSE_HALF_X, W: -HOUSE_HALF_X };
const WALL_INNER = {
  N: -(HOUSE_HALF_Z - STATION_INSET), S: HOUSE_HALF_Z - STATION_INSET,
  E: HOUSE_HALF_X - STATION_INSET, W: -(HOUSE_HALF_X - STATION_INSET),
};

// two windows per wall, three shooting slots per window — six stations a wall
const WINDOW_SLOT_SPACING = 0.55;
function computeWindowSlots(wall) {
  const axis = WALL_AXIS[wall];
  const half = axis === "x" ? HOUSE_HALF_X : HOUSE_HALF_Z;
  const windowCenters = [-half * 0.5, half * 0.5];
  const slots = [];
  windowCenters.forEach(c => { for (let i = -1; i <= 1; i++) slots.push(c + i * WINDOW_SLOT_SPACING); });
  return slots;
}
const WINDOW_SLOTS = {};
WALL_IDS.forEach(w => { WINDOW_SLOTS[w] = computeWindowSlots(w); });
const STATION_CAP = 6; // 2 windows x 3 slots

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
    ammo: 200,
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
let breached = false;
let autoAssignTimer = 0;
let zombiesSpawnedThisNight = 0;
let zombiesTotalThisNight = 0;

// ---------------------------------------------------------------
// DOM
// ---------------------------------------------------------------
const canvas = document.getElementById("game");

const hud = document.getElementById("hud");
const hudDay = document.getElementById("hudDay");
const hudSurvivors = document.getElementById("hudSurvivors");
const hudFood = document.getElementById("hudFood");
const hudAmmo = document.getElementById("hudAmmo");
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

// no roof and no solid box — a pitched roof (or even a flat box top) just
// hides everything from a steep top-down camera, so the house is an
// open-top shell: a floor plus four thin perimeter walls, dollhouse-style,
// so the survivors stationed inside stay visible
const WALL_THICKNESS = 0.25;

// each wall is built as three solid segments with real gaps left open at
// the two window spans — actual cutouts, not a decal, so they read from
// both outside and inside
const WINDOW_W = WINDOW_SLOT_SPACING * 3;
const WINDOW_H = 0.95;
const WINDOW_Y = 1.35;

function buildWall(wall, wallMat, windowMat) {
  const group = new THREE.Group();
  const axis = WALL_AXIS[wall];
  const half = axis === "x" ? HOUSE_HALF_X : HOUSE_HALF_Z;
  const outer = WALL_OUTER[wall];
  const centers = [-half * 0.5, half * 0.5];
  const spans = centers.map(c => [c - WINDOW_W / 2, c + WINDOW_W / 2]).sort((a, b) => a[0] - b[0]);
  const cuts = [-half, spans[0][0], spans[0][1], spans[1][0], spans[1][1], half];

  // three solid segments: left of both windows, between them, right of both
  for (let i = 0; i < cuts.length; i += 2) {
    const a = cuts[i], b = cuts[i + 1];
    const len = b - a;
    if (len <= 0.02) continue;
    const mid = (a + b) / 2;
    const geo = axis === "x"
      ? new THREE.BoxGeometry(len, HOUSE_HEIGHT, WALL_THICKNESS)
      : new THREE.BoxGeometry(WALL_THICKNESS, HOUSE_HEIGHT, len);
    const seg = new THREE.Mesh(geo, wallMat);
    seg.position.set(axis === "x" ? mid : outer, HOUSE_HEIGHT / 2, axis === "x" ? outer : mid);
    group.add(seg);
  }

  // a lintel above and a sill below each window, so the opening reads as
  // an actual window cut into the wall rather than a floor-to-ceiling gap
  spans.forEach(([a, b]) => {
    const mid = (a + b) / 2, w = b - a;
    const lintelH = HOUSE_HEIGHT - (WINDOW_Y + WINDOW_H / 2);
    const sillH = WINDOW_Y - WINDOW_H / 2;
    [
      { h: lintelH, y: WINDOW_Y + WINDOW_H / 2 + lintelH / 2 },
      { h: sillH, y: sillH / 2 },
    ].forEach(({ h, y }) => {
      if (h <= 0.02) return;
      const geo = axis === "x"
        ? new THREE.BoxGeometry(w, h, WALL_THICKNESS)
        : new THREE.BoxGeometry(WALL_THICKNESS, h, w);
      const seg = new THREE.Mesh(geo, wallMat);
      seg.position.set(axis === "x" ? mid : outer, y, axis === "x" ? outer : mid);
      group.add(seg);
    });

    // the window pane itself, double-sided so it reads from inside and out
    const paneGeo = new THREE.PlaneGeometry(w, WINDOW_H);
    const pane = new THREE.Mesh(paneGeo, windowMat);
    pane.position.set(axis === "x" ? mid : outer, WINDOW_Y, axis === "x" ? outer : mid);
    if (axis === "z") pane.rotation.y = Math.PI / 2;
    group.add(pane);
  });

  return group;
}

function buildHouse() {
  const group = new THREE.Group();

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(HOUSE_HALF_X * 2, HOUSE_HALF_Z * 2),
    flatMaterial(0x4a3f2c),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.01;
  group.add(floor);

  const wallMat = flatMaterial(0x8a7a5a);
  const windowMat = new THREE.MeshBasicMaterial({ color: 0xd8a24a, side: THREE.DoubleSide });
  WALL_IDS.forEach(w => group.add(buildWall(w, wallMat, windowMat)));

  const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.5, 0.05), flatMaterial(0x2c1d12));
  door.position.set(0, 0.75, HOUSE_HALF_Z + WALL_THICKNESS / 2 + 0.03);
  group.add(door);

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
const zombieLegsGeo = new THREE.BoxGeometry(0.5, 0.5, 0.3);
const zombieTorsoGeo = new THREE.BoxGeometry(0.55, 0.6, 0.32);
const zombieHeadGeo = new THREE.SphereGeometry(0.26, 8, 6);
const zombieArmGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 5);

const bruteLegsGeo = new THREE.BoxGeometry(0.75, 0.7, 0.46);
const bruteTorsoGeo = new THREE.BoxGeometry(0.85, 0.9, 0.5);
const bruteHeadGeo = new THREE.SphereGeometry(0.38, 8, 6);
const bruteArmGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.75, 5);

const survivorLegsGeo = new THREE.BoxGeometry(0.46, 0.45, 0.28);
const survivorTorsoGeo = new THREE.BoxGeometry(0.5, 0.55, 0.3);
const survivorHeadGeo = new THREE.SphereGeometry(0.22, 8, 6);
const survivorGunGeo = new THREE.BoxGeometry(0.12, 0.1, 0.55);

const zombieLegsMat = flatMaterial(0x3a3a28);
const zombieTorsoMat = flatMaterial(0x5f7a34);
const zombieHeadMat = flatMaterial(0x6b5f3a);
const bruteLegsMat = flatMaterial(0x262619);
const bruteTorsoMat = flatMaterial(0x3a4f22);
const bruteHeadMat = flatMaterial(0x33301c);
const survivorLegsMat = flatMaterial(0x24262b);
const survivorTorsoMat = flatMaterial(0x3f6fa8);
const survivorHeadMat = flatMaterial(0xd8a97a);
const survivorGunMat = flatMaterial(0x1c1c1c);

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
  const legsGeo = isBrute ? bruteLegsGeo : zombieLegsGeo;
  const torsoGeo = isBrute ? bruteTorsoGeo : zombieTorsoGeo;
  const headGeo = isBrute ? bruteHeadGeo : zombieHeadGeo;
  const armGeo = isBrute ? bruteArmGeo : zombieArmGeo;
  const legsMat = isBrute ? bruteLegsMat : zombieLegsMat;
  const torsoMat = isBrute ? bruteTorsoMat : zombieTorsoMat;
  const headMat = isBrute ? bruteHeadMat : zombieHeadMat;

  const legsH = legsGeo.parameters.height;
  const torsoH = torsoGeo.parameters.height;

  const legs = new THREE.Mesh(legsGeo, legsMat);
  legs.position.y = legsH / 2;
  group.add(legs);

  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = legsH + torsoH / 2;
  group.add(torso);

  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = legsH + torsoH + headGeo.parameters.radius * 0.9;
  group.add(head);

  // arms reaching forward, toward whatever they're attacking
  const armLen = armGeo.parameters.height;
  [-1, 1].forEach(side => {
    const arm = new THREE.Mesh(armGeo, torsoMat);
    arm.position.set(side * (torsoGeo.parameters.width / 2 + 0.02), legsH + torsoH * 0.78, armLen * 0.32);
    arm.rotation.x = Math.PI / 2.5;
    group.add(arm);
  });

  const barY = legsH + torsoH + headGeo.parameters.radius * 2 + 0.3;
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
  const legsH = survivorLegsGeo.parameters.height;
  const torsoH = survivorTorsoGeo.parameters.height;

  const legs = new THREE.Mesh(survivorLegsGeo, survivorLegsMat);
  legs.position.y = legsH / 2;
  group.add(legs);

  const torso = new THREE.Mesh(survivorTorsoGeo, survivorTorsoMat);
  torso.position.y = legsH + torsoH / 2;
  group.add(torso);

  const head = new THREE.Mesh(survivorHeadGeo, survivorHeadMat);
  head.position.y = legsH + torsoH + survivorHeadGeo.parameters.radius * 0.9;
  group.add(head);

  const gun = new THREE.Mesh(survivorGunGeo, survivorGunMat);
  gun.position.set(0.16, legsH + torsoH * 0.7, survivorGunGeo.parameters.depth / 2 + 0.1);
  group.add(gun);

  group.visible = false;
  scene.add(group);
  return group;
}

// which way a survivor faces at rest, straight out through their window
const WALL_FACE_ANGLE = { N: 0, E: Math.PI / 2, S: Math.PI, W: -Math.PI / 2 };

// each pool entry walks from wherever it is toward its assigned window
// station instead of snapping there — real (if simple) movement
const survivorPool = Array.from({ length: MAX_SURVIVORS }, () => ({
  mesh: createSurvivorMesh(),
  target: { x: 0, z: 0 },
  facing: 0,
  wall: null,
}));
const SURVIVOR_SPEED = 3.4; // units/sec walking inside the house
const AIM_TURN_SPEED = 6; // rad/sec — how fast a stationed survivor swings to track a target

function assignSurvivorStations() {
  let idx = 0;
  WALL_IDS.forEach(w => {
    const crew = Math.min(S.assignment[w], STATION_CAP);
    if (crew <= 0) return;
    const slots = WINDOW_SLOTS[w];
    const fixedVal = WALL_INNER[w];
    const axis = WALL_AXIS[w];
    for (let i = 0; i < crew; i++) {
      const p = survivorPool[idx++];
      if (!p) return;
      const off = slots[i];
      p.target.x = axis === "x" ? off : fixedVal;
      p.target.z = axis === "z" ? off : fixedVal;
      p.wall = w;
      if (!p.mesh.visible) {
        p.mesh.visible = true;
        p.mesh.position.set(0, 0, 0); // start from the house's center and walk out
        p.facing = WALL_FACE_ANGLE[w];
      }
    }
  });
  for (; idx < survivorPool.length; idx++) { survivorPool[idx].mesh.visible = false; survivorPool[idx].wall = null; }
}

function updateSurvivorMovement(dt) {
  survivorPool.forEach(p => {
    if (!p.mesh.visible) return;
    const dx = p.target.x - p.mesh.position.x;
    const dz = p.target.z - p.mesh.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.03) {
      const step = Math.min(dist, SURVIVOR_SPEED * dt);
      p.mesh.position.x += (dx / dist) * step;
      p.mesh.position.z += (dz / dist) * step;
      p.mesh.rotation.y = Math.atan2(dx, dz);
    } else {
      // ease toward the desired facing rather than snapping, so tracking
      // a moving zombie reads as an actual turn
      let delta = p.facing - p.mesh.rotation.y;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta)); // shortest way around
      const step = Math.max(-AIM_TURN_SPEED * dt, Math.min(AIM_TURN_SPEED * dt, delta));
      p.mesh.rotation.y += step;
    }
  });
}

// once a survivor is at their window, aim them at whatever zombie is
// actually threatening their wall instead of always facing dead ahead
function updateSurvivorAiming() {
  survivorPool.forEach(p => {
    if (!p.mesh.visible || p.wall == null) return;
    let best = null, bestDist = Infinity;
    for (const z of zombies) {
      if (z.wall !== p.wall) continue;
      const d = Math.hypot(z.x - p.mesh.position.x, z.z - p.mesh.position.z);
      if (d < bestDist) { bestDist = d; best = z; }
    }
    if (best) {
      p.facing = Math.atan2(best.x - p.mesh.position.x, best.z - p.mesh.position.z);
    } else {
      p.facing = WALL_FACE_ANGLE[p.wall];
    }
  });
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
    id: "survivor", icon: "\u{1F464}", title: "Look for more survivors",
    desc: "A stranger made it to your door. +1 survivor.",
    canApply: s => s.survivors < MAX_SURVIVORS,
    apply: s => { s.survivors = Math.min(MAX_SURVIVORS, s.survivors + 1); },
  },
  {
    id: "ammo", icon: "\u{1F9F0}", title: "Scavenge ammo",
    desc: "+25 rounds for the whole house.",
    apply: s => { s.ammo += 25; },
  },
  {
    id: "food", icon: "\u{1F96B}", title: "Scavenge food",
    desc: "+12 food. Keeps everyone standing a while longer.",
    apply: s => { s.food += 12; },
  },
  {
    id: "weapon", icon: "\u{1F52B}", title: "Upgrade weapons",
    desc: "Every shot hits harder, permanently.",
    apply: s => { s.weaponTier += 1; },
  },
  {
    id: "reinforce", icon: "\u{1F9F1}", title: "Reinforce walls",
    desc: "+20 max HP to every wall, fully repaired.",
    apply: s => { WALL_IDS.forEach(w => { s.walls[w].max += 20; s.walls[w].hp = s.walls[w].max; }); },
  },
  {
    id: "medkit", icon: "⚕️", title: "Repair walls",
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

// night 1 sends 3 zombies; each night after that sends 1.5x as many as the last
function totalZombiesForNight(day) {
  return Math.max(1, Math.round(3 * Math.pow(1.5, day - 1)));
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
  assignSurvivorStations();
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
  breached = false;
  fireCooldown = { N: 0, E: 0, S: 0, W: 0 };
  autoAssignTimer = 0;
  zombiesSpawnedThisNight = 0;
  zombiesTotalThisNight = totalZombiesForNight(S.day);
  updateHud();
}

function endNightSuccess() {
  S.phase = "reward";
  S.nightsSurvived += 1;
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
  if (activeWalls.length === 0) { assignSurvivorStations(); return; }

  const per = Math.floor(S.survivors / activeWalls.length);
  const remainder = S.survivors - per * activeWalls.length;
  activeWalls.forEach((w, i) => { S.assignment[w] = per + (i < remainder ? 1 : 0); });
  assignSurvivorStations();
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
  zombiesSpawnedThisNight += 1;
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

// how many survivors assigned to a wall have actually reached their window
// — someone still walking over doesn't get to shoot yet
function arrivedCrewCount(wall) {
  let n = 0;
  for (const p of survivorPool) {
    if (p.wall !== wall || !p.mesh.visible) continue;
    const dx = p.target.x - p.mesh.position.x, dz = p.target.z - p.mesh.position.z;
    if (Math.hypot(dx, dz) < 0.05) n++;
  }
  return n;
}

function updateTurrets(dt) {
  WALL_IDS.forEach(w => {
    fireCooldown[w] = Math.max(0, fireCooldown[w] - dt);
    const crew = arrivedCrewCount(w);
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

    // fire from whichever window slot sits closest to the target, along the wall
    const axis = WALL_AXIS[w];
    const targetOffset = axis === "x" ? best.x : best.z;
    const slots = WINDOW_SLOTS[w].slice(0, Math.min(crew, STATION_CAP));
    let nearestOff = slots[0], nearestD = Infinity;
    slots.forEach(o => { const d = Math.abs(o - targetOffset); if (d < nearestD) { nearestD = d; nearestOff = o; } });
    const from = axis === "x" ? { x: nearestOff, z: WALL_OUTER[w] } : { x: WALL_OUTER[w], z: nearestOff };
    spawnBullet(from, best);

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
    if (zombiesSpawnedThisNight < zombiesTotalThisNight) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) { spawnZombie(); spawnTimer = diff.spawnInterval; }
    }

    updateZombies(dt);
    updateAutoAssignment(dt);
    updateTurrets(dt);
    updateBullets(dt);
    updateSurvivorAiming();
    updateSurvivorMovement(dt);
    updateHud();

    const allSpawned = zombiesSpawnedThisNight >= zombiesTotalThisNight;
    if (breached) {
      gameOver();
    } else if (allSpawned && zombies.length === 0) {
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
