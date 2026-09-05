/* ============================================================
   2. GRAPH MODEL
   ============================================================ */

const byId = new Map(NODES.map(n => [n.id, n]));
NODES.forEach(n => { n.in = []; n.out = []; });
for (const [from, to] of EDGES) {
  const a = byId.get(from), b = byId.get(to);
  if (!a || !b) { console.warn("unknown node in edge", from, to); continue; }
  a.out.push(b.id);
  b.in.push(a.id);
}

// Hiding a category removes it from the graph outright, so every traversal
// below walks the visible subgraph rather than the full one.
const shown = n => !n.hidden;
const inOf  = n => n.in.filter(id => shown(byId.get(id)));
const outOf = n => n.out.filter(id => shown(byId.get(id)));
const visibleNodes = () => NODES.filter(shown);
const visibleCount = () => visibleNodes().length;

// Tier = longest path from any root. Guarantees prerequisites sit upstream.
let MAX_TIER = 0;
function computeTiers(){
  const tier = new Map();
  const visit = (id, seen) => {
    if (tier.has(id)) return tier.get(id);
    if (seen.has(id)) return 0;               // cycle guard
    seen.add(id);
    const parents = inOf(byId.get(id));
    const t = parents.length ? Math.max(...parents.map(p => visit(p, seen))) + 1 : 0;
    seen.delete(id);
    tier.set(id, t);
    return t;
  };
  MAX_TIER = 0;
  NODES.forEach(n => {
    n.tier = shown(n) ? visit(n.id, new Set()) : 0;
    if (shown(n)) MAX_TIER = Math.max(MAX_TIER, n.tier);
  });
}
computeTiers();

// Shortest chain from any entry point to a concept: BFS backwards
// through prerequisites, stopping at the first node flagged as a start.
function routeToStart(targetId){
  if (byId.get(targetId).start) return [targetId];
  const next = new Map(), seen = new Set([targetId]);
  const queue = [targetId];
  while (queue.length) {
    const cur = queue.shift();
    for (const p of inOf(byId.get(cur))) {
      if (seen.has(p)) continue;
      seen.add(p);
      next.set(p, cur);
      if (byId.get(p).start) {
        const path = [p];
        let c = p;
        while (c !== targetId) { c = next.get(c); path.push(c); }
        return path;
      }
      queue.push(p);
    }
  }
  return null;
}

function reachable(startId, dir){
  const out = new Set(), stack = [startId];
  while (stack.length) {
    const cur = byId.get(stack.pop());
    const nb = dir === "in" ? inOf(cur) : outOf(cur);
    for (const id of nb) if (!out.has(id)) { out.add(id); stack.push(id); }
  }
  return out;
}

/* A goal is a set of destinations. Everything those destinations depend on is
   in; everything else is out. This is why a pure software engineering track
   never pulls in calculus — nothing on that path depends on it. */
const GOALS = {
  swe:   { name:"Software engineering", targets:["oop","testing","modules","databases","networking","concurrency","dp","graphalgo","stringalgo"],
           note:"Building and shipping systems. No calculus, no linear algebra — nothing on this path needs them." },
  csCore:{ name:"Computer science core", targets:["dp","graphalgo","stringalgo","os","distributed","databases"],
           note:"The theory and systems layer, the way a degree sequences it." },
  data:  { name:"Data science", targets:["supervised","unsupervised","evaluation","embeddings"],
           note:"Modelling from data, stopping short of deep learning internals." },
  mlEng: { name:"Machine learning research", targets:["attention","scaletrain","rl","cv","alignment"],
           note:"Building and training models yourself, down to the gradients." },
  aiEng: { name:"AI engineering", targets:["agents","rag","finetune","mlops","alignment"],
           note:"Working on top of large models: retrieval, adaptation, deployment." },
  math:  { name:"Math for machine learning", targets:["optimization","infotheory","stats"],
           note:"Only the mathematics, without the engineering around it." }
};


// Every prerequisite of every destination, walked over the unfiltered graph.
function requiredFor(targets){
  const need = new Set(), stack = [...targets];
  while (stack.length) {
    const id = stack.pop();
    if (need.has(id)) continue;
    need.add(id);
    byId.get(id).in.forEach(pid => stack.push(pid));
  }
  return need;
}

