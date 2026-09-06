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
const BASE_MAX_SURVIVORS = 24; // the house alone can shelter this many
const TOWER_GARRISON_CAP = 5; // and each built tower can hold 5 more, both as a garrison limit and as extra population capacity
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

// two windows per wall, three shooting slots per window — six stations a
// wall. Ordered so occupancy alternates between the two windows as crew
// grows (center A, center B, left A, left B, right A, right B) instead of
// filling window A completely before window B ever gets used.
const WINDOW_SLOT_SPACING = 0.55;
function computeWindowSlots(wall) {
  const axis = WALL_AXIS[wall];
  const half = axis === "x" ? HOUSE_HALF_X : HOUSE_HALF_Z;
  const [a, b] = [-half * 0.5, half * 0.5];
  return [a, b, a - WINDOW_SLOT_SPACING, b - WINDOW_SLOT_SPACING, a + WINDOW_SLOT_SPACING, b + WINDOW_SLOT_SPACING];
}
const WINDOW_SLOTS = {};
WALL_IDS.forEach(w => { WINDOW_SLOTS[w] = computeWindowSlots(w); });
const STATION_CAP = 6; // 2 windows x 3 slots

// corner towers — built with survivors+supplies, manually garrisoned each
// dawn, positioned diagonally outside the house (N is -z, E is +x, per the
// wall convention above)
const TOWER_IDS = ["NE", "NW", "SE", "SW"];
const TOWER_OFFSET = 2.2;
const TOWER_POS = {
  NE: { x: HOUSE_HALF_X + TOWER_OFFSET, z: -(HOUSE_HALF_Z + TOWER_OFFSET) },
  NW: { x: -(HOUSE_HALF_X + TOWER_OFFSET), z: -(HOUSE_HALF_Z + TOWER_OFFSET) },
  SE: { x: HOUSE_HALF_X + TOWER_OFFSET, z: HOUSE_HALF_Z + TOWER_OFFSET },
  SW: { x: -(HOUSE_HALF_X + TOWER_OFFSET), z: HOUSE_HALF_Z + TOWER_OFFSET },
};
const TOWER_LABEL = { NE: "Northeast tower", NW: "Northwest tower", SE: "Southeast tower", SW: "Southwest tower" };
const TOWER_SUPPLY_COST = 50;
const TOWER_SURVIVOR_COST = 4;

// melee fallback: point-blank or out of ammo, defenders switch to spears
const MELEE_DMG = 4;
const MELEE_INTERVAL_BASE = 0.5;

// ---------------------------------------------------------------
// state
// ---------------------------------------------------------------
function freshState() {
  return {
    phase: "menu", // menu | day | night | reward | gameover
    day: 1,
    survivors: 3,
    assignment: { N: 0, E: 0, S: 0, W: 0 }, // recomputed automatically each night, house crew only
    towerAssignment: { NE: 0, NW: 0, SE: 0, SW: 0 }, // set manually on the day screen
    food: 30,
    ammo: 300,
    supplies: 0,
    reputation: 0, // resolves into recruits at the end of each successful night, then resets
    weaponTier: 1,
    towers: [], // built tower ids, in build order
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
let fireCooldown = { N: 0, E: 0, S: 0, W: 0, NE: 0, NW: 0, SE: 0, SW: 0 };
let spawnTimer = 0;
let breached = false;
let autoAssignTimer = 0;
let zombiesSpawnedThisNight = 0;
let zombiesTotalThisNight = 0;
let currentTarget = { N: null, E: null, S: null, W: null, NE: null, NW: null, SE: null, SW: null }; // per-wall/tower target lock
let wallMeleeMode = { N: false, E: false, S: false, W: false }; // is this wall currently spear-fighting?

// ---------------------------------------------------------------
// DOM
// ---------------------------------------------------------------
const canvas = document.getElementById("game");

const hud = document.getElementById("hud");
const hudDay = document.getElementById("hudDay");
const hudSurvivors = document.getElementById("hudSurvivors");
const hudSurvivorsCap = document.getElementById("hudSurvivorsCap");
const hudFood = document.getElementById("hudFood");
const hudAmmo = document.getElementById("hudAmmo");
const hudSupplies = document.getElementById("hudSupplies");
const hudReputation = document.getElementById("hudReputation");
const hudWeapon = document.getElementById("hudWeapon");
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

// ---------------------------------------------------------------
// corner towers
// ---------------------------------------------------------------
function buildTowerMesh(pos) {
  const group = new THREE.Group();
  const postH = 2.2;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, postH, 6), flatMaterial(0x5a4a35));
  post.position.y = postH / 2;
  group.add(post);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.5), flatMaterial(0x6b5a3f));
  deck.position.y = postH + 0.075;
  group.add(deck);
  const railMat = flatMaterial(0x4a3d2c);
  [[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]].forEach(([x, z]) => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), railMat);
    rail.position.set(x, postH + 0.4, z);
    group.add(rail);
  });
  group.position.set(pos.x, 0, pos.z);
  return group;
}

