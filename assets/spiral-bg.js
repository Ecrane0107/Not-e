/*
 * spiral-bg.js — a shared ambient background: a slowly spinning ring of
 * glowing bars (PS2 startup screen style), a few particles spiralling
 * through the center trailing light, and small glowing cubes drifting
 * through the dark behind everything.
 *
 * Perf notes (this got slow twice, so worth keeping in mind before
 * touching it again):
 *   1. No ctx.shadowBlur, ever. It's a real per-call blur pass.
 *   2. No non-default ctx.globalCompositeOperation (e.g. "lighter").
 *      Canvas2D contexts using additive/exotic blend modes can fall out
 *      of the GPU-accelerated path entirely in some browsers and render
 *      the whole canvas in software from then on - which is exactly why
 *      a "simple" 2D effect was outrunning a full WebGL game on this
 *      site. Plain source-over only.
 *   3. One draw call per shape, not a hand-rolled multi-layer glow.
 *      The glow look comes from a CSS `filter: blur()` on the <canvas>
 *      element itself instead - that's a single GPU compositor pass over
 *      the whole layer, not N extra draw calls every frame.
 * On top of that: devicePixelRatio is capped at 1, the loop throttles to
 * a configurable fps instead of drawing on every display refresh, and it
 * stops entirely via visibilitychange while the tab is hidden.
 *
 * Usage:
 *   <canvas id="bg"></canvas>
 *   <script src="assets/spiral-bg.js"></script>
 *   <script>initSpiralBackground(document.getElementById('bg'), { intensity: 0.5 }); </script>
 *
 * Returns { stop() } to cancel the animation loop.
 */
function initSpiralBackground(canvas, options) {
  const opts = Object.assign(
    {
      barCount: 14,
      intensity: 1,      // 0..1, scales opacity/glow — turn down for busy pages
      centerX: 0.5,       // fraction of width
      centerY: 0.5,        // fraction of height
      radiusScale: 0.16,    // ring radius as a fraction of min(width,height)
      spin: 0.05,            // radians per second
      particleCount: 3,
      cubeCount: 10,
      reverse: false,
      fps: 30,
    },
    options || {},
  );

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = 1; // this is a soft blurry background — full retina density buys nothing
  let width = 0, height = 0;

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // --- particles: small glow points that spiral around the ring, trailing light ---
  const particles = [];
  const particleColors = [
    [234, 246, 255],
    [143, 214, 255],
    [255, 185, 201],
    [182, 255, 207],
  ];
  for (let i = 0; i < opts.particleCount; i += 1) {
    particles.push({
      angle: (i / opts.particleCount) * Math.PI * 2,
      speed: 0.55 + Math.random() * 0.5,
      radiusPhase: Math.random() * Math.PI * 2,
      color: particleColors[i % particleColors.length],
      trail: [],
    });
  }

  // --- cubes: small glowing squares drifting slowly through the dark ---
  const cubes = [];
  for (let i = 0; i < opts.cubeCount; i += 1) {
    cubes.push(makeCube(true));
  }
  function makeCube(initial) {
    const size = 5 + Math.random() * 13;
    return {
      x: Math.random(),
      y: initial ? Math.random() : 1.08,
      size,
      vx: (Math.random() - 0.5) * 0.006,
      vy: -0.008 - Math.random() * 0.014,
      spin: (Math.random() - 0.5) * 0.6,
      rot: Math.random() * Math.PI,
      twinkle: Math.random() * Math.PI * 2,
    };
  }

  let raf = 0;
  const start = performance.now();

  function drawBars(t, cx, cy, radius) {
    const rotation = (opts.reverse ? -1 : 1) * t * opts.spin;
    const barLength = radius * 0.95;
    const barThickness = Math.max(2, radius * 0.1);
    ctx.lineCap = "round";
    for (let i = 0; i < opts.barCount; i += 1) {
      const angle = (i / opts.barCount) * Math.PI * 2 + rotation;
      const wobble = Math.sin(t * 0.6 + i * 0.7) * radius * 0.05;
      const r1 = radius + wobble;
      const r2 = r1 + barLength;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const tint = i % 3 === 0 ? "170,215,255" : "236,244,255";
      const alpha = Math.max(0, (0.55 + 0.25 * Math.sin(t * 0.8 + i)) * opts.intensity);
      ctx.strokeStyle = `rgba(${tint},${alpha})`;
      ctx.lineWidth = barThickness;
      ctx.beginPath();
      ctx.moveTo(cx + cos * r1, cy + sin * r1);
      ctx.lineTo(cx + cos * r2, cy + sin * r2);
      ctx.stroke();
    }
  }

  function drawParticles(t, cx, cy, radius) {
    particles.forEach((p) => {
      p.angle += p.speed * 0.016 * (opts.reverse ? -1 : 1);
      const r = radius * (0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.5 + p.radiusPhase)));
      const x = cx + Math.cos(p.angle) * r;
      const y = cy + Math.sin(p.angle) * r * 0.94;
      p.trail.push({ x, y });
      if (p.trail.length > 8) p.trail.shift();

      const rgb = p.color.join(",");
      if (p.trail.length > 1) {
        ctx.strokeStyle = `rgba(${rgb},${0.4 * opts.intensity})`;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i += 1) ctx.lineTo(p.trail[i].x, p.trail[i].y);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(${rgb},${0.9 * opts.intensity})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawCubes(dt) {
    cubes.forEach((cube) => {
      cube.x += cube.vx * dt * 0.06;
      cube.y += cube.vy * dt * 0.06;
      cube.rot += cube.spin * dt * 0.001;
      cube.twinkle += dt * 0.002;
      if (cube.y < -0.08 || cube.x < -0.08 || cube.x > 1.08) {
        Object.assign(cube, makeCube(false));
      }
      const x = cube.x * width;
      const y = cube.y * height;
      const s = cube.size;
      const glow = (0.55 + 0.3 * Math.sin(cube.twinkle)) * opts.intensity;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(cube.rot);
      ctx.fillStyle = `rgba(225,235,255,${0.75 * glow})`;
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.restore();
    });
  }

  let lastFrame = performance.now();
  let lastDraw = 0;
  const frameBudget = 1000 / opts.fps;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - lastDraw < frameBudget) return;
    lastDraw = now;

    const t = (now - start) / 1000;
    const dt = Math.min(64, now - lastFrame);
    lastFrame = now;

    ctx.clearRect(0, 0, width, height);

    const cx = width * opts.centerX;
    const cy = height * opts.centerY;
    const radius = Math.min(width, height) * opts.radiusScale;

    drawCubes(dt);
    drawBars(t, cx, cy, radius);
    drawParticles(t, cx, cy, radius);
  }

  function drawStill() {
    ctx.clearRect(0, 0, width, height);
    const cx = width * opts.centerX;
    const cy = height * opts.centerY;
    const radius = Math.min(width, height) * opts.radiusScale;
    drawCubes(0);
    drawBars(0, cx, cy, radius);
    drawParticles(0, cx, cy, radius);
  }

  function handleVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (!reduceMotion) {
      lastFrame = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  document.addEventListener("visibilitychange", handleVisibility);

  if (reduceMotion) {
    drawStill();
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    },
  };
}
