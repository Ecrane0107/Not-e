/* ============================================================
   3. LAYOUT — four ways to arrange the same graph.

   Every layout writes n.x / n.y plus n.cross, a single number that
   orders nodes within a tier. Study order falls out of (tier, cross),
   so each layout also decides what "reading order" means for itself.
   ============================================================ */

const NODE_H = 34, CROSS_GAP = 12, FLOW_GAP = 96;
const LANE_GAP = 54, BAND_GAP = 58;          // category lanes
const SEQ_GAP_X = 18, SEQ_GAP_Y = 11;        // study sequence

let columns = [];
let STUDY = [];                 // every node in reading order

// Which layout is drawn, and which screen axis its edges follow. `orient`
// stays the name the renderer knows: "tb" or "lr".
let layoutMode = "tb";
let orient = "tb";

const LAYOUTS = {
  tb:       { name:"Layered — top to bottom", axis:"tb",     run:layoutLayered },
  lr:       { name:"Layered — left to right", axis:"lr",     run:layoutLayered },
  lanes:    { name:"Category lanes",          axis:"tb",     run:layoutLanes },
  sequence: { name:"Study sequence",          axis:"tb",     run:layoutSequence }
};

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

// "flow" runs along the dependency direction, "cross" is the spread within a
// tier. Swapping which screen axis each maps to is the whole of the
// top-to-bottom / left-to-right switch.
const flowSize  = n => orient === "lr" ? n.w : n.h;
const crossSize = n => orient === "lr" ? n.h : n.w;

function layout(ctx){
  measureLabels(ctx);
  computeTiers();
  const mode = LAYOUTS[layoutMode] ? layoutMode : "tb";
  orient = LAYOUTS[mode].axis;
  LAYOUTS[mode].run();
  assignStudyOrder();
  bounds = computeBounds();
}

/* ---------- layered: columns by tier, barycentre passes to cut crossings --- */

function layoutLayered(){
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
}

/* ---------- category lanes: one column per category, tiers as bands -------- */

// Reading down a lane gives one category's whole path; reading across a band
// shows what sits at the same depth everywhere else. Every edge that leaves
// its lane is a dependency between categories, which is the point of the view.
function layoutLanes(){
  const nodes = visibleNodes();
  const keys = Object.keys(TRACKS).filter(k => nodes.some(n => n.track === k));

  const cells = {}, laneW = {};
  keys.forEach(k => { cells[k] = []; });
  nodes.forEach(n => { (cells[n.track][n.tier] ||= []).push(n); });
  keys.forEach(k => { laneW[k] = Math.max(...nodes.filter(n => n.track === k).map(n => n.w)); });

  // a band is as tall as the fullest cell in it
  const bandH = [], bandY = [];
  let y = 0;
  for (let t = 0; t <= MAX_TIER; t++) {
    const m = Math.max(0, ...keys.map(k => (cells[k][t] || []).length));
    bandH[t] = m ? m * NODE_H + (m - 1) * CROSS_GAP : 0;
    bandY[t] = y;
    if (bandH[t]) y += bandH[t] + BAND_GAP;
  }

  let x = 0;
  keys.forEach(k => {
    const cx = x + laneW[k] / 2;
    for (let t = 0; t <= MAX_TIER; t++) {
      const cell = cells[k][t] || [];
      if (!cell.length) continue;
      cell.sort((a, b) => a.label.localeCompare(b.label));
      const h = cell.length * NODE_H + (cell.length - 1) * CROSS_GAP;
      let yy = bandY[t] + (bandH[t] - h) / 2;
      cell.forEach(n => {
        n.x = cx;
        n.y = yy + NODE_H / 2;
        n.cross = n.x;          // read a band left to right
        yy += NODE_H + CROSS_GAP;
      });
    }
    x += laneW[k] + LANE_GAP;
  });
}

/* ---------- study sequence: the reading order itself, wrapped into rows ---- */

// Not a picture of the graph so much as a picture of the syllabus: 1 to N in
// order, left to right. Hovering a concept still lights its edges, so it
// doubles as a way to ask "where does number 34 actually lead?".
function layoutSequence(){
  const nodes = visibleNodes().slice().sort((a, b) =>
    a.tier - b.tier || a.track.localeCompare(b.track) || a.label.localeCompare(b.label));
  const colW = Math.max(...nodes.map(n => n.w)) + SEQ_GAP_X;
  const rowH = NODE_H + SEQ_GAP_Y;
  // Aim the block at roughly 16:9. Cells are far wider than they are tall, so
  // a plain sqrt of the count gives a strip twelve times wider than it is
  // high — the cell's own aspect has to go into the count.
  const cols = Math.max(3, Math.round(Math.sqrt(nodes.length * 1.78 * rowH / colW)));

  nodes.forEach((n, i) => {
    n.x = (i % cols) * colW;
    n.y = Math.floor(i / cols) * rowH;
    n.cross = i;              // the order this layout was built from
  });
}

/* -------------------------------------------------------------------------- */

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