const towerMeshes = {};
function ensureTowerBuilt(id) {
  if (towerMeshes[id]) return;
  const mesh = buildTowerMesh(TOWER_POS[id]);
  scene.add(mesh);
  towerMeshes[id] = mesh;
}
function clearTowerMeshes() {
  Object.keys(towerMeshes).forEach(id => { scene.remove(towerMeshes[id]); delete towerMeshes[id]; });
}

// a tower can shoot in any direction except through the house itself —
// sample along the line to the target and reject if any point falls
// inside the house's footprint
function hasLineOfSight(fromPos, toPos) {
  const steps = 12;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = fromPos.x + (toPos.x - fromPos.x) * t;
    const z = fromPos.z + (toPos.z - fromPos.z) * t;
    if (Math.abs(x) < HOUSE_HALF_X && Math.abs(z) < HOUSE_HALF_Z) return false;
  }
  return true;
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
const survivorSpearShaftGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.9, 5);
const survivorSpearTipGeo = new THREE.ConeGeometry(0.05, 0.14, 5);

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
const survivorSpearShaftMat = flatMaterial(0x5a4632);
const survivorSpearTipMat = flatMaterial(0xb9bec2);

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

  // held only when out of ammo or fighting off a zombie already at the wall
  const spear = new THREE.Group();
  const shaft = new THREE.Mesh(survivorSpearShaftGeo, survivorSpearShaftMat);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.set(0.16, legsH + torsoH * 0.6, 0.35);
  spear.add(shaft);
  const tip = new THREE.Mesh(survivorSpearTipGeo, survivorSpearTipMat);
  tip.rotation.x = Math.PI / 2;
  tip.position.set(0.16, legsH + torsoH * 0.6, 0.35 + 0.45 + 0.07);
  spear.add(tip);
  spear.visible = false;
  group.add(spear);

  group.visible = false;
  group.userData.gun = gun;
  group.userData.spear = spear;
  scene.add(group);
  return group;
}

// which way a survivor faces at rest, straight out through their window
const WALL_FACE_ANGLE = { N: 0, E: Math.PI / 2, S: Math.PI, W: -Math.PI / 2 };

// each pool entry walks from wherever it is toward its assigned window
// station instead of snapping there — real (if simple) movement. Sized to
// the most that could ever be stationed at house windows at once (every
// wall fully garrisoned), independent of the overall population cap —
// most of the population beyond this is in towers, not at a window.
const HOUSE_STATION_POOL_SIZE = WALL_IDS.length * STATION_CAP;
const survivorPool = Array.from({ length: HOUSE_STATION_POOL_SIZE }, () => ({
  mesh: createSurvivorMesh(),
  target: { x: 0, z: 0 },
  facing: 0,
  wall: null,
  slot: null,
}));
const SURVIVOR_SPEED = 3.4; // units/sec walking inside the house
const AIM_TURN_SPEED = 6; // rad/sec — how fast a stationed survivor swings to track a target

