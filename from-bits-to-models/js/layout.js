/* ============================================================
   3. LAYOUT — columns by tier, then barycenter passes to pull
   each node level with its neighbours and cut edge crossings.
   ============================================================ */

const NODE_H = 34, CROSS_GAP = 12, FLOW_GAP = 96;
let columns = [];
let orient = "tb";              // "tb" = top to bottom, "lr" = left to right
let STUDY = [];                 // every node in reading order

const ORDER_FONT = '500 12px "Space Grotesk", sans-serif';
const LABEL_FONT = '500 14px "Space Grotesk", sans-serif';

// Each pill reads [step number | label]. The number gets a fixed-width slot
// so the numbers stay aligned down a column even at three digits.
function measureLabels(ctx){
  ctx.font = ORDER_FONT;
  const numW = Math.round(ctx.measureText(String(NODES.length)).width);
  ctx.font = LABEL_FONT;
  NODES.forEach(n => {
    n.numW = numW;
    n.labelW = Math.round(ctx.measureText(n.label).width);
    n.w = 14 + numW + 9 + 1 + 9 + n.labelW + 16;
    n.h = NODE_H;
  });
}

// "flow" runs along the dependency direction, "cross" is the spread within a tier.
// Swapping which screen axis each maps to is the whole of the orientation switch.
const flowSize  = n => orient === "lr" ? n.w : n.h;
const crossSize = n => orient === "lr" ? n.h : n.w;

function layout(ctx){
  measureLabels(ctx);
  computeTiers();

  columns = Array.from({ length: MAX_TIER + 1 }, () => []);
  visibleNodes().forEach(n => columns[n.tier].push(n));
  columns.forEach(col => col.sort((a, b) => a.track.localeCompare(b.track)));

  // place each tier along the flow axis, clear of the widest node in the last
  let flow = 60;
  columns.forEach(col => {
    const span = Math.max(...col.map(flowSize));
    col.forEach(n => { n.flow = flow + span / 2; });
    flow += span + FLOW_GAP;
  });

  // initial spread along the cross axis, centred on zero
  columns.forEach(col => {
    let c = 0;
    col.forEach(n => { n.cross = c + crossSize(n) / 2; c += crossSize(n) + CROSS_GAP; });
    col.forEach(n => { n.cross -= c / 2; });
  });

  // barycenter relaxation, alternating sweep direction
  for (let pass = 0; pass < 40; pass++) {
    const forward = pass % 2 === 0;
    const order = forward ? columns : [...columns].reverse();
    for (const col of order) {
      for (const n of col) {
        const nb = forward ? n.in : n.out;
        const cs = nb.map(id => byId.get(id).cross);
        n.target = cs.length ? cs.reduce((a, b) => a + b, 0) / cs.length : n.cross;
      }
      col.sort((a, b) => a.target - b.target);
      let cursor = -Infinity;
      col.forEach(n => {
        const half = crossSize(n) / 2;
        n.cross = Math.max(n.target, cursor + half);
        cursor = n.cross + half + CROSS_GAP;
      });
      const meanT = col.reduce((s, n) => s + n.target, 0) / col.length;
      const meanC = col.reduce((s, n) => s + n.cross, 0) / col.length;
      col.forEach(n => { n.cross += meanT - meanC; });
    }
  }

  visibleNodes().forEach(n => {
    if (orient === "lr") { n.x = n.flow; n.y = n.cross; }
    else                 { n.x = n.cross; n.y = n.flow; }
  });

  assignStudyOrder();
  bounds = computeBounds();
}

// Study order: read each tier through before moving to the next, following the
// same direction your eye already travels. Because a prerequisite always lands
// in an earlier tier, this is a valid topological order — follow 1, 2, 3 and
// nothing is ever missing when you arrive.
function assignStudyOrder(){
  STUDY = visibleNodes().sort((a, b) => a.tier - b.tier || a.cross - b.cross);
  STUDY.forEach((n, i) => { n.order = i + 1; });
}

let bounds = null;
function computeBounds(){
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  visibleNodes().forEach(n => {
    minX = Math.min(minX, n.x - n.w / 2); maxX = Math.max(maxX, n.x + n.w / 2);
    minY = Math.min(minY, n.y - n.h / 2); maxY = Math.max(maxY, n.y + n.h / 2);
  });
  return { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY };
}

