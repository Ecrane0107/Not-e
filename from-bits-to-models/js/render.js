/* ============================================================
   4. CAMERA + RENDER
   ============================================================ */

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
const cam = { x: 0, y: 0, k: 1 };
let dpr = 1, viewW = 0, viewH = 0;
let dirty = true;

const state = {
  hover: null,
  selected: null,
  ancestors: new Set(),
  descendants: new Set(),
  route: null,
  routeEdges: null,
  hiddenTracks: new Set(),
  goals: new Set(),
  query: "",
  matches: null,
  reveal: 0
};

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const r = canvas.getBoundingClientRect();
  viewW = r.width; viewH = r.height;
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  dirty = true;
}

function fit(animateless){
  const m = 48;
  const k = Math.min((viewW - m * 2) / bounds.w, (viewH - m * 2) / bounds.h, 1.05);
  cam.k = Math.max(k, 0.25);
  cam.x = viewW / 2 - (bounds.minX + bounds.w / 2) * cam.k;
  cam.y = viewH / 2 - (bounds.minY + bounds.h / 2) * cam.k;
  dirty = true;
}

const toScreen = (x, y) => [x * cam.k + cam.x, y * cam.k + cam.y];
const toWorld  = (x, y) => [(x - cam.x) / cam.k, (y - cam.y) / cam.k];



// How strongly to draw a node given selection / search state
function nodeAlpha(n){
  if (state.matches) return state.matches.has(n.id) ? 1 : 0.12;
  if (state.selected) {
    if (n.id === state.selected) return 1;
    if (state.route && state.route.includes(n.id)) return 1;
    if (state.ancestors.has(n.id) || state.descendants.has(n.id)) return 0.95;
    return 0.1;
  }
  if (state.hover) {
    const h = byId.get(state.hover);
    if (n.id === state.hover || h.in.includes(n.id) || h.out.includes(n.id)) return 1;
    return 0.28;
  }
  return 0.92;
}

function edgeAlpha(a, b){
  if (state.routeEdges && state.routeEdges.has(a.id + ">" + b.id)) return 1;
  if (state.matches) return (state.matches.has(a.id) && state.matches.has(b.id)) ? 0.5 : 0.04;
  if (state.selected) {
    const inChain = (id) => id === state.selected || state.ancestors.has(id) || state.descendants.has(id);
    if (inChain(a.id) && inChain(b.id)) {
      const onlyDown = state.descendants.has(b.id) || b.id === state.selected;
      return onlyDown ? 0.75 : 0.6;
    }
    return 0.04;
  }
  if (state.hover) {
    return (a.id === state.hover || b.id === state.hover) ? 0.8 : 0.09;
  }
  return 0.22;
}

function roundRect(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw(){
  ctx.clearRect(0, 0, viewW, viewH);

  const rev = state.reveal;

  // edges first
  ctx.lineWidth = Math.max(1, 1.4 * cam.k);
  for (const [fromId, toId] of EDGES) {
    const a = byId.get(fromId), b = byId.get(toId);
    if (a.hidden || b.hidden) continue;
    if (Math.max(a.tier, b.tier) > rev * (MAX_TIER + 1)) continue;

    const alpha = edgeAlpha(a, b);
    if (alpha < 0.02) continue;

    const lr = orient === "lr";
    const [x1, y1] = lr ? toScreen(a.x + a.w / 2, a.y) : toScreen(a.x, a.y + a.h / 2);
    const [x2, y2] = lr ? toScreen(b.x - b.w / 2, b.y) : toScreen(b.x, b.y - b.h / 2);
    if (Math.max(x1, x2) < -60 || Math.min(x1, x2) > viewW + 60 ||
        Math.max(y1, y2) < -60 || Math.min(y1, y2) > viewH + 60) continue;

    const bend = lr ? Math.max(28, (x2 - x1) * 0.45) : Math.max(28, (y2 - y1) * 0.45);
    const c1x = lr ? x1 + bend : x1, c1y = lr ? y1 : y1 + bend;
    const c2x = lr ? x2 - bend : x2, c2y = lr ? y2 : y2 - bend;
    const track = TRACKS[b.track];
    const lit = alpha > 0.45;
    const onRoute = alpha >= 0.999;
    ctx.setLineDash(track.dash.map(d => d * cam.k));
    ctx.lineWidth = Math.max(1, (onRoute ? 2.6 : lit ? 1.9 : 1.3) * cam.k);
    if (onRoute) ctx.setLineDash([]);
    ctx.strokeStyle = lit ? "#FFFFFF" : track.color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x2, y2);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // nodes
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  for (const n of visibleNodes()) {
    const t = (rev * (MAX_TIER + 1)) - n.tier;
    if (t <= 0) continue;
    const pop = Math.min(1, t);

    const alpha = nodeAlpha(n) * pop;
    if (alpha < 0.02) continue;

    const w = n.w * cam.k, h = n.h * cam.k;
    const [cx, cy] = toScreen(n.x, n.y);
    if (cx + w < -40 || cx - w > viewW + 40 || cy + h < -40 || cy - h > viewH + 40) continue;

    const color = TRACKS[n.track].color;
    const isFocus = n.id === state.selected || n.id === state.hover;

    ctx.globalAlpha = alpha;
    roundRect(cx - w / 2, cy - h / 2, w, h, 8 * cam.k);

    let textMain, textSigil;
    if (isFocus) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.5, 3 * cam.k);
      ctx.stroke();
      textMain = "#08090A"; textSigil = "#575E63";
    } else {
      ctx.fillStyle = "#131719";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, 1.3 * cam.k);
      ctx.stroke();
      textMain = "#EDEFF0"; textSigil = color;
    }

    // entry points emit from a marked source point
    if (n.start) {
      const lr = orient === "lr";
      const px = lr ? cx - w / 2 - 11 * cam.k : cx;
      const py = lr ? cy : cy - h / 2 - 11 * cam.k;
      const r = Math.max(2, 3.2 * cam.k);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = alpha * 0.4;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = Math.max(0.7, 1 * cam.k);
      ctx.beginPath(); ctx.arc(px, py, r * 2.5, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = alpha;
    }

    if (cam.k > 0.42) {
      const left = cx - w / 2;
      const ty = cy + 0.5 * cam.k;

      ctx.font = `500 ${12 * cam.k}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = textSigil;
      ctx.fillText(String(n.order), left + 14 * cam.k, ty);

      const divX = left + (14 + n.numW + 9) * cam.k;
      ctx.globalAlpha = alpha * 0.4;
      ctx.strokeStyle = textSigil;
      ctx.lineWidth = Math.max(0.6, 1 * cam.k);
      ctx.beginPath();
      ctx.moveTo(divX, cy - h * 0.3);
      ctx.lineTo(divX, cy + h * 0.3);
      ctx.stroke();
      ctx.globalAlpha = alpha;

      ctx.font = `500 ${14 * cam.k}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = textMain;
      ctx.fillText(n.label, left + (14 + n.numW + 19) * cam.k, ty);
    }
  }
  ctx.globalAlpha = 1;
}

function frame(){
  if (state.reveal < 1) {
    state.reveal = Math.min(1, state.reveal + 0.012);
    dirty = true;
  }
  if (dirty) { draw(); dirty = false; }
  requestAnimationFrame(frame);
}

