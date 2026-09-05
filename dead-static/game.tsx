import React, { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from 'react';
import * as THREE from 'three';
import { createRoot } from 'react-dom/client';

type GameStatus = 'menu' | 'playing' | 'paused' | 'dead' | 'cleared';
type EnemyState = 'patrol' | 'chase' | 'search' | 'attack' | 'stagger' | 'dead';
type WeaponId = 'handgun' | 'shotgun';

type WeaponConfig = {
  label: string;
  caliber: string;
  magazine: number;
  reserve: number;
  fireInterval: number;
  reloadTime: number;
  range: number;
  pellets: number;
  pelletDamage: number;
  spread: number;
  noiseRadius: number;
  recoil: number;
};

type ActionApi = {
  reset: (regenerate?: boolean) => void;
  shoot: () => void;
  reload: () => void;
  cycleWeapon: () => void;
  swapShoulder: () => void;
  setAim: (active: boolean) => void;
  setKey: (code: string, active: boolean) => void;
  touchLook: (dx: number, dy: number) => void;
};

type Enemy = {
  id: number;
  group: THREE.Group;
  targets: THREE.Mesh[];
  state: EnemyState;
  health: number;
  alive: boolean;
  speed: number;
  cooldown: number;
  attackTimer: number;
  stagger: number;
  spawn: THREE.Vector3;
  phase: number;
  lastKnown: THREE.Vector3;
  searchTarget: THREE.Vector3;
  searchTimer: number;
  memoryTimer: number;
  patrolIndex: number;
  searchIndex: number;
  nextSightCheck: number;
  rawSight: boolean;
  canSeePlayer: boolean;
  heardShotSerial: number;
  route: THREE.Vector3[];
  path: THREE.Vector3[];
  pathIndex: number;
  pathGoal: THREE.Vector3;
  pathRefresh: number;
  dwellTimer: number;
  sightConfirm: number;
  lostSightGrace: number;
  rig: {
    torso: THREE.Group;
    head: THREE.Group;
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftElbow: THREE.Group;
    rightElbow: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    leftKnee: THREE.Group;
    rightKnee: THREE.Group;
  };
};

type Obstacle = {
  x: number;
  z: number;
  halfX: number;
  halfZ: number;
};

type CoverSpec = {
  size: [number, number, number];
  position: [number, number, number];
  color: number;
};

type ArenaLayout = {
  name: string;
  cover: CoverSpec[];
};

type WebModelContext = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: Record<string, unknown>;
      annotations: {
        readOnlyHint: boolean;
        untrustedContentHint: boolean;
      };
      execute: (input: unknown) => unknown;
    },
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

const WEAPONS: Record<WeaponId, WeaponConfig> = {
  handgun: {
    label: 'Handgun',
    caliber: '9 MM',
    magazine: 8,
    reserve: 24,
    fireInterval: 265,
    reloadTime: 1150,
    range: 45,
    pellets: 1,
    pelletDamage: 1,
    spread: 0,
    noiseRadius: 18,
    recoil: 0.018,
  },
  shotgun: {
    label: 'Pump shotgun',
    caliber: '12 GA',
    magazine: 4,
    reserve: 12,
    fireInterval: 880,
    reloadTime: 1650,
    range: 23,
    pellets: 7,
    pelletDamage: 0.55,
    spread: 0.06,
    noiseRadius: 29,
    recoil: 0.065,
  },
};
const ENEMY_COUNT = 3;
const ROOM_HALF_X = 15;
const ROOM_HALF_Z = 13;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerpAngle(a: number, b: number, amount: number) {
  const delta = Math.atan2(Math.sin(b - a), Math.cos(b - a));
  return a + delta * amount;
}

async function requestPointerLockSafely(canvas: HTMLCanvasElement) {
  try {
    await canvas.requestPointerLock();
    return document.pointerLockElement === canvas;
  } catch {
    return false;
  }
}

