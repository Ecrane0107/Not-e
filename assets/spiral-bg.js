/*
 * spiral-bg.js — a shared ambient background: a slowly spinning ring of
 * glowing faceted bars, a few particles spiralling through the center
 * trailing light, and small glowing cubes drifting through the dark
 * behind everything. Picks a random color theme every time it loads
 * unless one is passed in explicitly.
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
 *   3. Flat fills and thin strokes only — the faceted bars below are a
 *      handful of filled polygons per bar, not per-pixel shading, and
 *      the glow look comes from a CSS `filter: blur()` on the <canvas>
 *      element itself instead of any per-shape blur.
 * On top of that: devicePixelRatio is capped at 1, the loop throttles to
 * a configurable fps instead of drawing on every display refresh, and it
 * stops entirely via visibilitychange while the tab is hidden.
 *
 * Usage:
 *   <canvas id="bg"></canvas>
 *   <script src="assets/spiral-bg.js"></script>
 *   <script>initSpiralBackground(document.getElementById('bg'), { intensity: 0.5 }); </script>
 *
 * Pass a numeric `hue` (0-360) in options to pin the color theme instead
 * of getting a random one.
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
      particleCount: null,   // 1-11, or null to pick a random count each load
      cubeCount: 10,
      reverse: false,
      fps: 30,
      hue: null, // 0-360, or null to pick a random theme each load
    },
    options || {},
  );

  const hue = typeof opts.hue === "number" ? opts.hue : Math.floor(Math.random() * 360);
  const hue2 = (hue + 18) % 360; // a near neighbor for the alternating bar tint

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

  // --- particles: small glow "flying lights" grouped into 1-3 flights.
  // Everyone in a flight shares the exact same path formula (same radius
  // band, same speed, same radius rhythm) and only differs by a fixed
  // angular offset, so they visibly trail one another nose-to-tail along
  // one track. Each flight is also confined to its own non-overlapping
  // radius band, so no flight can ever cross another's, and a constant
  // angular gap within a flight means its own members can't collide
  // either — no per-frame collision checking needed, just geometry.
  const particleHues = [hue, (hue + 12) % 360, (hue - 24 + 360) % 360, (hue + 40) % 360];
  const particleCount = typeof opts.particleCount === "number"
    ? opts.particleCount
    : 1 + Math.floor(Math.random() * 11); // 1-11
  const flightCount = Math.max(1, Math.min(3, particleCount, 1 + Math.floor(Math.random() * 3)));
  const particleSquish = 0.85 + Math.random() * 0.15; // shared by every flight so bands can't visually cross

  const RING_MIN = 0.12, RING_MAX = 0.8;
  const BAND_GAP = 0.05;
  const bandSpan = (RING_MAX - RING_MIN - BAND_GAP * (flightCount - 1)) / flightCount;

  const flights = [];
  const per = Math.floor(particleCount / flightCount);
  let remainder = particleCount - per * flightCount;
  for (let g = 0; g < flightCount; g += 1) {
    const bandMin = RING_MIN + g * (bandSpan + BAND_GAP);
    const memberCount = per + (g < remainder ? 1 : 0);
    // members sit at fixed multiples of angleGap around the same ring; cap
    // the gap so a flight with many members can never span a full circle
    // and wrap its last member back around into its first
    const maxSpan = Math.PI * 1.6;
    const angleGapWanted = 0.4 + Math.random() * 0.5;
    const angleGap = memberCount > 1 ? Math.min(angleGapWanted, maxSpan / (memberCount - 1)) : angleGapWanted;
    const flight = {
      bandMin,
      bandMax: bandMin + bandSpan,
      dir: Math.random() < 0.5 ? -1 : 1,
      speed: 0.35 + Math.random() * 0.5,
      radiusFreq: 0.25 + Math.random() * 0.45,
      radiusPhase: Math.random() * Math.PI * 2,
      baseAngle: Math.random() * Math.PI * 2,
      angleGap,
      hue: particleHues[g % particleHues.length],
      members: [],
    };
    for (let m = 0; m < memberCount; m += 1) flight.members.push({ trail: [] });
    flights.push(flight);
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

  // one rod, drawn as a few filled facets instead of a flat stroke so it
  // reads as a beveled prism (bright face, mid face, shadow face) rather
  // than a thin flat bar, plus a small hexagonal cap at the outer tip
  function drawRod(cx, cy, angle, r1, r2, thickness, alpha, rodHue) {
    const dx = Math.cos(angle), dy = Math.sin(angle);
    const px = -dy, py = dx;
    const x1 = cx + dx * r1, y1 = cy + dy * r1;
    const x2 = cx + dx * r2, y2 = cy + dy * r2;
    const bandW = thickness / 3;

    function quad(off, lightness) {
      const o0 = off - bandW / 2, o1 = off + bandW / 2;
      ctx.fillStyle = `hsla(${rodHue},65%,${lightness}%,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(x1 + px * o0, y1 + py * o0);
      ctx.lineTo(x2 + px * o0, y2 + py * o0);
      ctx.lineTo(x2 + px * o1, y2 + py * o1);
      ctx.lineTo(x1 + px * o1, y1 + py * o1);
      ctx.closePath();
      ctx.fill();
    }
    // shadow face, bright front face, mid side face — in that draw order
    // so the bright face reads as the one catching the light
    quad(-thickness / 2 + bandW / 2, 28);
    quad(0, 82);
    quad(thickness / 2 - bandW / 2, 52);

    // small faceted cap at the outer tip
    const capR = thickness * 0.55;
    ctx.fillStyle = `hsla(${rodHue},70%,86%,${alpha})`;
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const a = angle + (i / 6) * Math.PI * 2;
      const px2 = x2 + Math.cos(a) * capR, py2 = y2 + Math.sin(a) * capR;
      if (i === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawBars(t, cx, cy, radius) {
    const rotation = (opts.reverse ? -1 : 1) * t * opts.spin;
    const barLength = radius * 0.95;
    const barThickness = Math.max(3, radius * 0.12);
    for (let i = 0; i < opts.barCount; i += 1) {
      const angle = (i / opts.barCount) * Math.PI * 2 + rotation;
      const wobble = Math.sin(t * 0.6 + i * 0.7) * radius * 0.05;
      const r1 = radius + wobble;
      const r2 = r1 + barLength;
      const rodHue = i % 3 === 0 ? hue2 : hue;
      const alpha = Math.max(0, (0.55 + 0.25 * Math.sin(t * 0.8 + i)) * opts.intensity);
      drawRod(cx, cy, angle, r1, r2, barThickness, alpha, rodHue);
    }
  }

  function drawParticles(t, cx, cy, radius) {
    const dirSign = opts.reverse ? -1 : 1;
    flights.forEach((f) => {
      // every member in a flight reads off the exact same radius formula
      // at the same instant — that's the "shared flight path" — they just
      // sit at different fixed angles around it, like beads on one ring
      const rFrac = f.bandMin + (f.bandMax - f.bandMin) * (0.5 + 0.5 * Math.sin(f.radiusFreq * t + f.radiusPhase));
      const r = radius * rFrac;
      const angleBase = f.baseAngle + dirSign * f.dir * f.speed * t;

      f.members.forEach((p, m) => {
        const angle = angleBase - m * f.angleGap;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * particleSquish;
        p.trail.push({ x, y });
        if (p.trail.length > 16) p.trail.shift();

        // comet tail: each segment fades and thins toward the older end
        // instead of one uniform-alpha polyline
        const n = p.trail.length;
        for (let i = 1; i < n; i += 1) {
          const frac = i / n;
          ctx.strokeStyle = `hsla(${f.hue},85%,82%,${frac * frac * 0.75 * opts.intensity})`;
          ctx.lineWidth = 0.5 + frac * 2.4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
          ctx.stroke();
        }
        ctx.fillStyle = `hsla(${f.hue},90%,88%,${0.95 * opts.intensity})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
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
      ctx.fillStyle = `hsla(${hue},20%,92%,${0.75 * glow})`;
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
    hue, // the chosen theme hue (0-360) — read this to tint other page chrome to match
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    },
  };
}
