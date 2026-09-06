/*
 * spiral-bg.js — a shared ambient background: a slowly spinning ring of
 * glowing bars (PS2 startup screen style), a few particles spiralling
 * through the center trailing light, and small glowing cubes drifting
 * through the dark behind everything.
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
      barCount: 16,
      intensity: 1,     // 0..1, scales opacity/glow — turn down for busy pages
      centerX: 0.5,     // fraction of width
      centerY: 0.5,      // fraction of height
      radiusScale: 0.16, // ring radius as a fraction of min(width,height)
      spin: 0.05,        // radians per second
      particleCount: 4,
      cubeCount: 14,
      reverse: false,
    },
    options || {},
  );

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0, height = 0, dpr = Math.min(2, window.devicePixelRatio || 1);

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
  const particleColors = ["#eaf6ff", "#8fd6ff", "#ffb9c9", "#b6ffcf"];
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
      hue: Math.random() < 0.7 ? "#dfeaff" : "#9fd0ff",
      twinkle: Math.random() * Math.PI * 2,
    };
  }

  let raf = 0;
  let start = performance.now();

  function drawBars(t, cx, cy, radius) {
    const rotation = (opts.reverse ? -1 : 1) * t * opts.spin;
    const barLength = radius * 0.95;
    const barThickness = Math.max(2, radius * 0.1);
    for (let i = 0; i < opts.barCount; i += 1) {
      const angle = (i / opts.barCount) * Math.PI * 2 + rotation;
      const wobble = Math.sin(t * 0.6 + i * 0.7) * radius * 0.05;
      const r1 = radius + wobble;
      const r2 = r1 + barLength;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = cx + cos * r1;
      const y1 = cy + sin * r1;
      const x2 = cx + cos * r2;
      const y2 = cy + sin * r2;
      const tint = i % 3 === 0 ? "170,215,255" : "236,244,255";
      const alpha = (0.55 + 0.25 * Math.sin(t * 0.8 + i)) * opts.intensity;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(${tint},${Math.max(0, alpha)})`;
      ctx.lineWidth = barThickness;
      ctx.lineCap = "round";
      ctx.shadowColor = `rgba(${tint},0.9)`;
      ctx.shadowBlur = 16 * opts.intensity;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawParticles(t, cx, cy, radius) {
    particles.forEach((p) => {
      p.angle += p.speed * 0.016 * (opts.reverse ? -1 : 1);
      const r = radius * (0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.5 + p.radiusPhase)));
      const x = cx + Math.cos(p.angle) * r;
      const y = cy + Math.sin(p.angle) * r * 0.94;
      p.trail.push({ x, y });
      if (p.trail.length > 26) p.trail.shift();

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < p.trail.length; i += 1) {
        const point = p.trail[i];
        const a = (i / p.trail.length) * 0.5 * opts.intensity;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = a;
        ctx.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 0.9 * opts.intensity;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12 * opts.intensity;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
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
      const glow = 0.4 + 0.3 * Math.sin(cube.twinkle);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(cube.rot);
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = cube.hue;
      ctx.shadowBlur = 10 * opts.intensity;
      const grad = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
      grad.addColorStop(0, `rgba(255,255,255,${0.85 * glow * opts.intensity})`);
      grad.addColorStop(1, `rgba(120,160,220,${0.25 * glow * opts.intensity})`);
      ctx.fillStyle = grad;
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.restore();
    });
  }

  let lastFrame = performance.now();
  function frame(now) {
    const t = (now - start) / 1000;
    const dt = now - lastFrame;
    lastFrame = now;
    ctx.clearRect(0, 0, width, height);

    const cx = width * opts.centerX;
    const cy = height * opts.centerY;
    const radius = Math.min(width, height) * opts.radiusScale;

    drawCubes(dt);
    drawBars(t, cx, cy, radius);
    drawParticles(t, cx, cy, radius);

    raf = requestAnimationFrame(frame);
  }

  if (reduceMotion) {
    // Draw a single still frame instead of a continuous loop.
    drawCubes(0);
    drawBars(0, width * opts.centerX, height * opts.centerY, Math.min(width, height) * opts.radiusScale);
    drawParticles(0, width * opts.centerX, height * opts.centerY, Math.min(width, height) * opts.radiusScale);
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    },
  };
}