export default function GamePrototype() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const actionsRef = useRef<ActionApi | null>(null);
  const statusRef = useRef<GameStatus>('menu');
  const audioRef = useRef<AudioContext | null>(null);
  const touchPointRef = useRef<{ x: number; y: number } | null>(null);

  const [status, setStatus] = useState<GameStatus>('menu');
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(WEAPONS.handgun.magazine);
  const [reserve, setReserve] = useState(WEAPONS.handgun.reserve);
  const [activeWeapon, setActiveWeapon] = useState<WeaponId>('handgun');
  const [layoutName, setLayoutName] = useState('Switchback');
  const [threatState, setThreatState] = useState('Patrolling');
  const [kills, setKills] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [hitMarker, setHitMarker] = useState(0);
  const [damageFlash, setDamageFlash] = useState(0);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  function sound(kind: 'shot' | 'shotgun' | 'hit' | 'hurt' | 'reload') {
    try {
      const Context =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Context) return;
      const context = audioRef.current ?? new Context();
      audioRef.current = context;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === 'shot' || kind === 'shotgun' ? 'sawtooth' : 'square';
      oscillator.frequency.setValueAtTime(
        kind === 'shotgun'
          ? 72
          : kind === 'shot'
            ? 105
            : kind === 'hit'
              ? 520
              : kind === 'hurt'
                ? 62
                : 260,
        now,
      );
      oscillator.frequency.exponentialRampToValueAtTime(
        kind === 'shotgun'
          ? 25
          : kind === 'shot'
            ? 38
            : kind === 'hit'
              ? 180
              : kind === 'hurt'
                ? 34
                : 420,
        now + (kind === 'reload' ? 0.08 : 0.13),
      );
      gain.gain.setValueAtTime(kind === 'shotgun' ? 0.19 : kind === 'shot' ? 0.13 : 0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (kind === 'shotgun' ? 0.2 : 0.14));
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + (kind === 'shotgun' ? 0.21 : 0.15));
    } catch {
      // Browsers may block audio; gameplay does not depend on it.
    }
  }

  useEffect(() => {
    const canvasNode = canvasRef.current;
    if (!canvasNode) return;
    const canvas: HTMLCanvasElement = canvasNode;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d0c);
    scene.fog = new THREE.FogExp2(0x0b0e0d, 0.026);

    const camera = new THREE.PerspectiveCamera(54, 16 / 9, 0.1, 80);
    const ambient = new THREE.HemisphereLight(0x758077, 0x17150f, 1.05);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xc9b98c, 1.35);
    keyLight.position.set(-7, 11, 8);
    scene.add(keyLight);
    const alarmLight = new THREE.PointLight(0xb62e22, 2.4, 13, 2);
    alarmLight.position.set(9.5, 3.2, -9.7);
    scene.add(alarmLight);

    const flatMaterial = (color: number, emissive = 0x000000) =>
      new THREE.MeshLambertMaterial({ color, emissive, flatShading: true });

    const blockers: THREE.Mesh[] = [];
    const obstacles: Obstacle[] = [];

    const grimeCanvas = document.createElement('canvas');
    grimeCanvas.width = 64;
    grimeCanvas.height = 64;
    const grimeContext = grimeCanvas.getContext('2d');
    let grimeSeed = 0x5f3759df;
    const grimeRandom = () => {
      grimeSeed ^= grimeSeed << 13;
      grimeSeed ^= grimeSeed >>> 17;
      grimeSeed ^= grimeSeed << 5;
      return (grimeSeed >>> 0) / 4294967296;
    };
    if (grimeContext) {
      grimeContext.fillStyle = '#383d37';
      grimeContext.fillRect(0, 0, 64, 64);
      for (let index = 0; index < 190; index += 1) {
        const shade = 22 + Math.floor(grimeRandom() * 34);
        grimeContext.fillStyle = `rgba(${shade}, ${shade + 5}, ${shade}, ${0.18 + grimeRandom() * 0.42})`;
        const size = 1 + Math.floor(grimeRandom() * 7);
        grimeContext.fillRect(
          Math.floor(grimeRandom() * 64),
          Math.floor(grimeRandom() * 64),
          size,
          Math.max(1, Math.floor(size * grimeRandom())),
        );
      }
    }
    const grimeTexture = new THREE.CanvasTexture(grimeCanvas);
    grimeTexture.colorSpace = THREE.SRGBColorSpace;
    grimeTexture.magFilter = THREE.NearestFilter;
    grimeTexture.minFilter = THREE.NearestFilter;
    grimeTexture.wrapS = THREE.RepeatWrapping;
    grimeTexture.wrapT = THREE.RepeatWrapping;
    grimeTexture.repeat.set(7.5, 6.5);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 26, 15, 13),
      new THREE.MeshLambertMaterial({
        color: 0x777b70,
        map: grimeTexture,
        flatShading: true,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    scene.add(floor);

    const gridPoints: number[] = [];
    for (let x = -15; x <= 15; x += 2) {
      gridPoints.push(x, 0.004, -13, x, 0.004, 13);
    }
    for (let z = -13; z <= 13; z += 2) {
      gridPoints.push(-15, 0.004, z, 15, 0.004, z);
    }
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
    const grid = new THREE.LineSegments(
      gridGeometry,
      new THREE.LineBasicMaterial({
        color: 0x3d4339,
        transparent: true,
        opacity: 0.16,
      }),
    );
    scene.add(grid);

    function addBox(
      size: [number, number, number],
      position: [number, number, number],
      color: number,
      rayBlocker = true,
    ) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), flatMaterial(color));
      mesh.position.set(...position);
      scene.add(mesh);
      if (rayBlocker) blockers.push(mesh);
      return mesh;
    }

    function addObstacle(
      size: [number, number, number],
      position: [number, number, number],
      color: number,
    ) {
      const mesh = addBox(size, position, color, true);
      obstacles.push({
        x: position[0],
        z: position[2],
        halfX: size[0] / 2,
        halfZ: size[2] / 2,
      });
      return mesh;
    }

    addBox([30.8, 4.4, 0.5], [0, 2.2, -13.25], 0x343a35);
    addBox([30.8, 4.4, 0.5], [0, 2.2, 13.25], 0x2b312d);
    addBox([0.5, 4.4, 26], [-15.25, 2.2, 0], 0x303631);
    addBox([0.5, 4.4, 26], [15.25, 2.2, 0], 0x303631);

    const arenaLayouts: ArenaLayout[] = [
      {
        name: 'Switchback',
        cover: [
          { size: [0.6, 3.5, 8.4], position: [-5.2, 1.75, -4.1], color: 0x3a403a },
          { size: [0.6, 3.5, 7.6], position: [4.8, 1.75, 4.4], color: 0x3a403a },
          { size: [6.2, 3.5, 0.6], position: [-10.1, 1.75, 2.8], color: 0x353b36 },
          { size: [6.4, 3.5, 0.6], position: [10, 1.75, -2.7], color: 0x353b36 },
          { size: [4.2, 3.5, 0.6], position: [0.2, 1.75, -8.1], color: 0x383e38 },
          { size: [1.25, 3.5, 1.25], position: [-1.7, 1.75, -2], color: 0x303731 },
          { size: [1.25, 3.5, 1.25], position: [2, 1.75, 3], color: 0x303731 },
          { size: [3.6, 1.2, 1.5], position: [0, 0.6, 0.2], color: 0x474b42 },
          { size: [2.4, 1.3, 1.4], position: [-10.5, 0.65, -7.4], color: 0x40463e },
          { size: [2.2, 1.15, 1.6], position: [10.6, 0.575, 7.6], color: 0x40463e },
        ],
      },
      {
        name: 'Crossfeed',
        cover: [
          { size: [8.2, 3.5, 0.6], position: [-8.8, 1.75, -3.7], color: 0x353b36 },
          { size: [6.4, 3.5, 0.6], position: [8.6, 1.75, -3.7], color: 0x383e38 },
          { size: [0.6, 3.5, 7.8], position: [0.3, 1.75, 4.2], color: 0x3a403a },
          { size: [0.6, 3.5, 4.8], position: [-7.8, 1.75, 6.4], color: 0x303731 },
          { size: [0.6, 3.5, 4.6], position: [8.3, 1.75, 6.5], color: 0x303731 },
          { size: [1.25, 3.5, 1.25], position: [-3.5, 1.75, -8], color: 0x303731 },
          { size: [1.25, 3.5, 1.25], position: [4.1, 1.75, -8.1], color: 0x303731 },
          { size: [3.2, 1.1, 1.5], position: [-4.5, 0.55, 2.7], color: 0x474b42 },
          { size: [3, 1.25, 1.4], position: [5.5, 0.625, 9.2], color: 0x40463e },
        ],
      },
      {
        name: 'Broken spine',
        cover: [
          { size: [0.6, 3.5, 6.8], position: [-2.7, 1.75, -6.4], color: 0x3a403a },
          { size: [7.4, 3.5, 0.6], position: [3.7, 1.75, -0.6], color: 0x353b36 },
          { size: [0.6, 3.5, 6.2], position: [7.1, 1.75, 6.5], color: 0x383e38 },
          { size: [5.2, 3.5, 0.6], position: [-9.6, 1.75, 6.3], color: 0x303731 },
          { size: [0.6, 3.5, 4.2], position: [-10.2, 1.75, -1.8], color: 0x303731 },
          { size: [1.25, 3.5, 1.25], position: [1.8, 1.75, 5.1], color: 0x303731 },
          { size: [1.25, 3.5, 1.25], position: [10.6, 1.75, -7.4], color: 0x303731 },
          { size: [3.5, 1.2, 1.4], position: [-6, 0.6, -8.8], color: 0x474b42 },
          { size: [2.7, 1.25, 1.5], position: [10.1, 0.625, 2.4], color: 0x40463e },
        ],
      },
    ];

    const generatedCoverMeshes: THREE.Mesh[] = [];
    let arenaGeneration = 0;

    function layoutNoise(seed: number) {
      const value = Math.sin(seed * 91.371 + 12.9898) * 43758.5453;
      return value - Math.floor(value);
    }

    function applyArenaLayout(generation: number) {
      generatedCoverMeshes.forEach((mesh) => {
        scene.remove(mesh);
        const blockerIndex = blockers.indexOf(mesh);
        if (blockerIndex >= 0) blockers.splice(blockerIndex, 1);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      generatedCoverMeshes.length = 0;
      obstacles.length = 0;

      const layout = arenaLayouts[generation % arenaLayouts.length];
      layout.cover.forEach((spec, index) => {
        const position = [...spec.position] as [number, number, number];
        if (spec.size[1] < 2) {
          position[0] += (layoutNoise(generation * 31 + index) - 0.5) * 0.7;
          position[2] += (layoutNoise(generation * 47 + index + 9) - 0.5) * 0.7;
        }
        generatedCoverMeshes.push(addObstacle(spec.size, position, spec.color));
      });
      setLayoutName(layout.name);
    }

    applyArenaLayout(arenaGeneration);

    addBox([4.2, 3.4, 0.32], [0, 1.7, -12.97], 0x202520);
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.6),
      flatMaterial(0x4d3428, 0x1c0804),
    );
    door.position.set(0, 1.3, -12.78);
    scene.add(door);
    blockers.push(door);
    const warning = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.08, 0.08),
      flatMaterial(0xc84931, 0x7c160e),
    );
    warning.position.set(0, 2.95, -12.58);
    scene.add(warning);

    for (let x = -12; x <= 12; x += 6) {
      const beam = addBox([0.24, 0.24, 26], [x, 4.05, 0], 0x1d221e, false);
      beam.rotation.z = x % 12 === 0 ? 0.01 : -0.01;
    }

    const pipeMaterial = flatMaterial(0x566052);
    for (const x of [-13.8, 13.8]) {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 24, 6),
        pipeMaterial,
      );
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(x, 2.9, 0);
      scene.add(pipe);
    }

    const consoleGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.35, 0.34),
      new THREE.MeshBasicMaterial({ color: 0x7b8e6c }),
    );
    consoleGlow.rotation.x = -0.72;
    consoleGlow.position.set(0, 1.22, -0.18);
    scene.add(consoleGlow);

    const ceilingLightMaterial = new THREE.MeshBasicMaterial({ color: 0xa2aa8d });
    for (const z of [-9.5, -2.5, 5.2, 10.2]) {
      const fixture = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.05, 2.8),
        ceilingLightMaterial,
      );
      fixture.position.set(z < 0 ? 7.7 : -8.2, 3.88, z);
      scene.add(fixture);
    }

    function addBlobShadow(parent: THREE.Group, radius: number) {
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(radius, 8),
        new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.36,
          depthWrite: false,
        }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.018;
      parent.add(shadow);
    }

    function limbGeometry(length: number, top: number, bottom: number) {
      return new THREE.CylinderGeometry(top, bottom, length, 6);
    }

    function taperedBoxGeometry(
      bottomWidth: number,
      bottomDepth: number,
      topWidth: number,
      topDepth: number,
      height: number,
    ) {
      const bw = bottomWidth / 2;
      const bd = bottomDepth / 2;
      const tw = topWidth / 2;
      const td = topDepth / 2;
      const h = height / 2;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          [
            -bw, -h, -bd, bw, -h, -bd, bw, -h, bd, -bw, -h, bd,
            -tw, h, -td, tw, h, -td, tw, h, td, -tw, h, td,
          ],
          3,
        ),
      );
      geometry.setIndex([
        0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7,
        0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5,
        2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7,
      ]);
      geometry.computeVertexNormals();
      return geometry;
    }

    function addHumanHead(
      parent: THREE.Group,
      skin: number,
      hair: number,
      style: number,
      markTarget?: (mesh: THREE.Mesh, multiplier: number) => void,
    ) {
      const skull = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 8, 6),
        flatMaterial(skin),
      );
      skull.scale.set(0.84, 1.02, 0.9);
      parent.add(skull);
      markTarget?.(skull, 2);

      const jaw = new THREE.Mesh(
        taperedBoxGeometry(0.105, 0.105, 0.205, 0.15, 0.115),
        flatMaterial(skin),
      );
      jaw.position.set(0, -0.105, -0.005);
      parent.add(jaw);
      markTarget?.(jaw, 2);

      for (const side of [-1, 1]) {
        const ear = new THREE.Mesh(
          new THREE.SphereGeometry(0.035, 5, 3),
          flatMaterial(skin),
        );
        ear.scale.set(0.48, 0.9, 0.45);
        ear.position.set(side * 0.132, 0.005, 0);
        parent.add(ear);
      }

      const featureMaterial = flatMaterial(style === 0 ? 0x312621 : 0x261d1b);
      for (const side of [-1, 1]) {
        const eye = new THREE.Mesh(
          new THREE.BoxGeometry(0.039, 0.016, 0.012),
          featureMaterial,
        );
        eye.position.set(side * 0.051, 0.027, -0.139);
        eye.rotation.y = side * 0.08;
        parent.add(eye);

        const brow = new THREE.Mesh(
          new THREE.BoxGeometry(0.048, 0.012, 0.014),
          flatMaterial(hair),
        );
        brow.position.set(side * 0.052, 0.054, -0.137);
        brow.rotation.z = side * (style === 0 ? 0.06 : -0.11);
        parent.add(brow);
      }

      const nose = new THREE.Mesh(
        new THREE.ConeGeometry(0.025, 0.072, 4),
        flatMaterial(new THREE.Color(skin).multiplyScalar(0.82).getHex()),
      );
      nose.rotation.x = -Math.PI / 2;
      nose.rotation.z = Math.PI / 4;
      nose.position.set(style === 2 ? 0.008 : -0.004, -0.005, -0.16);
      parent.add(nose);

      const mouth = new THREE.Mesh(
        new THREE.BoxGeometry(0.072, 0.009, 0.012),
        flatMaterial(style === 0 ? 0x5d3732 : 0x422b29),
      );
      mouth.position.set(0, -0.074, -0.133);
      mouth.rotation.z = style === 1 ? -0.06 : 0.025;
      parent.add(mouth);

      const hairCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.157, 7, 4, 0, Math.PI * 2, 0, Math.PI / 2),
        flatMaterial(hair),
      );
      hairCap.scale.set(0.88, 0.88, 0.94);
      hairCap.position.set(style === 2 ? 0.015 : -0.008, 0.035, 0.005);
      parent.add(hairCap);

      const clumpPositions =
        style === 0
          ? [
              [-0.085, 0.112, -0.102, -0.18],
              [-0.025, 0.132, -0.122, -0.06],
              [0.045, 0.126, -0.116, 0.08],
              [0.098, 0.092, -0.086, 0.2],
            ]
          : style === 1
            ? [
                [-0.09, 0.105, -0.1, -0.28],
                [-0.03, 0.128, -0.116, -0.09],
                [0.04, 0.116, -0.11, 0.14],
              ]
            : [
                [-0.102, 0.085, -0.08, -0.36],
                [-0.045, 0.13, -0.118, -0.14],
                [0.025, 0.122, -0.12, 0.08],
                [0.086, 0.095, -0.09, 0.32],
              ];
      clumpPositions.forEach(([x, y, z, rotation]) => {
        const clump = new THREE.Mesh(
          taperedBoxGeometry(0.045, 0.038, 0.078, 0.07, 0.13),
          flatMaterial(hair),
        );
        clump.position.set(x, y, z);
        clump.rotation.z = rotation;
        clump.rotation.x = -0.18;
        parent.add(clump);
      });
    }

    const player = new THREE.Group();
    const playerSpawn = new THREE.Vector3(-1.3, 0, 8.2);
    player.position.copy(playerSpawn);
    scene.add(player);
    addBlobShadow(player, 0.5);

    const playerPelvis = new THREE.Mesh(
      taperedBoxGeometry(0.36, 0.22, 0.4, 0.24, 0.24),
      flatMaterial(0x343b3a),
    );
    playerPelvis.position.y = 0.94;
    player.add(playerPelvis);
    const playerBelt = new THREE.Mesh(
      new THREE.BoxGeometry(0.405, 0.055, 0.25),
      flatMaterial(0x252927),
    );
    playerBelt.position.y = 1.055;
    player.add(playerBelt);
    const beltBuckle = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.047, 0.018),
      flatMaterial(0x777466),
    );
    beltBuckle.position.set(0, 1.055, -0.137);
    player.add(beltBuckle);

    const playerTorso = new THREE.Group();
    playerTorso.position.y = 1.34;
    playerTorso.rotation.x = 0.035;
    player.add(playerTorso);
    const playerJacket = new THREE.Mesh(
      taperedBoxGeometry(0.42, 0.225, 0.54, 0.27, 0.55),
      flatMaterial(0x4b5a50),
    );
    playerJacket.userData = { playerBody: true };
    playerTorso.add(playerJacket);

    const shirtFront = new THREE.Mesh(
      new THREE.BoxGeometry(0.17, 0.48, 0.025),
      flatMaterial(0x3b3936),
    );
    shirtFront.position.set(0, -0.005, -0.148);
    playerTorso.add(shirtFront);

    for (const side of [-1, 1]) {
      const frontPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.48, 0.035),
        flatMaterial(side < 0 ? 0x526158 : 0x46564d),
      );
      frontPanel.position.set(side * 0.17, -0.025, -0.148);
      playerTorso.add(frontPanel);

      const lapel = new THREE.Mesh(
        new THREE.BoxGeometry(0.085, 0.27, 0.028),
        flatMaterial(side < 0 ? 0x667267 : 0x59675d),
      );
      lapel.position.set(side * 0.083, 0.14, -0.173);
      lapel.rotation.z = side * 0.32;
      playerTorso.add(lapel);

      const pocket = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.105, 0.025),
        flatMaterial(0x3f4d45),
      );
      pocket.position.set(side * 0.16, -0.115, -0.177);
      playerTorso.add(pocket);
      const pocketFlap = new THREE.Mesh(
        new THREE.BoxGeometry(0.145, 0.035, 0.034),
        flatMaterial(0x657166),
      );
      pocketFlap.position.set(side * 0.16, -0.057, -0.18);
      playerTorso.add(pocketFlap);
    }

    const zipper = new THREE.Mesh(
      new THREE.BoxGeometry(0.014, 0.5, 0.012),
      flatMaterial(0x8a8877),
    );
    zipper.position.set(0.006, -0.03, -0.17);
    playerTorso.add(zipper);
    const jacketYoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.43, 0.09, 0.025),
      flatMaterial(0x59675d),
    );
    jacketYoke.position.set(0, 0.17, 0.151);
    playerTorso.add(jacketYoke);

    const shoulderPatch = new THREE.Mesh(
      new THREE.BoxGeometry(0.075, 0.09, 0.016),
      flatMaterial(0x9a6b35),
    );
    shoulderPatch.position.set(-0.235, 0.095, -0.145);
    shoulderPatch.rotation.y = -0.28;
    playerTorso.add(shoulderPatch);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.07, 0.12, 6),
      flatMaterial(0x9d755b),
    );
    neck.position.y = 0.335;
    playerTorso.add(neck);
    for (const side of [-1, 1]) {
      const collar = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.075, 0.16),
        flatMaterial(0x39453f),
      );
      collar.position.set(side * 0.075, 0.285, -0.015);
      collar.rotation.z = side * 0.18;
      playerTorso.add(collar);
    }

    const playerHeadPivot = new THREE.Group();
    playerHeadPivot.position.set(0, 0.535, -0.012);
    playerTorso.add(playerHeadPivot);
    addHumanHead(playerHeadPivot, 0xa67d62, 0x30281f, 0);

    function createPlayerLeg(x: number) {
      const hip = new THREE.Group();
      hip.position.set(x, 0.89, 0);
      player.add(hip);
      const thigh = new THREE.Mesh(
        taperedBoxGeometry(0.13, 0.145, 0.165, 0.18, 0.43),
        flatMaterial(x < 0 ? 0x303838 : 0x2b3434),
      );
      thigh.position.y = -0.215;
      hip.add(thigh);
      const knee = new THREE.Group();
      knee.position.y = -0.42;
      hip.add(knee);
      const shin = new THREE.Mesh(
        taperedBoxGeometry(0.105, 0.125, 0.135, 0.15, 0.4),
        flatMaterial(x < 0 ? 0x293232 : 0x273030),
      );
      shin.position.y = -0.2;
      knee.add(shin);
      const kneeSeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.035, 0.155),
        flatMaterial(0x3c4442),
      );
      kneeSeam.position.y = -0.015;
      knee.add(kneeSeam);
      const ankle = new THREE.Group();
      ankle.position.y = -0.39;
      knee.add(ankle);
      const shoe = new THREE.Mesh(
        taperedBoxGeometry(0.15, 0.28, 0.17, 0.22, 0.12),
        flatMaterial(0x1a1c1b),
      );
      shoe.position.set(0, -0.055, -0.045);
      ankle.add(shoe);
      const sole = new THREE.Mesh(
        new THREE.BoxGeometry(0.175, 0.035, 0.295),
        flatMaterial(0x0d0f0e),
      );
      sole.position.set(0, -0.12, -0.045);
      ankle.add(sole);
      return { hip, knee, ankle };
    }

    function createPlayerArm(x: number) {
      const shoulder = new THREE.Group();
      shoulder.position.set(x, 0.2, 0);
      playerTorso.add(shoulder);
      const shoulderCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.105, 6, 4),
        flatMaterial(x < 0 ? 0x526158 : 0x48584f),
      );
      shoulderCap.scale.set(0.78, 1.0, 0.82);
      shoulder.add(shoulderCap);
      const upperArm = new THREE.Mesh(
        taperedBoxGeometry(0.115, 0.125, 0.15, 0.155, 0.3),
        flatMaterial(x < 0 ? 0x536158 : 0x4a5950),
      );
      upperArm.position.y = -0.15;
      shoulder.add(upperArm);
      const elbow = new THREE.Group();
      elbow.position.y = -0.295;
      shoulder.add(elbow);
      const forearm = new THREE.Mesh(
        taperedBoxGeometry(0.09, 0.1, 0.12, 0.13, 0.265),
        flatMaterial(x < 0 ? 0x46554c : 0x425149),
      );
      forearm.position.y = -0.132;
      elbow.add(forearm);
      const cuff = new THREE.Mesh(
        new THREE.BoxGeometry(0.105, 0.045, 0.115),
        flatMaterial(0x334039),
      );
      cuff.position.y = -0.25;
      elbow.add(cuff);
      const wrist = new THREE.Group();
      wrist.position.y = -0.275;
      elbow.add(wrist);
      const hand = new THREE.Mesh(
        taperedBoxGeometry(0.082, 0.075, 0.105, 0.09, 0.125),
        flatMaterial(0xa67d62),
      );
      hand.position.y = -0.07;
      wrist.add(hand);
      const thumb = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.075, 0.045),
        flatMaterial(0x956e57),
      );
      thumb.position.set(x < 0 ? 0.055 : -0.055, -0.045, -0.025);
      thumb.rotation.z = x < 0 ? -0.25 : 0.25;
      wrist.add(thumb);
      return { shoulder, elbow, wrist, hand };
    }

    const leftLegRig = createPlayerLeg(-0.115);
    const rightLegRig = createPlayerLeg(0.115);
    const leftLeg = leftLegRig.hip;
    const rightLeg = rightLegRig.hip;
    const leftArmRig = createPlayerArm(-0.285);
    const rightArmRig = createPlayerArm(0.285);
    const leftArm = leftArmRig.shoulder;
    const rightArm = rightArmRig.shoulder;
    const handgun = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.15, 0.36),
      flatMaterial(0x171a18),
    );
    handgun.position.set(0, -0.155, -0.18);
    rightArmRig.wrist.add(handgun);
    const handgunSlide = new THREE.Mesh(
      new THREE.BoxGeometry(0.105, 0.07, 0.26),
      flatMaterial(0x353936),
    );
    handgunSlide.position.set(0, 0.055, -0.04);
    handgun.add(handgunSlide);
    const handgunGrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.19, 0.105),
      flatMaterial(0x242724),
    );
    handgunGrip.position.set(0, -0.13, 0.09);
    handgunGrip.rotation.x = -0.18;
    handgun.add(handgunGrip);

    const shotgun = new THREE.Group();
    shotgun.position.set(0, -0.155, -0.38);
    shotgun.visible = false;
    rightArmRig.wrist.add(shotgun);
    const shotgunReceiver = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.16, 0.42),
      flatMaterial(0x232725),
    );
    shotgun.add(shotgunReceiver);
    const shotgunStock = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.18, 0.42),
      flatMaterial(0x4a3124),
    );
    shotgunStock.position.set(0, -0.035, 0.38);
    shotgunStock.rotation.x = -0.18;
    shotgun.add(shotgunStock);
    const shotgunBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.047, 0.055, 0.72, 6),
      flatMaterial(0x191c1b),
    );
    shotgunBarrel.rotation.x = Math.PI / 2;
    shotgunBarrel.position.z = -0.55;
    shotgun.add(shotgunBarrel);
    const shotgunPump = new THREE.Mesh(
      new THREE.BoxGeometry(0.17, 0.16, 0.25),
      flatMaterial(0x49372a),
    );
    shotgunPump.position.set(0, -0.025, -0.35);
    shotgun.add(shotgunPump);

    const enemySpawns = [
      new THREE.Vector3(-11.5, 0, -10.2),
      new THREE.Vector3(0.8, 0, -10.5),
      new THREE.Vector3(11.7, 0, -8.2),
    ];
    const patrolRoutes = [
      [
        new THREE.Vector3(-11.5, 0, -10.2),
        new THREE.Vector3(-8.2, 0, -8.3),
        new THREE.Vector3(-7.4, 0, -3.5),
        new THREE.Vector3(-12.1, 0, 0.6),
        new THREE.Vector3(-6.2, 0, 1.7),
        new THREE.Vector3(-6.2, 0, 4.0),
        new THREE.Vector3(-6.8, 0, 5.4),
      ],
      [
        new THREE.Vector3(0.8, 0, -10.5),
        new THREE.Vector3(3.4, 0, -9.7),
        new THREE.Vector3(3.1, 0, -4.4),
        new THREE.Vector3(-2.8, 0, -4.2),
        new THREE.Vector3(-2.9, 0, -9.7),
      ],
      [
        new THREE.Vector3(11.7, 0, -8.2),
        new THREE.Vector3(7.4, 0, -6.2),
        new THREE.Vector3(5.9, 0, -4.0),
        new THREE.Vector3(5.9, 0, -1.4),
        new THREE.Vector3(7.0, 0, 0.2),
        new THREE.Vector3(11.5, 0, 4.5),
        new THREE.Vector3(12.0, 0, 10.0),
        new THREE.Vector3(7.2, 0, 9.3),
      ],
    ];

    function createEnemy(
      id: number,
      spawn: THREE.Vector3,
      route: THREE.Vector3[],
    ): Enemy {
      const group = new THREE.Group();
      group.position.copy(spawn);
      scene.add(group);
      addBlobShadow(group, 0.48);

      const targets: THREE.Mesh[] = [];
      const palette = [
        {
          jacket: 0x625a4d,
          jacketDark: 0x4d473e,
          jacketLight: 0x746b5a,
          shirt: 0x343533,
          trousers: 0x302f2b,
          skin: 0x8b6954,
          hair: 0x251f1a,
          accent: 0x6e4230,
        },
        {
          jacket: 0x46514e,
          jacketDark: 0x343e3c,
          jacketLight: 0x59625e,
          shirt: 0x4d443a,
          trousers: 0x293130,
          skin: 0x92705b,
          hair: 0x3b3228,
          accent: 0x88754c,
        },
        {
          jacket: 0x5d4e4b,
          jacketDark: 0x473b3a,
          jacketLight: 0x705e58,
          shirt: 0x302d31,
          trousers: 0x33302f,
          skin: 0x7f6052,
          hair: 0x181716,
          accent: 0x69423d,
        },
      ][id];
      const markTarget = (mesh: THREE.Mesh, multiplier: number) => {
        mesh.userData = { enemyId: id, multiplier };
        targets.push(mesh);
      };

      const torso = new THREE.Group();
      torso.position.y = 1.34;
      torso.rotation.x = id === 2 ? 0.12 : 0.075;
      torso.rotation.z = id % 2 ? 0.035 : -0.045;
      group.add(torso);
      const coat = new THREE.Mesh(
        taperedBoxGeometry(
          id === 1 ? 0.405 : 0.43,
          0.23,
          id === 2 ? 0.55 : 0.52,
          0.27,
          0.54,
        ),
        flatMaterial(palette.jacket),
      );
      markTarget(coat, 1);
      torso.add(coat);

      const shirtFront = new THREE.Mesh(
        new THREE.BoxGeometry(id === 1 ? 0.2 : 0.15, 0.44, 0.024),
        flatMaterial(palette.shirt),
      );
      shirtFront.position.set(id === 2 ? -0.025 : 0, -0.01, -0.149);
      torso.add(shirtFront);

      for (const side of [-1, 1]) {
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(id === 1 ? 0.135 : 0.16, 0.46, 0.035),
          flatMaterial(side < 0 ? palette.jacketLight : palette.jacketDark),
        );
        panel.position.set(side * (id === 1 ? 0.165 : 0.17), -0.025, -0.151);
        panel.rotation.z = id === 2 && side > 0 ? -0.035 : 0;
        torso.add(panel);

        const lapel = new THREE.Mesh(
          new THREE.BoxGeometry(0.075, id === 0 ? 0.28 : 0.23, 0.03),
          flatMaterial(side < 0 ? palette.jacketLight : palette.jacketDark),
        );
        lapel.position.set(side * 0.078, 0.135, -0.174);
        lapel.rotation.z = side * (id === 1 ? 0.25 : 0.34);
        torso.add(lapel);
      }

      if (id === 0) {
        for (const side of [-1, 1]) {
          const coatTail = new THREE.Mesh(
            taperedBoxGeometry(0.19, 0.21, 0.21, 0.235, 0.39),
            flatMaterial(side < 0 ? palette.jacket : palette.jacketDark),
          );
          coatTail.position.set(side * 0.105, -0.43, 0.01);
          coatTail.rotation.z = side * 0.035;
          markTarget(coatTail, 0.9);
          torso.add(coatTail);
        }
        const collarWrap = new THREE.Mesh(
          new THREE.BoxGeometry(0.29, 0.115, 0.21),
          flatMaterial(palette.jacketDark),
        );
        collarWrap.position.set(0, 0.27, 0.015);
        torso.add(collarWrap);
      } else if (id === 1) {
        const workVest = new THREE.Mesh(
          taperedBoxGeometry(0.315, 0.245, 0.38, 0.275, 0.34),
          flatMaterial(palette.jacketDark),
        );
        workVest.position.set(0, 0.005, -0.012);
        torso.add(workVest);
        const vestStripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.29, 0.04, 0.024),
          flatMaterial(palette.accent),
        );
        vestStripe.position.set(0, 0.02, -0.164);
        torso.add(vestStripe);
      } else {
        const scarf = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.16, 0.12, 6),
          flatMaterial(0x292426),
        );
        scarf.position.set(0.025, 0.3, -0.005);
        scarf.rotation.z = -0.08;
        torso.add(scarf);
        const tornPatch = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.16, 0.028),
          flatMaterial(palette.accent),
        );
        tornPatch.position.set(0.17, -0.08, -0.177);
        tornPatch.rotation.z = -0.1;
        torso.add(tornPatch);
      }

      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.07, 0.115, 6),
        flatMaterial(palette.skin),
      );
      neck.position.set(id === 2 ? 0.018 : 0, 0.335, -0.005);
      torso.add(neck);

      const headPivot = new THREE.Group();
      headPivot.position.set(id % 2 ? 0.018 : -0.018, 0.535, -0.025);
      headPivot.rotation.z = id % 2 ? 0.055 : -0.07;
      torso.add(headPivot);
      addHumanHead(headPivot, palette.skin, palette.hair, (id + 1) % 3, markTarget);
      if (id === 2) {
        const scar = new THREE.Mesh(
          new THREE.BoxGeometry(0.014, 0.075, 0.01),
          flatMaterial(0x552f2c),
        );
        scar.position.set(0.057, 0.01, -0.145);
        scar.rotation.z = -0.3;
        headPivot.add(scar);
      }

      function createEnemyLeg(x: number) {
        const hip = new THREE.Group();
        hip.position.set(x, 0.89, 0);
        group.add(hip);
        const thigh = new THREE.Mesh(
          taperedBoxGeometry(0.13, 0.145, 0.165, 0.18, 0.43),
          flatMaterial(palette.trousers),
        );
        thigh.position.y = -0.215;
        markTarget(thigh, 0.9);
        hip.add(thigh);
        const knee = new THREE.Group();
        knee.position.y = -0.42;
        hip.add(knee);
        const shin = new THREE.Mesh(
          taperedBoxGeometry(0.102, 0.122, 0.135, 0.15, 0.4),
          flatMaterial(id === 1 ? 0x252c2b : 0x2b2927),
        );
        shin.position.y = -0.2;
        markTarget(shin, 0.8);
        knee.add(shin);
        const ankle = new THREE.Group();
        ankle.position.y = -0.39;
        knee.add(ankle);
        const shoe = new THREE.Mesh(
          taperedBoxGeometry(0.15, 0.28, 0.17, 0.22, 0.12),
          flatMaterial(id === 0 ? 0x1c1a17 : 0x171918),
        );
        shoe.position.set(0, -0.055, -0.045);
        markTarget(shoe, 0.7);
        ankle.add(shoe);
        const sole = new THREE.Mesh(
          new THREE.BoxGeometry(0.175, 0.035, 0.295),
          flatMaterial(0x0d0e0d),
        );
        sole.position.set(0, -0.12, -0.045);
        ankle.add(sole);
        return { hip, knee, ankle };
      }

      function createEnemyArm(x: number, raised: boolean) {
        const shoulder = new THREE.Group();
        shoulder.position.set(x, 0.2, 0);
        shoulder.rotation.x = raised ? 0.18 : -0.06;
        torso.add(shoulder);
        const shoulderCap = new THREE.Mesh(
          new THREE.SphereGeometry(id === 2 ? 0.115 : 0.102, 6, 4),
          flatMaterial(x < 0 ? palette.jacketLight : palette.jacketDark),
        );
        shoulderCap.scale.set(0.8, 1, 0.82);
        shoulder.add(shoulderCap);
        const upper = new THREE.Mesh(
          taperedBoxGeometry(0.11, 0.12, 0.145, 0.15, 0.3),
          flatMaterial(x < 0 ? palette.jacketLight : palette.jacket),
        );
        upper.position.y = -0.15;
        markTarget(upper, 0.85);
        shoulder.add(upper);
        const elbow = new THREE.Group();
        elbow.position.y = -0.295;
        shoulder.add(elbow);
        const lower = new THREE.Mesh(
          taperedBoxGeometry(0.085, 0.095, 0.115, 0.125, 0.265),
          flatMaterial(x < 0 ? palette.jacket : palette.jacketDark),
        );
        lower.position.y = -0.132;
        markTarget(lower, 0.8);
        elbow.add(lower);
        const cuff = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.045, 0.11),
          flatMaterial(palette.jacketDark),
        );
        cuff.position.y = -0.25;
        elbow.add(cuff);
        const wrist = new THREE.Group();
        wrist.position.y = -0.275;
        elbow.add(wrist);
        const hand = new THREE.Mesh(
          taperedBoxGeometry(0.078, 0.073, 0.102, 0.087, 0.125),
          flatMaterial(palette.skin),
        );
        hand.position.y = -0.068;
        markTarget(hand, 0.7);
        wrist.add(hand);
        const thumb = new THREE.Mesh(
          new THREE.BoxGeometry(0.033, 0.07, 0.042),
          flatMaterial(palette.skin),
        );
        thumb.position.set(x < 0 ? 0.05 : -0.05, -0.043, -0.02);
        thumb.rotation.z = x < 0 ? -0.24 : 0.24;
        wrist.add(thumb);
        return { shoulder, elbow, wrist };
      }

      const leftLegRig = createEnemyLeg(-0.115);
      const rightLegRig = createEnemyLeg(0.115);
      const leftArmRig = createEnemyArm(-0.285, id % 2 === 0);
      const rightArmRig = createEnemyArm(0.285, id % 2 !== 0);

      return {
        id,
        group,
        targets,
        state: 'patrol',
        health: 3,
        alive: true,
        speed: 1.35 + id * 0.08,
        cooldown: 0,
        attackTimer: 0,
        stagger: 0,
        spawn: spawn.clone(),
        phase: id * 2.3,
        lastKnown: spawn.clone(),
        searchTarget: spawn.clone(),
        searchTimer: 0,
        memoryTimer: 0,
        patrolIndex: 1,
        searchIndex: 0,
        nextSightCheck: id * 0.07,
        rawSight: false,
        canSeePlayer: false,
        heardShotSerial: 0,
        route: route.map((point) => point.clone()),
        path: [],
        pathIndex: 0,
        pathGoal: spawn.clone(),
        pathRefresh: 0,
        dwellTimer: 0,
        sightConfirm: 0,
        lostSightGrace: 0,
        rig: {
          torso,
          head: headPivot,
          leftArm: leftArmRig.shoulder,
          rightArm: rightArmRig.shoulder,
          leftElbow: leftArmRig.elbow,
          rightElbow: rightArmRig.elbow,
          leftLeg: leftLegRig.hip,
          rightLeg: rightLegRig.hip,
          leftKnee: leftLegRig.knee,
          rightKnee: rightLegRig.knee,
        },
      };
    }

    const enemies = enemySpawns.map((spawn, index) =>
      createEnemy(index, spawn, patrolRoutes[index]),
    );
    const input = {
      keys: new Set<string>(),
      aim: false,
      yaw: 0,
      pitch: -0.08,
      shoulderSide: 1 as 1 | -1,
      nextFireAt: 0,
      muzzleUntil: 0,
      reloadFinish: 0,
    };

    let playerHealth = 100;
    let currentWeapon: WeaponId = 'handgun';
    const loadedAmmo: Record<WeaponId, number> = {
      handgun: WEAPONS.handgun.magazine,
      shotgun: WEAPONS.shotgun.magazine,
    };
    const reserveAmmo: Record<WeaponId, number> = {
      handgun: WEAPONS.handgun.reserve,
      shotgun: WEAPONS.shotgun.reserve,
    };
    let defeated = 0;
    let raf = 0;
    let lastFrame = performance.now();
    let clearTimer = 0;
    let shotNoiseUntil = 0;
    let shotNoiseRadius = WEAPONS.handgun.noiseRadius;
    let shotSerial = 0;
    let footstepNoiseUntil = 0;
    const footstepNoisePosition = player.position.clone();
    let cameraKick = 0;
    let cameraBoom = 4.6;
    let shoulderBlend = 1;
    let lastThreatLabel = 'Patrolling';
    const shotNoisePosition = player.position.clone();
    const tracers: Array<{ line: THREE.Line; expires: number }> = [];

    const muzzleLight = new THREE.PointLight(0xffb450, 0, 5, 2);
    scene.add(muzzleLight);
    const flashlightTarget = new THREE.Object3D();
    scene.add(flashlightTarget);
    const flashlight = new THREE.SpotLight(0xd8cfad, 2.2, 20, 0.42, 0.55, 1.15);
    flashlight.target = flashlightTarget;
    scene.add(flashlight);

    const raycaster = new THREE.Raycaster();
    const tempV1 = new THREE.Vector3();
    const tempV2 = new THREE.Vector3();
    const tempV3 = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);

    function isBlocked(x: number, z: number, radius: number) {
      if (
        x < -ROOM_HALF_X + 0.65 + radius ||
        x > ROOM_HALF_X - 0.65 - radius ||
        z < -ROOM_HALF_Z + 0.65 + radius ||
        z > ROOM_HALF_Z - 0.65 - radius
      ) {
        return true;
      }
      return obstacles.some((obstacle) => {
        const nearX = clamp(
          x,
          obstacle.x - obstacle.halfX,
          obstacle.x + obstacle.halfX,
        );
        const nearZ = clamp(
          z,
          obstacle.z - obstacle.halfZ,
          obstacle.z + obstacle.halfZ,
        );
        const dx = x - nearX;
        const dz = z - nearZ;
        return dx * dx + dz * dz < radius * radius;
      });
    }

    const NAV_CELL = 0.75;
    const NAV_MIN_X = -ROOM_HALF_X + 1.1;
    const NAV_MIN_Z = -ROOM_HALF_Z + 1.1;
    const NAV_COLS = Math.floor((ROOM_HALF_X * 2 - 2.2) / NAV_CELL) + 1;
    const NAV_ROWS = Math.floor((ROOM_HALF_Z * 2 - 2.2) / NAV_CELL) + 1;

    function cellKey(x: number, z: number) {
      return z * NAV_COLS + x;
    }

    function keyToCell(key: number) {
      return { x: key % NAV_COLS, z: Math.floor(key / NAV_COLS) };
    }

    function positionToCell(position: THREE.Vector3) {
      return {
        x: clamp(Math.round((position.x - NAV_MIN_X) / NAV_CELL), 0, NAV_COLS - 1),
        z: clamp(Math.round((position.z - NAV_MIN_Z) / NAV_CELL), 0, NAV_ROWS - 1),
      };
    }

    function cellToPosition(x: number, z: number) {
      return new THREE.Vector3(NAV_MIN_X + x * NAV_CELL, 0, NAV_MIN_Z + z * NAV_CELL);
    }

    function cellIsOpen(x: number, z: number) {
      return (
        x >= 0 &&
        z >= 0 &&
        x < NAV_COLS &&
        z < NAV_ROWS &&
        !isBlocked(NAV_MIN_X + x * NAV_CELL, NAV_MIN_Z + z * NAV_CELL, 0.47)
      );
    }

    function nearestOpenCell(position: THREE.Vector3) {
      const origin = positionToCell(position);
      if (cellIsOpen(origin.x, origin.z)) return origin;
      for (let radius = 1; radius <= 8; radius += 1) {
        for (let dz = -radius; dz <= radius; dz += 1) {
          for (let dx = -radius; dx <= radius; dx += 1) {
            if (Math.abs(dx) !== radius && Math.abs(dz) !== radius) continue;
            const x = origin.x + dx;
            const z = origin.z + dz;
            if (cellIsOpen(x, z)) return { x, z };
          }
        }
      }
      return origin;
    }

    function nearestNavigablePosition(position: THREE.Vector3) {
      const cell = nearestOpenCell(position);
      return cellToPosition(cell.x, cell.z);
    }

    function findNavigationPath(from: THREE.Vector3, rawTarget: THREE.Vector3) {
      const start = nearestOpenCell(from);
      const goal = nearestOpenCell(rawTarget);
      const startKey = cellKey(start.x, start.z);
      const goalKey = cellKey(goal.x, goal.z);
      if (startKey === goalKey) return [cellToPosition(goal.x, goal.z)];

      const open = [startKey];
      const openSet = new Set(open);
      const closed = new Set<number>();
      const cameFrom = new Map<number, number>();
      const gScore = new Map<number, number>([[startKey, 0]]);
      const fScore = new Map<number, number>([
        [startKey, Math.hypot(goal.x - start.x, goal.z - start.z)],
      ]);
      const neighbors = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ];

      let visits = 0;
      while (open.length > 0 && visits < 1600) {
        visits += 1;
        let bestIndex = 0;
        for (let index = 1; index < open.length; index += 1) {
          if ((fScore.get(open[index]) ?? Infinity) < (fScore.get(open[bestIndex]) ?? Infinity)) {
            bestIndex = index;
          }
        }
        const currentKey = open.splice(bestIndex, 1)[0];
        openSet.delete(currentKey);
        if (currentKey === goalKey) {
          const path: THREE.Vector3[] = [];
          let cursor = currentKey;
          while (cursor !== startKey) {
            const cell = keyToCell(cursor);
            path.push(cellToPosition(cell.x, cell.z));
            const previous = cameFrom.get(cursor);
            if (previous === undefined) break;
            cursor = previous;
          }
          return path.reverse();
        }

        closed.add(currentKey);
        const current = keyToCell(currentKey);
        for (const [dx, dz] of neighbors) {
          const x = current.x + dx;
          const z = current.z + dz;
          if (!cellIsOpen(x, z)) continue;
          if (
            dx !== 0 &&
            dz !== 0 &&
            (!cellIsOpen(current.x + dx, current.z) ||
              !cellIsOpen(current.x, current.z + dz))
          ) {
            continue;
          }
          const neighborKey = cellKey(x, z);
          if (closed.has(neighborKey)) continue;
          const tentative =
            (gScore.get(currentKey) ?? Infinity) + (dx !== 0 && dz !== 0 ? 1.414 : 1);
          if (tentative >= (gScore.get(neighborKey) ?? Infinity)) continue;
          cameFrom.set(neighborKey, currentKey);
          gScore.set(neighborKey, tentative);
          fScore.set(neighborKey, tentative + Math.hypot(goal.x - x, goal.z - z));
          if (!openSet.has(neighborKey)) {
            open.push(neighborKey);
            openSet.add(neighborKey);
          }
        }
      }
      return [];
    }

    function moveWithCollisions(
      object: THREE.Object3D,
      dx: number,
      dz: number,
      radius: number,
    ) {
      if (!isBlocked(object.position.x + dx, object.position.z, radius)) {
        object.position.x += dx;
      }
      if (!isBlocked(object.position.x, object.position.z + dz, radius)) {
        object.position.z += dz;
      }
    }

    function makeTracer(start: THREE.Vector3, end: THREE.Vector3, hit: boolean) {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      const material = new THREE.LineBasicMaterial({
        color: hit ? 0xf1c875 : 0x9c7b43,
        transparent: true,
        opacity: 0.86,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      tracers.push({ line, expires: performance.now() + 68 });
    }

    function applyDamage(
      enemy: Enemy,
      amount: number,
      shotDirection: THREE.Vector3,
    ) {
      if (!enemy.alive) return;
      enemy.health -= amount;
      enemy.stagger = 0.28;
      enemy.state = 'stagger';
      const concealmentError = new THREE.Vector3(
        Math.sin(shotSerial * 2.17 + enemy.id) * 1.4,
        0,
        Math.cos(shotSerial * 1.73 + enemy.id) * 1.4,
      );
      enemy.lastKnown.copy(player.position).add(concealmentError);
      enemy.memoryTimer = 7;
      enemy.pathRefresh = 0;
      enemy.group.position.addScaledVector(shotDirection, 0.13);
      setHitMarker((value) => value + 1);
      sound('hit');
      if (enemy.health <= 0) {
        enemy.alive = false;
        enemy.state = 'dead';
        enemy.group.rotation.z = enemy.id % 2 ? -1.38 : 1.38;
        enemy.group.position.y = 0.08;
        defeated += 1;
        setKills(defeated);
        if (defeated === ENEMY_COUNT) {
          window.clearTimeout(clearTimer);
          clearTimer = window.setTimeout(() => {
            statusRef.current = 'cleared';
            setStatus('cleared');
            if (document.pointerLockElement === canvas) document.exitPointerLock();
          }, 550);
        }
      }
    }

    function syncWeaponHud() {
      setActiveWeapon(currentWeapon);
      setAmmo(loadedAmmo[currentWeapon]);
      setReserve(reserveAmmo[currentWeapon]);
      handgun.visible = currentWeapon === 'handgun';
      shotgun.visible = currentWeapon === 'shotgun';
    }

    function selectWeapon(nextWeapon: WeaponId) {
      if (nextWeapon === currentWeapon) return;
      currentWeapon = nextWeapon;
      input.reloadFinish = 0;
      setReloading(false);
      syncWeaponHud();
      sound('reload');
    }

    function shoot() {
      if (statusRef.current !== 'playing' || input.reloadFinish > 0) return;
      const weapon = WEAPONS[currentWeapon];
      const now = performance.now();
      if (loadedAmmo[currentWeapon] <= 0) {
        startReload();
        return;
      }
      if (now < input.nextFireAt) return;
      input.nextFireAt = now + weapon.fireInterval;
      player.rotation.y = input.yaw;
      loadedAmmo[currentWeapon] -= 1;
      setAmmo(loadedAmmo[currentWeapon]);
      input.muzzleUntil = now + (currentWeapon === 'shotgun' ? 86 : 52);
      shotNoisePosition.copy(player.position);
      shotNoiseUntil = now / 1000 + 4.5;
      shotNoiseRadius = weapon.noiseRadius;
      shotSerial += 1;
      cameraKick = Math.min(0.14, cameraKick + weapon.recoil);
      sound(currentWeapon === 'shotgun' ? 'shotgun' : 'shot');

      const aimDirection = camera.getWorldDirection(tempV1).normalize();
      raycaster.set(camera.position, aimDirection);
      raycaster.far = weapon.range;
      const liveTargets = enemies
        .filter((enemy) => enemy.alive)
        .flatMap((enemy) => enemy.targets);
      const cameraHits = raycaster.intersectObjects(
        [...blockers, ...liveTargets],
        false,
      );
      const aimPoint =
        cameraHits[0]?.point.clone() ??
        camera.position.clone().addScaledVector(aimDirection, weapon.range);

      const facing = tempV2.set(
        -Math.sin(input.yaw),
        0,
        -Math.cos(input.yaw),
      );
      const right = tempV3.crossVectors(facing, up).normalize();
      const muzzle = player.position
        .clone()
        .add(new THREE.Vector3(0, 1.28, 0))
        .addScaledVector(right, 0.43)
        .addScaledVector(facing, currentWeapon === 'shotgun' ? 0.55 : 0.1);
      muzzleLight.position.copy(muzzle);
      const muzzleDirection = aimPoint.clone().sub(muzzle).normalize();
      const pelletRight = new THREE.Vector3().crossVectors(muzzleDirection, up).normalize();
      const pelletUp = new THREE.Vector3().crossVectors(pelletRight, muzzleDirection).normalize();
      const hitDamage = new Map<number, { amount: number; direction: THREE.Vector3 }>();

      for (let pellet = 0; pellet < weapon.pellets; pellet += 1) {
        const angle = pellet === 0 ? 0 : (pellet / (weapon.pellets - 1)) * Math.PI * 2;
        const scatter =
          pellet === 0
            ? 0
            : weapon.spread *
              (0.62 + layoutNoise(shotSerial * 53 + pellet * 17) * 0.38);
        const pelletDirection = muzzleDirection
          .clone()
          .addScaledVector(pelletRight, Math.cos(angle) * scatter)
          .addScaledVector(pelletUp, Math.sin(angle) * scatter)
          .normalize();
        raycaster.set(muzzle, pelletDirection);
        raycaster.far = weapon.range;
        const firstHit = raycaster.intersectObjects(
          [...blockers, ...liveTargets],
          false,
        )[0];
        const end =
          firstHit?.point.clone() ??
          muzzle.clone().addScaledVector(pelletDirection, weapon.range);
        const enemyId = firstHit?.object.userData.enemyId as number | undefined;
        const didHit = enemyId !== undefined;
        if (weapon.pellets === 1 || pellet < 3) makeTracer(muzzle, end, didHit);
        if (didHit) {
          const multiplier = Number(firstHit.object.userData.multiplier ?? 1);
          const previous = hitDamage.get(enemyId);
          hitDamage.set(enemyId, {
            amount: (previous?.amount ?? 0) + weapon.pelletDamage * multiplier,
            direction: pelletDirection.clone(),
          });
        }
      }

      for (const [enemyId, hit] of hitDamage) {
        applyDamage(enemies[enemyId], hit.amount, hit.direction);
      }
    }

    function startReload() {
      const weapon = WEAPONS[currentWeapon];
      if (
        statusRef.current !== 'playing' ||
        input.reloadFinish > 0 ||
        loadedAmmo[currentWeapon] === weapon.magazine ||
        reserveAmmo[currentWeapon] <= 0
      ) {
        return;
      }
      input.reloadFinish = performance.now() + weapon.reloadTime;
      setReloading(true);
      sound('reload');
    }

    function finishReload() {
      const weapon = WEAPONS[currentWeapon];
      const needed = weapon.magazine - loadedAmmo[currentWeapon];
      const moved = Math.min(needed, reserveAmmo[currentWeapon]);
      loadedAmmo[currentWeapon] += moved;
      reserveAmmo[currentWeapon] -= moved;
      input.reloadFinish = 0;
      setAmmo(loadedAmmo[currentWeapon]);
      setReserve(reserveAmmo[currentWeapon]);
      setReloading(false);
      sound('reload');
    }

    function resetWorld(regenerate = true) {
      window.clearTimeout(clearTimer);
      clearTimer = 0;
      if (regenerate) {
        arenaGeneration += 1;
        applyArenaLayout(arenaGeneration);
      }
      playerHealth = 100;
      currentWeapon = 'handgun';
      loadedAmmo.handgun = WEAPONS.handgun.magazine;
      loadedAmmo.shotgun = WEAPONS.shotgun.magazine;
      reserveAmmo.handgun = WEAPONS.handgun.reserve;
      reserveAmmo.shotgun = WEAPONS.shotgun.reserve;
      defeated = 0;
      input.keys.clear();
      input.aim = false;
      input.yaw = 0;
      input.pitch = -0.08;
      input.shoulderSide = 1;
      input.nextFireAt = 0;
      input.reloadFinish = 0;
      cameraKick = 0;
      cameraBoom = 4.6;
      shoulderBlend = 1;
      player.position.copy(nearestNavigablePosition(playerSpawn));
      player.rotation.set(0, 0, 0);
      enemies.forEach((enemy) => {
        enemy.health = 3;
        enemy.alive = true;
        enemy.cooldown = 0;
        enemy.attackTimer = 0;
        enemy.stagger = 0;
        enemy.state = 'patrol';
        enemy.lastKnown.copy(enemy.spawn);
        enemy.searchTarget.copy(enemy.spawn);
        enemy.searchTimer = 0;
        enemy.memoryTimer = 0;
        enemy.patrolIndex = 1;
        enemy.searchIndex = 0;
        enemy.nextSightCheck = enemy.id * 0.07;
        enemy.rawSight = false;
        enemy.canSeePlayer = false;
        enemy.heardShotSerial = shotSerial;
        enemy.path.length = 0;
        enemy.pathIndex = 0;
        enemy.pathGoal.copy(enemy.spawn);
        enemy.pathRefresh = 0;
        enemy.dwellTimer = 0;
        enemy.sightConfirm = 0;
        enemy.lostSightGrace = 0;
        enemy.group.position.copy(nearestNavigablePosition(enemy.spawn));
        enemy.group.rotation.set(0, 0, 0);
        enemy.group.visible = true;
      });
      setHealth(100);
      syncWeaponHud();
      setKills(0);
      setReloading(false);
      setIsAiming(false);
      lastThreatLabel = 'Patrolling';
      setThreatState(lastThreatLabel);
    }

    actionsRef.current = {
      reset: resetWorld,
      shoot,
      reload: startReload,
      cycleWeapon() {
        selectWeapon(currentWeapon === 'handgun' ? 'shotgun' : 'handgun');
      },
      swapShoulder() {
        input.shoulderSide = input.shoulderSide === 1 ? -1 : 1;
      },
      setAim(active) {
        input.aim = active;
        setIsAiming(active);
      },
      setKey(code, active) {
        if (active) input.keys.add(code);
        else input.keys.delete(code);
      },
      touchLook(dx, dy) {
        input.yaw -= dx * 0.006;
        input.pitch = clamp(input.pitch - dy * 0.005, -0.62, 0.48);
      },
    };

    function onKeyDown(event: KeyboardEvent) {
      input.keys.add(event.code);
      if (event.code === 'KeyR') startReload();
      if (!event.repeat && event.code === 'Digit1') selectWeapon('handgun');
      if (!event.repeat && event.code === 'Digit2') selectWeapon('shotgun');
      if (!event.repeat && event.code === 'KeyQ') {
        input.shoulderSide = input.shoulderSide === 1 ? -1 : 1;
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      input.keys.delete(event.code);
    }

    function onMouseMove(event: MouseEvent) {
      if (statusRef.current !== 'playing') return;
      const hasPointerLock = document.pointerLockElement === canvas;
      const fallbackLook = !hasPointerLock && (event.buttons & 2) === 2;
      if (!hasPointerLock && !fallbackLook) return;
      input.yaw -= event.movementX * 0.00235;
      input.pitch = clamp(input.pitch - event.movementY * 0.0021, -0.62, 0.48);
    }

    function onMouseDown(event: MouseEvent) {
      if (statusRef.current !== 'playing') return;
      if (
        document.pointerLockElement !== canvas &&
        window.matchMedia('(pointer: fine)').matches
      ) {
        void requestPointerLockSafely(canvas);
      }
      if (event.button === 2) {
        input.aim = true;
        setIsAiming(true);
      }
      if (event.button === 0) shoot();
    }

    function onMouseUp(event: MouseEvent) {
      if (event.button === 2) {
        input.aim = false;
        setIsAiming(false);
      }
    }

    function onPointerLockChange() {
      if (
        document.pointerLockElement !== canvas &&
        statusRef.current === 'playing' &&
        window.matchMedia('(pointer: fine)').matches
      ) {
        input.keys.clear();
        input.aim = false;
        setIsAiming(false);
        statusRef.current = 'paused';
        setStatus('paused');
      }
    }

    function onBlur() {
      input.keys.clear();
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('blur', onBlur);
    document.addEventListener('pointerlockchange', onPointerLockChange);

    function resize() {
      const width = Math.max(320, canvas.clientWidth);
      const height = Math.max(240, canvas.clientHeight);
      const aspect = width / height;
      const internalHeight = width < 720 ? 320 : 405;
      const internalWidth = Math.round(internalHeight * aspect);
      renderer.setSize(internalWidth, internalHeight, false);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    function updatePlayer(dt: number) {
      const forward = tempV1.set(
        -Math.sin(input.yaw),
        0,
        -Math.cos(input.yaw),
      );
      const right = tempV2.crossVectors(forward, up).normalize();
      const move = tempV3.set(0, 0, 0);
      if (input.keys.has('KeyW') || input.keys.has('ArrowUp')) move.add(forward);
      if (input.keys.has('KeyS') || input.keys.has('ArrowDown')) move.sub(forward);
      if (input.keys.has('KeyD') || input.keys.has('ArrowRight')) move.add(right);
      if (input.keys.has('KeyA') || input.keys.has('ArrowLeft')) move.sub(right);
      const isMoving = move.lengthSq() > 0;
      let stride = 0;
      if (isMoving) {
        move.normalize();
        const sprinting = input.keys.has('ShiftLeft') && !input.aim;
        const speed = sprinting ? 4.4 : input.aim ? 2.3 : 3.25;
        moveWithCollisions(player, move.x * speed * dt, move.z * speed * dt, 0.42);
        if (sprinting) {
          footstepNoisePosition.copy(player.position).setY(0);
          footstepNoiseUntil = performance.now() / 1000 + 0.2;
        }
        const desiredFacing = input.aim
          ? input.yaw
          : Math.atan2(-move.x, -move.z);
        player.rotation.y = lerpAngle(
          player.rotation.y,
          desiredFacing,
          1 - Math.exp(-12 * dt),
        );
        const steppedSeconds = Math.floor((performance.now() / 1000) * 15) / 15;
        const walk = steppedSeconds * 8.4 * (sprinting ? 1.38 : 1);
        stride = Math.sin(walk);
        const gaitBlend = 1 - Math.exp(-18 * dt);
        leftLeg.rotation.x = THREE.MathUtils.lerp(
          leftLeg.rotation.x,
          stride * 0.38,
          gaitBlend,
        );
        rightLeg.rotation.x = THREE.MathUtils.lerp(
          rightLeg.rotation.x,
          -stride * 0.38,
          gaitBlend,
        );
        leftLegRig.knee.rotation.x = THREE.MathUtils.lerp(
          leftLegRig.knee.rotation.x,
          Math.max(0, -stride) * 0.62,
          gaitBlend,
        );
        rightLegRig.knee.rotation.x = THREE.MathUtils.lerp(
          rightLegRig.knee.rotation.x,
          Math.max(0, stride) * 0.62,
          gaitBlend,
        );
        leftLegRig.ankle.rotation.x = -leftLegRig.knee.rotation.x * 0.42;
        rightLegRig.ankle.rotation.x = -rightLegRig.knee.rotation.x * 0.42;
        player.position.y = Math.abs(Math.sin(walk * 2)) * 0.025;
        playerTorso.rotation.y = -stride * 0.045;
        playerPelvis.rotation.z = stride * 0.026;
      } else {
        player.position.y *= 0.8;
        leftLeg.rotation.x *= 0.75;
        rightLeg.rotation.x *= 0.75;
        leftLegRig.knee.rotation.x *= 0.72;
        rightLegRig.knee.rotation.x *= 0.72;
        leftLegRig.ankle.rotation.x *= 0.7;
        rightLegRig.ankle.rotation.x *= 0.7;
        playerTorso.rotation.y *= 0.8;
        playerPelvis.rotation.z *= 0.78;
        if (input.aim) {
          player.rotation.y = lerpAngle(
            player.rotation.y,
            input.yaw,
            1 - Math.exp(-12 * dt),
          );
        }
      }

      rightArm.rotation.x = THREE.MathUtils.lerp(
        rightArm.rotation.x,
        input.aim ? 1.22 : isMoving ? stride * 0.28 : 0.03,
        1 - Math.exp(-14 * dt),
      );
      leftArm.rotation.x = THREE.MathUtils.lerp(
        leftArm.rotation.x,
        input.aim ? 1.02 : isMoving ? -stride * 0.25 : -0.02,
        1 - Math.exp(-14 * dt),
      );
      rightArm.rotation.z = THREE.MathUtils.lerp(
        rightArm.rotation.z,
        input.aim ? -0.18 : 0,
        1 - Math.exp(-12 * dt),
      );
      leftArm.rotation.z = THREE.MathUtils.lerp(
        leftArm.rotation.z,
        input.aim ? 0.24 : 0,
        1 - Math.exp(-12 * dt),
      );
      rightArmRig.elbow.rotation.x = THREE.MathUtils.lerp(
        rightArmRig.elbow.rotation.x,
        input.aim ? 0.14 : isMoving ? Math.max(0, stride) * 0.18 : 0.06,
        1 - Math.exp(-14 * dt),
      );
      leftArmRig.elbow.rotation.x = THREE.MathUtils.lerp(
        leftArmRig.elbow.rotation.x,
        input.aim ? 0.28 : isMoving ? Math.max(0, -stride) * 0.2 : 0.08,
        1 - Math.exp(-14 * dt),
      );
      rightArmRig.elbow.rotation.z = THREE.MathUtils.lerp(
        rightArmRig.elbow.rotation.z,
        input.aim ? -0.12 : 0,
        1 - Math.exp(-12 * dt),
      );
      leftArmRig.elbow.rotation.z = THREE.MathUtils.lerp(
        leftArmRig.elbow.rotation.z,
        input.aim ? 0.34 : 0,
        1 - Math.exp(-12 * dt),
      );
      rightArmRig.wrist.rotation.x = THREE.MathUtils.lerp(
        rightArmRig.wrist.rotation.x,
        input.aim ? -0.08 : 0,
        1 - Math.exp(-12 * dt),
      );
      leftArmRig.wrist.rotation.x = THREE.MathUtils.lerp(
        leftArmRig.wrist.rotation.x,
        input.aim ? -0.22 : 0,
        1 - Math.exp(-12 * dt),
      );
      playerHeadPivot.rotation.x = THREE.MathUtils.lerp(
        playerHeadPivot.rotation.x,
        -input.pitch * 0.28,
        1 - Math.exp(-9 * dt),
      );
      playerHeadPivot.rotation.y = THREE.MathUtils.lerp(
        playerHeadPivot.rotation.y,
        input.aim ? input.shoulderSide * 0.06 : stride * 0.025,
        1 - Math.exp(-8 * dt),
      );
      handgun.position.z = THREE.MathUtils.lerp(
        handgun.position.z,
        input.aim ? -0.22 : -0.18,
        1 - Math.exp(-14 * dt),
      );
      shotgun.position.z = THREE.MathUtils.lerp(
        shotgun.position.z,
        input.aim ? -0.5 : -0.38,
        1 - Math.exp(-14 * dt),
      );
    }

    function hasLineOfSight(enemy: Enemy) {
      const eye = enemy.group.position
        .clone()
        .add(new THREE.Vector3(0, 1.58, 0));
      const chest = player.position
        .clone()
        .add(new THREE.Vector3(0, 1.24, 0));
      const toPlayer = chest.sub(eye);
      const distance = toPlayer.length();
      if (distance > 15.5) return false;

      const horizontal = toPlayer.clone().setY(0).normalize();
      const lookYaw =
        enemy.group.rotation.y +
        enemy.rig.torso.rotation.y +
        enemy.rig.head.rotation.y;
      const facing = new THREE.Vector3(
        -Math.sin(lookYaw),
        0,
        -Math.cos(lookYaw),
      );
      const halfAngle = enemy.state === 'patrol' ? 0.73 : 1.16;
      if (distance > 1.45 && facing.dot(horizontal) < Math.cos(halfAngle)) {
        return false;
      }

      raycaster.set(eye, toPlayer.normalize());
      raycaster.far = distance;
      const obstruction = raycaster.intersectObjects(blockers, false)[0];
      return !obstruction || obstruction.distance >= distance - 0.12;
    }

    function chooseSearchTarget(enemy: Enemy) {
      const radii = [0, 2.1, 3.4, 4.6, 2.8];
      const radius = radii[enemy.searchIndex % radii.length];
      const angle = enemy.phase + enemy.searchIndex * 2.399;
      const candidate = enemy.lastKnown.clone().add(
        new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
      );
      candidate.x = clamp(candidate.x, -ROOM_HALF_X + 1.1, ROOM_HALF_X - 1.1);
      candidate.z = clamp(candidate.z, -ROOM_HALF_Z + 1.1, ROOM_HALF_Z - 1.1);
      enemy.searchTarget.copy(nearestNavigablePosition(candidate));
      enemy.searchIndex += 1;
      enemy.pathRefresh = 0;
    }

    function moveEnemyToward(
      enemy: Enemy,
      rawTarget: THREE.Vector3,
      speed: number,
      dt: number,
    ) {
      const target = nearestNavigablePosition(rawTarget);
      const distance = target.distanceTo(enemy.group.position);
      if (distance < 0.48) return true;

      enemy.pathRefresh -= dt;
      if (
        enemy.pathRefresh <= 0 ||
        enemy.pathGoal.distanceToSquared(target) > 0.5
      ) {
        enemy.path = findNavigationPath(enemy.group.position, target);
        enemy.pathIndex = 0;
        enemy.pathGoal.copy(target);
        enemy.pathRefresh = enemy.state === 'chase' ? 0.42 : 0.9;
      }

      if (enemy.path.length === 0) return false;

      while (
        enemy.pathIndex < enemy.path.length - 1 &&
        enemy.group.position.distanceTo(enemy.path[enemy.pathIndex]) < 0.34
      ) {
        enemy.pathIndex += 1;
      }
      const steeringTarget = enemy.path[enemy.pathIndex] ?? target;
      const direction = steeringTarget.clone().sub(enemy.group.position).setY(0);
      if (direction.lengthSq() < 0.0001) return distance < 0.6;
      direction.normalize();

      let dx = direction.x * speed * dt;
      let dz = direction.z * speed * dt;
      if (
        isBlocked(
          enemy.group.position.x + dx,
          enemy.group.position.z + dz,
          0.43,
        )
      ) {
        const preferredSide = (enemy.id + enemy.searchIndex) % 2 ? 1 : -1;
        dx = -direction.z * speed * dt * preferredSide;
        dz = direction.x * speed * dt * preferredSide;
        if (
          isBlocked(
            enemy.group.position.x + dx,
            enemy.group.position.z + dz,
            0.43,
          )
        ) {
          dx *= -1;
          dz *= -1;
        }
      }

      for (const other of enemies) {
        if (other === enemy || !other.alive) continue;
        const separation = enemy.group.position.distanceTo(other.group.position);
        if (separation < 0.82) {
          const away = enemy.group.position
            .clone()
            .sub(other.group.position)
            .setY(0)
            .normalize();
          dx += away.x * dt * 0.7;
          dz += away.z * dt * 0.7;
        }
      }

      const startX = enemy.group.position.x;
      const startZ = enemy.group.position.z;
      moveWithCollisions(enemy.group, dx, dz, 0.43);
      if (Math.hypot(enemy.group.position.x - startX, enemy.group.position.z - startZ) < 0.002) {
        enemy.pathRefresh = 0;
      }
      enemy.group.rotation.y = lerpAngle(
        enemy.group.rotation.y,
        Math.atan2(-direction.x, -direction.z),
        1 - Math.exp(-7.5 * dt),
      );
      return target.distanceTo(enemy.group.position) < 0.52;
    }

    function damagePlayer(amount: number) {
      playerHealth = Math.max(0, playerHealth - amount);
      setHealth(playerHealth);
      setDamageFlash((value) => value + 1);
      sound('hurt');
      if (playerHealth <= 0) {
        statusRef.current = 'dead';
        setStatus('dead');
        input.keys.clear();
        if (document.pointerLockElement === canvas) document.exitPointerLock();
      }
    }

    function updateEnemyPose(
      enemy: Enemy,
      elapsed: number,
      moving: boolean,
      dt: number,
    ) {
      const steppedTime = Math.floor((elapsed + enemy.phase) * 15) / 15;
      const stride = moving ? Math.sin(steppedTime * (enemy.state === 'chase' ? 8 : 5)) : 0;
      const limbBlend = 1 - Math.exp(-15 * dt);
      const idleArmBlend = 1 - Math.exp(-10.5 * dt);
      const attackBlend = 1 - Math.exp(-25 * dt);
      const torsoBlend = 1 - Math.exp(-12 * dt);
      const headBlend = 1 - Math.exp(-7.7 * dt);
      enemy.rig.leftLeg.rotation.x = THREE.MathUtils.lerp(
        enemy.rig.leftLeg.rotation.x,
        stride * 0.36,
        limbBlend,
      );
      enemy.rig.rightLeg.rotation.x = THREE.MathUtils.lerp(
        enemy.rig.rightLeg.rotation.x,
        -stride * 0.36,
        limbBlend,
      );
      const attacking = enemy.state === 'attack';
      enemy.rig.leftArm.rotation.x = THREE.MathUtils.lerp(
        enemy.rig.leftArm.rotation.x,
        attacking ? 1.18 : -stride * 0.22,
        attacking ? attackBlend : idleArmBlend,
      );
      enemy.rig.rightArm.rotation.x = THREE.MathUtils.lerp(
        enemy.rig.rightArm.rotation.x,
        attacking ? 1.38 : stride * 0.24,
        attacking ? attackBlend : idleArmBlend,
      );
      enemy.rig.torso.rotation.y = THREE.MathUtils.lerp(
        enemy.rig.torso.rotation.y,
        attacking ? 0.2 : -stride * 0.045,
        torsoBlend,
      );
      const searchSweep = enemy.state === 'search' ? Math.sin(steppedTime * 1.7) * 0.62 : 0;
      enemy.rig.head.rotation.y = THREE.MathUtils.lerp(
        enemy.rig.head.rotation.y,
        searchSweep,
        headBlend,
      );
      enemy.group.position.y = moving
        ? Math.abs(Math.sin(steppedTime * 5)) * 0.018
        : 0;
    }

    function updateEnemies(dt: number, elapsed: number) {
      enemies.forEach((enemy) => {
        if (!enemy.alive) return;
        enemy.cooldown = Math.max(0, enemy.cooldown - dt);
        enemy.stagger = Math.max(0, enemy.stagger - dt);

        if (elapsed >= enemy.nextSightCheck) {
          const hadConfirmedSight = enemy.canSeePlayer;
          enemy.rawSight = hasLineOfSight(enemy);
          enemy.nextSightCheck = elapsed + 0.12 + enemy.id * 0.012;
          if (enemy.rawSight) {
            enemy.sightConfirm = Math.min(0.28, enemy.sightConfirm + 0.13);
            enemy.lostSightGrace = 0.38;
            if (enemy.sightConfirm >= 0.18) enemy.canSeePlayer = true;
          } else {
            enemy.sightConfirm = 0;
            enemy.lostSightGrace = Math.max(0, enemy.lostSightGrace - 0.13);
            if (enemy.lostSightGrace <= 0) enemy.canSeePlayer = false;
          }

          if (enemy.rawSight && enemy.canSeePlayer) {
            enemy.lastKnown.copy(player.position).setY(0);
            enemy.memoryTimer = 6.5;
            if (enemy.state !== 'attack' && enemy.state !== 'stagger') {
              enemy.state = 'chase';
            }
          }

          if (!hadConfirmedSight && enemy.canSeePlayer) {
            enemies.forEach((ally) => {
              if (
                ally === enemy ||
                !ally.alive ||
                ally.state !== 'patrol' ||
                ally.group.position.distanceTo(enemy.group.position) > 9
              ) {
                return;
              }
              const warningError = new THREE.Vector3(
                Math.sin(ally.id * 4.1 + elapsed) * 1.1,
                0,
                Math.cos(ally.id * 3.7 + elapsed) * 1.1,
              );
              ally.lastKnown.copy(player.position).add(warningError).setY(0);
              ally.searchTimer = 5.5;
              ally.searchIndex = 0;
              ally.dwellTimer = 0;
              ally.state = 'search';
              ally.pathRefresh = 0;
              chooseSearchTarget(ally);
            });
          }
        }

        if (
          enemy.heardShotSerial !== shotSerial &&
          elapsed < shotNoiseUntil &&
          enemy.group.position.distanceTo(shotNoisePosition) < shotNoiseRadius
        ) {
          enemy.heardShotSerial = shotSerial;
          const hearingDistance = enemy.group.position.distanceTo(shotNoisePosition);
          const uncertainty = 0.45 + (hearingDistance / shotNoiseRadius) * 2.2;
          const noiseAngle = shotSerial * 1.91 + enemy.id * 2.37;
          enemy.lastKnown
            .copy(shotNoisePosition)
            .add(
              new THREE.Vector3(
                Math.cos(noiseAngle) * uncertainty,
                0,
                Math.sin(noiseAngle) * uncertainty,
              ),
            )
            .copy(nearestNavigablePosition(enemy.lastKnown));
          enemy.memoryTimer = 7;
          enemy.searchTimer = 7;
          enemy.searchIndex = 0;
          enemy.dwellTimer = 0;
          enemy.pathRefresh = 0;
          chooseSearchTarget(enemy);
          if (!enemy.canSeePlayer && enemy.state !== 'stagger') {
            enemy.state = 'search';
          }
        }

        if (
          elapsed < footstepNoiseUntil &&
          enemy.state === 'patrol' &&
          !enemy.canSeePlayer &&
          enemy.group.position.distanceTo(footstepNoisePosition) < 6.2
        ) {
          const footstepAngle = elapsed * 1.7 + enemy.id * 2.1;
          enemy.lastKnown
            .copy(footstepNoisePosition)
            .add(new THREE.Vector3(Math.cos(footstepAngle), 0, Math.sin(footstepAngle)));
          enemy.lastKnown.copy(nearestNavigablePosition(enemy.lastKnown));
          enemy.searchTimer = 4.5;
          enemy.searchIndex = 0;
          enemy.dwellTimer = 0;
          enemy.state = 'search';
          enemy.pathRefresh = 0;
          chooseSearchTarget(enemy);
        }

        if (enemy.stagger > 0) {
          enemy.state = 'stagger';
          enemy.rig.torso.rotation.z =
            (enemy.id % 2 ? -1 : 1) * enemy.stagger * 0.55;
          updateEnemyPose(enemy, elapsed, false, dt);
          return;
        }
        enemy.rig.torso.rotation.z *= 0.78;
        if (enemy.state === 'stagger') {
          enemy.state = enemy.memoryTimer > 0 ? 'chase' : 'search';
          enemy.searchTimer = Math.max(enemy.searchTimer, 5);
        }

        const toPlayer = player.position.clone().sub(enemy.group.position).setY(0);
        const distance = toPlayer.length();
        let moving = false;

        if (enemy.rawSight && distance <= 1.55) {
          if (enemy.state !== 'attack') enemy.attackTimer = 0.42;
          enemy.state = 'attack';
        } else if (enemy.state === 'attack') {
          enemy.state = 'chase';
          enemy.attackTimer = 0;
        }

        if (enemy.state === 'attack') {
          enemy.group.rotation.y = lerpAngle(
            enemy.group.rotation.y,
            Math.atan2(-toPlayer.x, -toPlayer.z),
            1 - Math.exp(-10 * dt),
          );
          if (enemy.cooldown <= 0 && enemy.attackTimer <= 0) {
            enemy.attackTimer = 0.42;
          }
          enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);
          if (
            enemy.cooldown <= 0 &&
            enemy.attackTimer <= 0 &&
            enemy.rawSight &&
            distance <= 1.7
          ) {
            enemy.cooldown = 1.25 + enemy.id * 0.08;
            damagePlayer(18);
          }
        } else if (enemy.state === 'chase') {
          if (enemy.rawSight) {
            enemy.memoryTimer = 6.5;
            enemy.lastKnown.copy(player.position).setY(0);
          } else {
            enemy.memoryTimer = Math.max(0, enemy.memoryTimer - dt);
          }
          const arrived = moveEnemyToward(
            enemy,
            enemy.lastKnown,
            enemy.speed * 1.32,
            dt,
          );
          moving = !arrived;
          if (!enemy.canSeePlayer && (arrived || enemy.memoryTimer <= 0)) {
            enemy.state = 'search';
            enemy.searchTimer = 8;
            enemy.searchIndex = 0;
            enemy.dwellTimer = 0;
            chooseSearchTarget(enemy);
          }
        } else if (enemy.state === 'search') {
          enemy.searchTimer = Math.max(0, enemy.searchTimer - dt);
          if (enemy.dwellTimer > 0) {
            enemy.dwellTimer = Math.max(0, enemy.dwellTimer - dt);
            enemy.group.rotation.y += (enemy.id % 2 ? -1 : 1) * dt * 0.42;
          } else {
            const arrived = moveEnemyToward(
              enemy,
              enemy.searchTarget,
              enemy.speed * 0.78,
              dt,
            );
            moving = !arrived;
            if (arrived && enemy.searchTimer > 0) {
              enemy.dwellTimer = 0.72 + layoutNoise(enemy.searchIndex * 13 + enemy.id) * 0.65;
              chooseSearchTarget(enemy);
            }
          }
          if (enemy.searchTimer <= 0) {
            enemy.state = 'patrol';
            enemy.dwellTimer = 0;
            enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.route.length;
          }
        } else {
          enemy.state = 'patrol';
          if (enemy.dwellTimer > 0) {
            enemy.dwellTimer = Math.max(0, enemy.dwellTimer - dt);
            enemy.group.rotation.y += (enemy.id % 2 ? 1 : -1) * dt * 0.24;
          } else {
            const patrolPoint = enemy.route[enemy.patrolIndex];
            const arrived = moveEnemyToward(enemy, patrolPoint, enemy.speed * 0.62, dt);
            moving = !arrived;
            if (arrived) {
              enemy.dwellTimer = 0.8 + layoutNoise(enemy.patrolIndex * 19 + enemy.id) * 0.55;
              enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.route.length;
            }
          }
        }

        updateEnemyPose(enemy, elapsed, moving, dt);
      });

      const nextThreatLabel = enemies.some(
        (enemy) => enemy.alive && (enemy.state === 'chase' || enemy.state === 'attack'),
      )
        ? 'Hunted'
        : enemies.some(
              (enemy) =>
                enemy.alive && (enemy.state === 'search' || enemy.state === 'stagger'),
            )
          ? 'Searching'
          : 'Patrolling';
      if (nextThreatLabel !== lastThreatLabel) {
        lastThreatLabel = nextThreatLabel;
        setThreatState(nextThreatLabel);
      }
    }

    function updateCamera(dt: number) {
      cameraKick *= Math.exp(-10.5 * dt);
      const effectivePitch = clamp(input.pitch + cameraKick, -0.62, 0.52);
      const forward = tempV1.set(
        -Math.sin(input.yaw) * Math.cos(effectivePitch),
        Math.sin(effectivePitch),
        -Math.cos(input.yaw) * Math.cos(effectivePitch),
      );
      const flatForward = tempV2.set(
        -Math.sin(input.yaw),
        0,
        -Math.cos(input.yaw),
      );
      const right = tempV3.crossVectors(flatForward, up).normalize();
      const lookOrigin = player.position
        .clone()
        .add(new THREE.Vector3(0, 1.52, 0));
      const sprinting = input.keys.has('ShiftLeft') && !input.aim;
      const distance = input.aim ? 3.05 : sprinting ? 4.85 : 4.45;
      shoulderBlend = THREE.MathUtils.lerp(
        shoulderBlend,
        input.shoulderSide,
        1 - Math.exp(-9 * dt),
      );
      const shoulder = (input.aim ? 0.76 : 0.54) * shoulderBlend;
      const verticalLift = input.aim ? 0.12 : 0.24;
      const fullOffset = forward
        .clone()
        .multiplyScalar(-distance)
        .addScaledVector(right, shoulder)
        .addScaledVector(up, verticalLift);
      const castDirection = fullOffset.clone();
      const castDistance = castDirection.length();
      castDirection.normalize();

      let allowedDistance = castDistance;
      const castOrigins = [
        lookOrigin,
        lookOrigin.clone().addScaledVector(right, 0.24),
        lookOrigin.clone().addScaledVector(right, -0.24),
        lookOrigin.clone().addScaledVector(up, 0.2),
        lookOrigin.clone().addScaledVector(up, -0.12),
      ];
      for (const origin of castOrigins) {
        raycaster.set(origin, castDirection);
        raycaster.far = castDistance;
        const obstruction = raycaster.intersectObjects(blockers, false)[0];
        if (obstruction) allowedDistance = Math.min(allowedDistance, obstruction.distance - 0.28);
      }
      allowedDistance = Math.max(0.62, allowedDistance);
      if (allowedDistance < cameraBoom) cameraBoom = allowedDistance;
      else {
        cameraBoom = THREE.MathUtils.lerp(
          cameraBoom,
          Math.min(castDistance, allowedDistance),
          1 - Math.exp(-7 * dt),
        );
      }
      const actualBoom = Math.min(cameraBoom, castDistance, allowedDistance);
      const desired = lookOrigin.clone().addScaledVector(castDirection, actualBoom);

      if (camera.position.distanceTo(lookOrigin) > actualBoom + 0.3) {
        camera.position.copy(desired);
      } else {
        const candidate = camera.position
          .clone()
          .lerp(desired, 1 - Math.exp(-15 * dt));
        const travel = candidate.clone().sub(camera.position);
        const travelDistance = travel.length();
        let crossesCover = false;
        if (travelDistance > 0.01) {
          raycaster.set(camera.position, travel.normalize());
          raycaster.far = travelDistance;
          crossesCover = raycaster.intersectObjects(blockers, false).length > 0;
        }
        camera.position.copy(crossesCover ? desired : candidate);
      }
      camera.fov = THREE.MathUtils.lerp(
        camera.fov,
        input.aim ? 50 : sprinting ? 62 : 58,
        1 - Math.exp(-10 * dt),
      );
      camera.updateProjectionMatrix();
      camera.lookAt(camera.position.clone().add(forward));
      player.visible = actualBoom > 1.02;

      flashlight.position.copy(lookOrigin).addScaledVector(right, 0.16 * shoulderBlend);
      flashlightTarget.position.copy(lookOrigin).addScaledVector(forward, 14);
      const flicker = Math.sin(performance.now() * 0.037) > 0.975 ? 0.55 : 1;
      flashlight.intensity = 2.15 * flicker;
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.034, (now - lastFrame) / 1000);
      lastFrame = now;
      const gameStatus = statusRef.current;

      if (gameStatus === 'menu') {
        player.visible = true;
        flashlight.intensity = 0.35;
        const angle = now * 0.00008;
        camera.position.set(
          12.8 + Math.sin(angle) * 2.1,
          5.7,
          14.0 + Math.cos(angle) * 1.8,
        );
        camera.lookAt(0, 1.15, -2.6);
        camera.fov = 52;
        camera.updateProjectionMatrix();
      } else if (gameStatus === 'playing') {
        updatePlayer(dt);
        updateEnemies(dt, now / 1000);
        updateCamera(dt);
        if (input.reloadFinish > 0 && now >= input.reloadFinish) finishReload();
      }

      alarmLight.intensity =
        1.35 + Math.max(0, Math.sin(now * 0.006)) * 1.8;
      warning.scale.x =
        0.92 + Math.max(0, Math.sin(now * 0.01)) * 0.08;
      muzzleLight.intensity = now < input.muzzleUntil ? 4.8 : 0;

      for (let index = tracers.length - 1; index >= 0; index -= 1) {
        if (now > tracers[index].expires) {
          const tracer = tracers[index].line;
          scene.remove(tracer);
          tracer.geometry.dispose();
          (tracer.material as THREE.Material).dispose();
          tracers.splice(index, 1);
        }
      }

      renderer.render(scene, camera);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(clearTimer);
      resizeObserver.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      actionsRef.current = null;
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      grimeTexture.dispose();
      renderer.dispose();
    };
  }, []);

  function startGame() {
    actionsRef.current?.reset();
    statusRef.current = 'playing';
    setStatus('playing');
    setShowHelp(false);
    if (canvasRef.current && window.matchMedia('(pointer: fine)').matches) {
      void requestPointerLockSafely(canvasRef.current);
    }
  }

  function resumeGame() {
    statusRef.current = 'playing';
    setStatus('playing');
    if (canvasRef.current && window.matchMedia('(pointer: fine)').matches) {
      void requestPointerLockSafely(canvasRef.current);
    }
  }

  function backToMenu() {
    if (document.pointerLockElement) document.exitPointerLock();
    actionsRef.current?.reset(false);
    statusRef.current = 'menu';
    setStatus('menu');
  }

  useEffect(() => {
    const context = (
      document as Document & { modelContext?: WebModelContext }
    ).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: 'start_combat_room',
          title: 'Start combat room',
          description:
            'Reset Dead Static and begin the playable relay-room encounter.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: {
            readOnlyHint: false,
            untrustedContentHint: false,
          },
          execute(input) {
            if (
              typeof input !== 'object' ||
              input === null ||
              Array.isArray(input) ||
              Object.keys(input).length > 0
            ) {
              throw new Error('start_combat_room accepts an empty object only.');
            }
            startGame();
            return {
              state: 'playing',
              objective: 'clear_relay_room',
              enemies: ENEMY_COUNT,
              weapons: ['handgun', 'shotgun'],
              proceduralLayouts: 3,
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {
      // WebMCP is optional in browsers that do not expose a model context.
    });
    return () => lifecycle.abort();
  }, []);

  function holdKey(code: string, active: boolean) {
    actionsRef.current?.setKey(code, active);
  }

  function handleTouchMove(event: ReactTouchEvent<HTMLCanvasElement>) {
    if (status !== 'playing' || event.touches.length !== 1) return;
    const point = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    if (touchPointRef.current) {
      actionsRef.current?.touchLook(
        point.x - touchPointRef.current.x,
        point.y - touchPointRef.current.y,
      );
    }
    touchPointRef.current = point;
  }

  return (
    <main
      className="game-shell"
      aria-label="Dead Static survival shooter prototype"
    >
      <canvas
        ref={canvasRef}
        className="game-canvas"
        aria-label="3D combat room"
        tabIndex={0}
        onContextMenu={(event) => event.preventDefault()}
        onTouchStart={(event) => {
          touchPointRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          touchPointRef.current = null;
        }}
      />
      <div className="screen-grade" />
      <div className="scanlines" />
      <div className="vignette" />

      <div className="ui-layer">
        {status === 'menu' && (
          <section className="menu-screen" aria-labelledby="game-title">
            <div className="menu-rail">
              <div>
                <div className="signal-row">
                  <span className="signal-dot" aria-hidden="true" />
                  <span className="eyebrow">Relay 08 / Unstable carrier</span>
                </div>
                <h1 className="game-title" id="game-title">
                  Dead <span>Static</span>
                </h1>
                <p className="menu-brief">
                  The emergency channel is still broadcasting. Each entry shifts the
                  maintenance maze. Break sight, search your angles, and reach the north door.
                </p>

                <div className="menu-actions">
                  <button className="menu-action primary" onClick={startGame}>
                    Begin transmission <span className="action-index">01</span>
                  </button>
                  <button
                    className="menu-action"
                    aria-expanded={showHelp}
                    onClick={() => setShowHelp((visible) => !visible)}
                  >
                    Field controls <span className="action-index">02</span>
                  </button>
                </div>

                {showHelp && (
                  <div className="help-card">
                    <dl className="help-grid">
                      <dt>Move</dt>
                      <dd>WASD</dd>
                      <dt>Look</dt>
                      <dd>Mouse</dd>
                      <dt>Aim</dt>
                      <dd>Hold right mouse</dd>
                      <dt>Fire</dt>
                      <dd>Left mouse</dd>
                      <dt>Reload</dt>
                      <dd>R</dd>
                      <dt>Weapons</dt>
                      <dd>1 handgun · 2 shotgun</dd>
                      <dt>Shoulder</dt>
                      <dd>Q swaps camera side</dd>
                      <dt>Sprint</dt>
                      <dd>Left Shift</dd>
                      <dt>Hide</dt>
                      <dd>Break sight behind tall walls</dd>
                    </dl>
                  </div>
                )}
              </div>

              <footer className="menu-footer">
                <span>Prototype build 0.3</span>
                <span>Headphones advised</span>
              </footer>
            </div>

            <aside className="menu-side-note" aria-label="Mission details">
              <span className="brief-label">Threat scan</span>
              <br />
              03 signatures
              <br />
              Handgun + shotgun
              <br />
              Search protocol active
              <br />
              No extraction signal
            </aside>
          </section>
        )}

        {status !== 'menu' && (
          <section className="hud" aria-label="Combat status">
            <div className="hud-objective">
              <div className="hud-label">
                {layoutName} / {threatState}
              </div>
              <div className="objective-copy">
                Clear the relay room — {kills}/{ENEMY_COUNT}
              </div>
            </div>

            <div className="hud-vitals">
              <div className="hud-label">Condition {health}%</div>
              <div className="health-track">
                <div
                  className={`health-fill ${health <= 35 ? 'low' : ''}`}
                  style={{ width: `${health}%` }}
                />
              </div>
            </div>

            <div
              className="hud-ammo"
              aria-label={`${WEAPONS[activeWeapon].label}: ${ammo} rounds loaded, ${reserve} in reserve`}
            >
              <span className="ammo-state">
                {reloading ? 'Reloading · ' : ''}
                {WEAPONS[activeWeapon].caliber} · {WEAPONS[activeWeapon].label}
              </span>
              <span className="ammo-loaded">
                {String(ammo).padStart(2, '0')}
              </span>
              <span className="ammo-reserve">
                / {String(reserve).padStart(2, '0')}
              </span>
            </div>

            <div
              className={`reticle ${isAiming ? 'visible' : ''}`}
              aria-hidden="true"
            />
            {hitMarker > 0 && (
              <div key={hitMarker} className="hit-marker" aria-hidden="true" />
            )}
            {damageFlash > 0 && (
              <div
                key={damageFlash}
                className="damage-flash"
                aria-hidden="true"
              />
            )}

            {status === 'playing' && (
              <div className="interaction-hint">
                Q swaps shoulder · 1/2 weapons · Esc pauses
              </div>
            )}

            {status === 'playing' && (
              <div className="touch-controls" aria-label="Touch controls">
                <div className="move-pad">
                  {[
                    ['KeyW', 'up', '▲'],
                    ['KeyA', 'left', '◀'],
                    ['KeyS', 'down', '▼'],
                    ['KeyD', 'right', '▶'],
                  ].map(([code, className, label]) => (
                    <button
                      key={code}
                      className={`touch-key ${className}`}
                      aria-label={`${className} movement`}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        holdKey(code, true);
                      }}
                      onPointerUp={() => holdKey(code, false)}
                      onPointerCancel={() => holdKey(code, false)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="touch-actions">
                  <button
                    className="touch-action"
                    onPointerDown={() => actionsRef.current?.setAim(true)}
                    onPointerUp={() => actionsRef.current?.setAim(false)}
                    onPointerCancel={() => actionsRef.current?.setAim(false)}
                  >
                    Aim
                  </button>
                  <button
                    className="touch-action fire"
                    onPointerDown={() => actionsRef.current?.shoot()}
                  >
                    Fire
                  </button>
                  <button
                    className="touch-action"
                    onPointerDown={() => actionsRef.current?.reload()}
                  >
                    R
                  </button>
                  <button
                    className="touch-action compact"
                    onPointerDown={() => actionsRef.current?.cycleWeapon()}
                  >
                    1/2
                  </button>
                  <button
                    className="touch-action compact"
                    onPointerDown={() => actionsRef.current?.swapShoulder()}
                  >
                    Q
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {status === 'paused' && (
          <section className="game-overlay" aria-labelledby="paused-title">
            <div className="result-card">
              <span className="status-kicker">Transmission suspended</span>
              <h2 className="result-title" id="paused-title">
                Paused
              </h2>
              <p className="result-copy">The relay is holding your position.</p>
              <div className="result-actions">
                <button className="menu-action primary" onClick={resumeGame}>
                  Resume
                </button>
                <button
                  className="menu-action"
                  onClick={backToMenu}
                >
                  Return to menu
                </button>
              </div>
            </div>
          </section>
        )}

        {status === 'cleared' && (
          <section className="game-overlay" aria-labelledby="cleared-title">
            <div className="result-card">
              <span className="status-kicker">Channel secured</span>
              <h2 className="result-title" id="cleared-title">
                Room clear
              </h2>
              <p className="result-copy">
                Three signals dropped. The north lock is responding again.
              </p>
              <div className="result-actions">
                <button className="menu-action primary" onClick={startGame}>
                  Run it again
                </button>
                <button
                  className="menu-action"
                  onClick={backToMenu}
                >
                  Return to menu
                </button>
              </div>
            </div>
          </section>
        )}

        {status === 'dead' && (
          <section className="game-overlay" aria-labelledby="dead-title">
            <div className="result-card" style={{ borderTopColor: '#b94331' }}>
              <span className="status-kicker">Carrier lost</span>
              <h2 className="result-title" id="dead-title">
                Signal dead
              </h2>
              <p className="result-copy">
                The relay room took another voice. Try a wider route around the
                consoles.
              </p>
              <div className="result-actions">
                <button className="menu-action primary" onClick={startGame}>
                  Retry room
                </button>
                <button
                  className="menu-action"
                  onClick={backToMenu}
                >
                  Return to menu
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<GamePrototype />);