// Recomputes who's stationed where, but "sticky" — anyone already correctly
// posted at a station that's still needed keeps it untouched. Only a
// genuine change in demand moves anyone, and only survivors who were
// already active (just at a now-unneeded station) get retargeted smoothly;
// a hard reset-to-center-and-walk-out only happens for someone who was
// truly idle before. Without this, recomputing the roster from scratch
// every tick reshuffled which pool entry represented which station even
// when total demand barely changed, which looked like survivors randomly
// popping back to the house center ("respawning").
function assignSurvivorStations() {
  const needed = [];
  WALL_IDS.forEach(w => {
    const crew = Math.min(S.assignment[w], STATION_CAP);
    for (let i = 0; i < crew; i++) needed.push({ wall: w, slot: i });
  });

  const stillNeeded = needed.slice();
  const keep = new Set();
  survivorPool.forEach(p => {
    if (!p.mesh.visible || p.wall == null) return;
    const idx = stillNeeded.findIndex(n => n.wall === p.wall && n.slot === p.slot);
    if (idx !== -1) { stillNeeded.splice(idx, 1); keep.add(p); }
  });

  // prefer reassigning survivors who are already up and about (smooth
  // retarget, no pop) before waking up anyone who was fully idle
  const displaced = survivorPool.filter(p => p.mesh.visible && !keep.has(p));
  const idle = survivorPool.filter(p => !p.mesh.visible);
  const available = [...displaced, ...idle];

  stillNeeded.forEach(station => {
    const p = available.shift();
    if (!p) return;
    const slots = WINDOW_SLOTS[station.wall];
    const fixedVal = WALL_INNER[station.wall];
    const axis = WALL_AXIS[station.wall];
    const off = slots[station.slot];
    p.target.x = axis === "x" ? off : fixedVal;
    p.target.z = axis === "z" ? off : fixedVal;
    p.wall = station.wall;
    p.slot = station.slot;
    if (!p.mesh.visible) {
      p.mesh.visible = true;
      p.mesh.position.set(0, 0, 0); // was truly idle — walk out from the house's center
      p.facing = WALL_FACE_ANGLE[station.wall];
    }
  });

  available.forEach(p => { p.mesh.visible = false; p.wall = null; p.slot = null; });
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

// swap held weapon to match how that survivor's wall is currently fighting
function updateSurvivorWeaponVisual() {
  survivorPool.forEach(p => {
    if (!p.mesh.visible || p.wall == null) return;
    const melee = !!wallMeleeMode[p.wall];
    p.mesh.userData.gun.visible = !melee;
    p.mesh.userData.spear.visible = melee;
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

const meleeMaterial = new THREE.LineBasicMaterial({ color: 0xf2f2f2 });
function spawnMeleeStab(from, target) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(from.x, 0.9, from.z),
    new THREE.Vector3(target.x, 0.6, target.z),
  ]);
  const line = new THREE.Line(geo, meleeMaterial);
  scene.add(line);
  bullets.push({ line, geo, life: 0.15 });
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
// post-night tasks — every survivor is a point of labor to spend
// across these each dawn; the more you put on one task, the more it
// yields, so it's a real trade-off rather than a single free pick
// ---------------------------------------------------------------
// a 30-ammo base haul, scaled by headcount and then compounded another 5%
// per survivor beyond the first: 1 survivor = 1x = 30, 2 = 2x1.05 = 63,
// 3 = 3x1.05^2 = ~99, and so on — genuinely scales, not just a small bonus
function ammoScavengeAmount(n) {
  return n <= 0 ? 0 : Math.round(30 * n * Math.pow(1.05, n - 1));
}

const TASKS = [
  {
    id: "ammo", icon: "\u{1F9F0}", title: "Scavenge ammo", unit: "ammo",
    gain: n => ammoScavengeAmount(n),
    apply: (s, n) => { s.ammo += ammoScavengeAmount(n); },
  },
  {
    id: "food", icon: "\u{1F96B}", title: "Scavenge food", unit: "food",
    gain: n => n * 8,
    apply: (s, n) => { s.food += n * 8; },
  },
  {
    // reputation also builds automatically just for surviving each night
    // (see endNightSuccess) — this is the deliberate, chosen way to grow
    // it faster instead of leaving it to chance
    id: "recruit", icon: "\u{1F4E3}", title: "Go out and recruit", unit: "% reputation",
    gain: n => n * 5,
    apply: (s, n) => { s.reputation += n * 5; },
  },
  {
    id: "supplies", icon: "\u{1F4E6}", title: "Scavenge building supplies", unit: "supplies",
    gain: n => n * 5,
    apply: (s, n) => { s.supplies += n * 5; },
  },
  {
    id: "repair", icon: "\u{1F9F1}", title: "Repair walls", unit: "% hp, every wall",
    gain: n => n * 5,
    // never a full heal in one go — each survivor assigned patches 5% of
    // a wall's max hp, capped at that wall's own max
    apply: (s, n) => { WALL_IDS.forEach(w => { const wl = s.walls[w]; wl.hp = Math.min(wl.max, wl.hp + wl.max * 0.05 * n); }); },
  },
  {
    // flat cost of 2 survivors per tier, whatever tier you're currently at
    id: "weapon", icon: "\u{1F52B}", title: "Upgrade weapons", unit: "tier",
    gain: n => Math.floor(n / 2),
    apply: (s, n) => { s.weaponTier += Math.floor(n / 2); },
  },
  {
    // costs TOWER_SURVIVOR_COST survivors AND TOWER_SUPPLY_COST supplies
    // per tower — supplies scavenged in this same batch of tasks (the
    // "supplies" task above runs first) count toward it
    id: "tower", icon: "\u{1F3F0}", title: "Build a tower", unit: "tower",
    preview: n => {
      const wanted = Math.floor(n / TOWER_SURVIVOR_COST);
      const slotsLeft = TOWER_IDS.length - S.towers.length;
      if (slotsLeft <= 0) return "all 4 towers already built";
      if (wanted <= 0) return "needs " + TOWER_SURVIVOR_COST + " survivors + " + TOWER_SUPPLY_COST + " supplies each";
      return "+" + Math.min(wanted, slotsLeft) + " tower" + (wanted > 1 ? "s" : "") + " (supplies allowing)";
    },
    apply: (s, n) => {
      let toBuild = Math.floor(n / TOWER_SURVIVOR_COST);
      while (toBuild > 0 && s.towers.length < TOWER_IDS.length && s.supplies >= TOWER_SUPPLY_COST) {
        s.supplies -= TOWER_SUPPLY_COST;
        const next = TOWER_IDS.find(id => !s.towers.includes(id));
        s.towers.push(next);
        ensureTowerBuilt(next);
        toBuild--;
      }
    },
  },
];

let taskAlloc = {};

function renderTaskAllocation() {
  TASKS.forEach(t => { taskAlloc[t.id] = 0; });
  const listEl = document.getElementById("taskList");
  listEl.innerHTML = TASKS.map(t => `
    <div class="task-row">
      <span class="task-ico">${t.icon}</span>
      <div class="task-info">
        <div class="task-title">${t.title}</div>
        <div class="task-gain" id="taskGain-${t.id}">+0 ${t.unit}</div>
      </div>
      <div class="task-stepper">
        <button type="button" data-task="${t.id}" data-d="-1">&minus;</button>
        <span class="task-count" id="taskCount-${t.id}">0</span>
        <button type="button" data-task="${t.id}" data-d="1">+</button>
      </div>
    </div>
  `).join("");
  listEl.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.task, d = Number(btn.dataset.d);
      const total = Object.values(taskAlloc).reduce((a, b) => a + b, 0);
      if (d > 0 && total >= S.survivors) return;
      if (d < 0 && taskAlloc[id] <= 0) return;
      taskAlloc[id] += d;
      updateTaskUI();
    });
  });
  updateTaskUI();
}

function updateTaskUI() {
  const total = Object.values(taskAlloc).reduce((a, b) => a + b, 0);
  const remaining = S.survivors - total;
  document.getElementById("allocRemaining").textContent = remaining > 0
    ? remaining + (remaining === 1 ? " survivor left to assign" : " survivors left to assign")
    : "Everyone has a job tonight.";
  TASKS.forEach(t => {
    const n = taskAlloc[t.id];
    document.getElementById(`taskCount-${t.id}`).textContent = n;
    document.getElementById(`taskGain-${t.id}`).textContent = t.preview ? t.preview(n) : "+" + t.gain(n) + " " + t.unit;
    const row = document.getElementById(`taskCount-${t.id}`).closest(".task-row");
    row.querySelector('button[data-d="-1"]').disabled = n <= 0;
    row.querySelector('button[data-d="1"]').disabled = remaining <= 0;
  });
  document.getElementById("btnConfirmTasks").disabled = remaining !== 0;
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
// UI: day screen — includes manually garrisoning any built towers;
// whatever's left over defends the house via the usual auto-assignment
// ---------------------------------------------------------------
function housePersonnel() {
  return S.survivors - TOWER_IDS.reduce((a, id) => a + (S.towerAssignment[id] || 0), 0);
}

// total population capacity: the house's base capacity, plus 5 more for
// every tower built (a tower can garrison up to 5 on its own)
function maxSurvivorCap() {
  return BASE_MAX_SURVIVORS + TOWER_GARRISON_CAP * S.towers.length;
}

function clampTowerAssignment() {
  // no single tower holds more than TOWER_GARRISON_CAP
  TOWER_IDS.forEach(id => {
    if (S.towerAssignment[id] > TOWER_GARRISON_CAP) S.towerAssignment[id] = TOWER_GARRISON_CAP;
  });
  let total = TOWER_IDS.reduce((a, id) => a + (S.towerAssignment[id] || 0), 0);
  const order = [...TOWER_IDS].reverse();
  let i = 0;
  while (total > S.survivors && i < order.length) {
    const id = order[i];
    const cut = Math.min(S.towerAssignment[id] || 0, total - S.survivors);
    S.towerAssignment[id] -= cut;
    total -= cut;
    i++;
  }
}

function renderTowerAssignUI() {
  clampTowerAssignment();
  const section = document.getElementById("towerAssignSection");
  if (S.towers.length === 0) { section.hidden = true; return; }
  section.hidden = false;

  const listEl = document.getElementById("towerAssignList");
  listEl.innerHTML = S.towers.map(id => `
    <div class="task-row">
      <span class="task-ico">&#127984;</span>
      <div class="task-info">
        <div class="task-title">${TOWER_LABEL[id]}</div>
      </div>
      <div class="task-stepper">
        <button type="button" data-tower="${id}" data-d="-1" ${S.towerAssignment[id] <= 0 ? "disabled" : ""}>&minus;</button>
        <span class="task-count" id="towerCount-${id}">${S.towerAssignment[id]}</span>
        <button type="button" data-tower="${id}" data-d="1" ${(S.towerAssignment[id] >= TOWER_GARRISON_CAP || housePersonnel() <= 0) ? "disabled" : ""}>+</button>
      </div>
    </div>
  `).join("");
  listEl.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tower, d = Number(btn.dataset.d);
      if (d > 0 && (S.towerAssignment[id] >= TOWER_GARRISON_CAP || housePersonnel() <= 0)) return;
      if (d < 0 && S.towerAssignment[id] <= 0) return;
      S.towerAssignment[id] += d;
      renderTowerAssignUI();
    });
  });

  const inHouse = housePersonnel();
  document.getElementById("houseRemaining").textContent =
    inHouse + (inHouse === 1 ? " survivor stays in the house" : " survivors stay in the house");
}

function updateDayScreen() {
  document.getElementById("dayTitle").textContent = "Night " + S.day;
  document.getElementById("daySurvivors").textContent = S.survivors;
  document.getElementById("dayFood").textContent = S.food;
  document.getElementById("dayAmmo").textContent = S.ammo;
  document.getElementById("daySupplies").textContent = S.supplies;
  document.getElementById("dayReputation").textContent = S.reputation + "%";
  document.getElementById("dayWeapon").textContent = "Tier " + S.weaponTier;
  renderTowerAssignUI();
}

// ---------------------------------------------------------------
// UI: HUD updates
// ---------------------------------------------------------------
function updateHud() {
  hudDay.textContent = "Night " + S.day;
  hudSurvivors.textContent = S.survivors;
  hudSurvivorsCap.textContent = maxSurvivorCap();
  hudFood.textContent = S.food;
  hudAmmo.textContent = S.ammo;
  hudSupplies.textContent = S.supplies;
  hudReputation.textContent = S.reputation + "%";
  hudWeapon.textContent = "Tier " + S.weaponTier;
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
  clearTowerMeshes();
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
  fireCooldown = { N: 0, E: 0, S: 0, W: 0, NE: 0, NW: 0, SE: 0, SW: 0 };
  currentTarget = { N: null, E: null, S: null, W: null, NE: null, NW: null, SE: null, SW: null };
  wallMeleeMode = { N: false, E: false, S: false, W: false };
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

  // reputation: +10% just for surviving the night, on top of whatever the
  // "Go out and recruit" task built up when tasks were confirmed. It's a
  // permanent, ever-growing stat — it never resets or gets spent. Every
  // 100% you've built up is a guaranteed recruit *every* night from then
  // on; the leftover percent is an additional straight chance at one more.
  S.reputation += 10;
  {
    let recruits = Math.floor(S.reputation / 100);
    const chance = S.reputation % 100;
    if (Math.random() * 100 < chance) recruits += 1;
    const actual = Math.min(recruits, maxSurvivorCap() - S.survivors);
    if (actual > 0) {
      S.survivors += actual;
      showToast(actual === 1 ? "Word got around — a new survivor joined you." : actual + " new survivors joined you.");
    }
  }

  document.getElementById("rewardLead").textContent =
    "Night " + S.day + " is over. Send your people out to work before the next one.";
  renderTaskAllocation();
  rewardOverlay.hidden = false;

  // keep the HUD panel up (survivors/food/ammo/weapon/wall hp) while
  // choosing tasks, rendered above the overlay's dim backdrop
  hud.hidden = false;
  updateHud();
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
  // a lull between spawns (no zombies in flight at all) used to zero out
  // every wall's assignment here, which recalled the entire garrison to
  // idle — then the instant a new zombie appeared, all of them popped
  // back to the house center and walked out again. Just leave everyone
  // exactly where they are until there's real new demand to react to.
  if (activeWalls.length === 0) return;

  const houseCrew = housePersonnel();
  WALL_IDS.forEach(w => { S.assignment[w] = 0; });
  const per = Math.floor(houseCrew / activeWalls.length);
  const remainder = houseCrew - per * activeWalls.length;
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
  // face the exact direction of approach toward the house, not a fixed
  // cardinal angle — the jittered target means this varies naturally
  mesh.rotation.y = Math.atan2(target.x - x, target.z - z);
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
    if (crew <= 0) { wallMeleeMode[w] = false; return; }
    if (fireCooldown[w] > 0) return;

    // keep firing at whatever's already locked in until it's dead (removed
    // from the zombies array); only pick a new target once it's gone
    let best = currentTarget[w];
    if (!best || !zombies.includes(best)) {
      best = null;
      let bestDist = Infinity;
      for (const z of zombies) {
        if (z.wall !== w) continue;
        const d = Math.hypot(z.x - DEFENSE_POINT[w].x, z.z - DEFENSE_POINT[w].z);
        if (d < bestDist) { bestDist = d; best = z; }
      }
      currentTarget[w] = best;
    }
    if (!best) { wallMeleeMode[w] = false; return; }

    // spears only ever reach something already at the wall — ammo status
    // has no bearing on that. A zombie still approaching can only ever be
    // shot, never stabbed, and simply isn't engaged at all if there's no
    // ammo for it yet.
    if (best.arrived) {
      wallMeleeMode[w] = true;
      best.hp -= MELEE_DMG;
      if (best.hp <= 0) currentTarget[w] = null;
      spawnMeleeStab(DEFENSE_POINT[w], best);
      fireCooldown[w] = Math.max(0.15, MELEE_INTERVAL_BASE / Math.min(crew, 6));
      return;
    }

    wallMeleeMode[w] = false;
    if (S.ammo <= 0) return; // nothing to shoot with, and it's not close enough to stab

    const dmg = 3 * S.weaponTier;
    best.hp -= dmg;
    S.ammo -= 1;
    if (best.hp <= 0) currentTarget[w] = null; // dies this frame — free to retarget next shot

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

// corner towers: manually garrisoned, shoot anything they have line of
// sight to (any wall's zombies, not just "their" side), never melee since
// nothing ever reaches a tower to fight point-blank
function updateTowers(dt) {
  S.towers.forEach(id => {
    fireCooldown[id] = Math.max(0, (fireCooldown[id] || 0) - dt);
    const crew = S.towerAssignment[id] || 0;
    if (crew <= 0 || S.ammo <= 0) return;
    if (fireCooldown[id] > 0) return;

    let best = currentTarget[id];
    if (!best || !zombies.includes(best) || !hasLineOfSight(TOWER_POS[id], best)) {
      best = null;
      let bestDist = Infinity;
      for (const z of zombies) {
        if (!hasLineOfSight(TOWER_POS[id], z)) continue;
        const d = Math.hypot(z.x - TOWER_POS[id].x, z.z - TOWER_POS[id].z);
        if (d < bestDist) { bestDist = d; best = z; }
      }
      currentTarget[id] = best;
    }
    if (!best) return;

    const dmg = 3 * S.weaponTier;
    best.hp -= dmg;
    S.ammo -= 1;
    if (best.hp <= 0) currentTarget[id] = null;

    spawnBullet(TOWER_POS[id], best);
    fireCooldown[id] = Math.max(0.12, 0.85 / Math.min(crew, 6));
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
    updateTowers(dt);
    updateBullets(dt);
    updateSurvivorAiming();
    updateSurvivorMovement(dt);
    updateSurvivorWeaponVisual();
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
document.getElementById("btnConfirmTasks").addEventListener("click", () => {
  TASKS.forEach(t => t.apply(S, taskAlloc[t.id]));
  S.day += 1;
  goToDay();
});

requestAnimationFrame(frame);
