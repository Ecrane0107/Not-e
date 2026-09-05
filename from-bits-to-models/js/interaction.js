/* ============================================================
   5. INTERACTION
   ============================================================ */

function hitTest(sx, sy){
  const [wx, wy] = toWorld(sx, sy);
  for (let i = NODES.length - 1; i >= 0; i--) {
    const n = NODES[i];
    if (n.hidden) continue;
    if (Math.abs(wx - n.x) <= n.w / 2 && Math.abs(wy - n.y) <= n.h / 2) return n;
  }
  return null;
}

let drag = null;

canvas.addEventListener("pointerdown", e => {
  canvas.setPointerCapture(e.pointerId);
  const n = hitTest(e.offsetX, e.offsetY);
  drag = n
    ? { kind:"node", node:n, sx:e.offsetX, sy:e.offsetY, ox:n.x, oy:n.y, moved:false }
    : { kind:"pan", sx:e.offsetX, sy:e.offsetY, ox:cam.x, oy:cam.y, moved:false };
  canvas.classList.toggle("dragging", !n);
});

canvas.addEventListener("pointermove", e => {
  if (drag && e.buttons === 0) { endDrag(e); return; }
  if (drag) {
    const dx = e.offsetX - drag.sx, dy = e.offsetY - drag.sy;
    if (Math.hypot(dx, dy) > 3) drag.moved = true;
    if (drag.kind === "pan") { cam.x = drag.ox + dx; cam.y = drag.oy + dy; }
    else { drag.node.x = drag.ox + dx / cam.k; drag.node.y = drag.oy + dy / cam.k; }
    dirty = true;
    return;
  }
  const n = hitTest(e.offsetX, e.offsetY);
  const id = n ? n.id : null;
  canvas.classList.toggle("over-node", !!n);
  if (id !== state.hover) { state.hover = id; dirty = true; }
});

function endDrag(e){
  if (drag && !drag.moved) {
    if (drag.kind === "node") select(drag.node.id);
    else select(null);
  }
  drag = null;
  canvas.classList.remove("dragging");
  if (e && e.pointerId !== undefined && canvas.hasPointerCapture(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }
}

canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);
canvas.addEventListener("lostpointercapture", () => { drag = null; canvas.classList.remove("dragging"); });
// Backstop: if a pointerup was missed anywhere, the next move with no button ends it.
window.addEventListener("pointerup", () => { if (drag) endDrag(); });

canvas.addEventListener("pointerleave", () => {
  if (state.hover) { state.hover = null; dirty = true; }
});

canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const factor = Math.exp(-e.deltaY * 0.0015);
  const k = Math.min(2.2, Math.max(0.22, cam.k * factor));
  const [wx, wy] = toWorld(e.offsetX, e.offsetY);
  cam.k = k;
  cam.x = e.offsetX - wx * k;
  cam.y = e.offsetY - wy * k;
  dirty = true;
}, { passive:false });

/* ---------- selection + drawer ---------- */

const drawer = document.getElementById("drawer");

function select(id){
  state.selected = id;
  if (id) {
    state.ancestors = reachable(id, "in");
    state.descendants = reachable(id, "out");
    state.route = routeToStart(id);
    state.routeEdges = new Set();
    if (state.route) {
      for (let i = 0; i < state.route.length - 1; i++) {
        state.routeEdges.add(state.route[i] + ">" + state.route[i + 1]);
      }
    }
    renderDrawer(byId.get(id));
    drawer.classList.add("open");
  } else {
    state.ancestors = new Set();
    state.descendants = new Set();
    state.route = null;
    state.routeEdges = null;
    drawer.classList.remove("open");
    drawer.innerHTML = "";
  }
  dirty = true;
}

// Legend swatch: solid bar for AI, otherwise the track's own dash pattern.
function ruleStyle(t){
  if (!t.dash.length) return `background:${t.color}`;
  const d = t.dash.length % 2 ? [...t.dash, ...t.dash] : t.dash;
  const period = d.reduce((a, b) => a + b, 0);
  let pos = 0;
  const stops = d.map((len, i) => {
    const from = pos, to = pos + len;
    pos = to;
    return `${i % 2 ? "transparent" : t.color} ${from}px ${to}px`;
  });
  return `background:repeating-linear-gradient(90deg, ${stops.join(", ")}) 0 0 / ${period}px 100%`;
}

function chipList(ids, emptyText){
  if (!ids.length) return `<p class="none">${emptyText}</p>`;
  return `<div class="chips">` + ids.map(id => {
    const n = byId.get(id);
    return `<button class="chip" data-goto="${n.id}" style="border-left-color:${TRACKS[n.track].color}">${n.label}</button>`;
  }).join("") + `</div>`;
}

function bookletMarkup(n){
  const bk = loadBooklet(n.id);
  if (!bk) return "";
  const ex = bk.chapters.reduce((t, c) => t + (c.exercises ? c.exercises.length : 0), 0);
  return `<button class="open-booklet" data-booklet="${n.id}">Open the booklet
    <small>${bk.chapters.length} chapters, ${ex} exercises</small></button>`;
}

function problemMarkup(n){
  // A booklet carries its own exercises, so the short practice list only shows
  // for concepts whose booklet is not written yet.
  if (loadBooklet(n.id)) return "";
  const ps = PROBLEMS[n.id];
  if (!ps || !ps.length) return "";
  const items = ps.map((p, i) => `<li>
      <p class="q">${p.q}</p>
      <details class="work">
        <summary>Work through it</summary>
        <ol class="steps">${p.steps.map(st => `<li>${st}</li>`).join("")}</ol>
        <p class="ans">${p.answer}</p>
      </details>
    </li>`).join("");
  return `<div class="grp"><h3>Practice</h3><ol class="probs">${items}</ol></div>`;
}

function routeMarkup(n){
  if (n.start || !state.route) return "";
  const steps = state.route.map((id, i) => {
    const s = byId.get(id);
    return `<li><span class="step">${i + 1}</span>
      <button class="chip" data-goto="${s.id}">${s.label}</button></li>`;
  }).join("");
  return `<div class="grp">
    <h3>Shortest route from an entry point (${state.route.length} steps)</h3>
    <ol class="route">${steps}</ol>
  </div>`;
}

function renderDrawer(n){
  const track = TRACKS[n.track];
  const d = DETAILS[n.id] || {};
  const before = state.ancestors.size;
  const after = state.descendants.size;
  drawer.innerHTML = `
    <button class="close" id="closeDrawer" aria-label="Close details">×</button>
    <div class="drawer-line"><span class="rule" style="${ruleStyle(track)}"></span>${track.name}</div>
    <h2>${n.label}</h2>
    <p class="depth">Step ${n.order} of ${visibleCount()} in study order. ${before} concept${before === 1 ? "" : "s"} before it, ${after} after.</p>
    <p class="body">${n.desc}</p>
    ${d.detail ? `<p class="detail">${d.detail}</p>` : ""}
    ${d.covers ? `<div class="grp"><h3>What it covers</h3>
        <ul class="covers">${d.covers.map(c => `<li>${c}</li>`).join("")}</ul></div>` : ""}
    ${d.check ? `<div class="entry"><h3>You have it when</h3><p>${d.check}</p></div>` : ""}
    ${n.start ? `<div class="entry"><h3>Entry point</h3><p>${n.note}</p></div>` : ""}
    ${bookletMarkup(n)}
    ${problemMarkup(n)}
    ${routeMarkup(n)}
    <div class="grp">
      <h3>Comes after</h3>
      ${chipList(inOf(n), "Nothing — this is a starting point.")}
    </div>
    <div class="grp">
      <h3>Leads to</h3>
      ${chipList(outOf(n), "Nothing yet — this is an endpoint on the map.")}
    </div>
    <div class="stepnav">
      <button class="ghost" id="stepPrev" ${n.order === 1 ? "disabled" : ""}>Previous</button>
      <span>${n.order === 1 ? "First concept" : n.order === visibleCount() ? "Last concept" : "Walk the order"}</span>
      <button class="ghost" id="stepNext" ${n.order === visibleCount() ? "disabled" : ""}>Next</button>
    </div>`;
  drawer.querySelector("#closeDrawer").addEventListener("click", () => select(null));
  const step = (delta) => {
    const next = STUDY[n.order - 1 + delta];
    if (next) { select(next.id); centerOn(next.id); }
  };
  const prevBtn = drawer.querySelector("#stepPrev"), nextBtn = drawer.querySelector("#stepNext");
  if (prevBtn && !prevBtn.disabled) prevBtn.addEventListener("click", () => step(-1));
  if (nextBtn && !nextBtn.disabled) nextBtn.addEventListener("click", () => step(1));
  const bkBtn = drawer.querySelector("[data-booklet]");
  if (bkBtn) bkBtn.addEventListener("click", () => openBooklet(bkBtn.dataset.booklet));
  drawer.querySelectorAll("[data-goto]").forEach(b => {
    b.addEventListener("click", () => { select(b.dataset.goto); centerOn(b.dataset.goto); });
  });
}

function centerOn(id){
  const n = byId.get(id);
  cam.x = viewW / 2 - n.x * cam.k;
  cam.y = viewH / 2 - n.y * cam.k;
  dirty = true;
}

document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (!reader.hidden) closeBooklet(); else select(null);
});

/* ---------- booklet reader ---------- */

const reader = document.getElementById("reader");
const tocEl = document.getElementById("toc");
const readBody = document.getElementById("readBody");
let openBook = null, chIndex = 0;

function blockHTML(b){
  switch (b.t) {
    case "p":    return `<p>${b.x}</p>`;
    case "h":    return `<h3>${b.x}</h3>`;
    case "note": return `<aside class="note">${b.x}</aside>`;
    case "code": return `<pre class="code">${b.x}</pre>`;
    case "fig":  return `<figure class="fig">${b.svg}
      ${b.cap ? `<figcaption>${b.cap}</figcaption>` : ""}</figure>`;
    case "list": return `<ul>${b.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    case "terms": return `<dl class="terms">${
      b.items.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join("")}</dl>`;
    case "worked": return `<div class="worked">
        <p class="wq">${b.q}</p>
        <ol>${b.steps.map(st => `<li>${st}</li>`).join("")}</ol>
        ${b.answer ? `<p class="wa">${b.answer}</p>` : ""}
      </div>`;
    default: return "";
  }
}

// Write-in answers are checked loosely: case, punctuation, plurals and small
// typos are forgiven, so the reader is tested on the term, not on spelling.
function normAns(s){
  return String(s).toLowerCase().normalize("NFKD")
    .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}
function stemAns(s){
  return normAns(s).split(" ").map(w =>
    w.replace(/ies$/, "y").replace(/([^s])s$/, "$1")).join(" ");
}
function editDistance(a, b){
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1,
                        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}
function answerMatches(input, accepted){
  const given = stemAns(input);
  if (!given) return false;
  return accepted.some(a => {
    const want = stemAns(a);
    if (given === want) return true;
    const tol = want.length > 8 ? 2 : want.length > 4 ? 1 : 0;
    return editDistance(given, want) <= tol;
  });
}

function exerciseHTML(p, j){
  const body = `<ol class="steps">${p.steps.map(st => `<li>${st}</li>`).join("")}</ol>
    <p class="ans">${p.answer}</p>`;
  if (p.kind === "mc") {
    const opts = p.options.map((o, k) =>
      `<button class="opt" data-k="${k}">${o}</button>`).join("");
    return `<div class="ex" data-kind="mc" data-correct="${p.correct}">
      <p class="wq">${j + 1}. ${p.q}</p>
      <div class="opts">${opts}</div>
      <div class="verdict" hidden></div>
      <div class="expl" hidden>${body}</div></div>`;
  }
  if (p.kind === "write") {
    return `<div class="ex" data-kind="write" data-accept="${encodeURIComponent(JSON.stringify(p.accept))}">
      <p class="wq">${j + 1}. ${p.q}</p>
      <div class="writein">
        <input type="text" class="ansin" placeholder="${p.hint || "your answer"}" autocomplete="off" spellcheck="false">
        <button class="ghost check">Check</button>
        <button class="ghost reveal">Show</button>
      </div>
      <div class="verdict" hidden></div>
      <div class="expl" hidden>${body}</div></div>`;
  }
  return `<div class="worked"><p class="wq">${j + 1}. ${p.q}</p>
    <details class="work"><summary>Work through it</summary>${body}</details></div>`;
}

function wireExercises(root){
  root.querySelectorAll(".ex").forEach(ex => {
    const verdict = ex.querySelector(".verdict"), expl = ex.querySelector(".expl");
    const settle = (ok, msg) => {
      verdict.textContent = msg;
      verdict.className = "verdict " + (ok ? "right" : "wrong");
      verdict.hidden = false;
      expl.hidden = false;
    };
    if (ex.dataset.kind === "mc") {
      const correct = Number(ex.dataset.correct);
      ex.querySelectorAll(".opt").forEach(btn => {
        btn.addEventListener("click", () => {
          if (ex.dataset.done) return;
          ex.dataset.done = "1";
          const k = Number(btn.dataset.k);
          ex.querySelectorAll(".opt").forEach((b, i) => {
            if (i === correct) b.classList.add("is-right");
            else if (i === k) b.classList.add("is-wrong");
            b.disabled = true;
          });
          settle(k === correct, k === correct ? "Correct." : "Not quite.");
        });
      });
    } else {
      const accept = JSON.parse(decodeURIComponent(ex.dataset.accept));
      const input = ex.querySelector(".ansin");
      const grade = () => {
        const ok = answerMatches(input.value, accept);
        input.classList.add(ok ? "is-right" : "is-wrong");
        settle(ok, ok ? "Correct." : `Not quite — the term is “${accept[0]}”.`);
      };
      ex.querySelector(".check").addEventListener("click", grade);
      input.addEventListener("keydown", e => { if (e.key === "Enter") grade(); });
      ex.querySelector(".reveal").addEventListener("click", () => {
        input.value = accept[0];
        settle(true, `The term is “${accept[0]}”.`);
      });
    }
  });
}

function chapterBlocks(bk, i){
  const ch = bk.chapters[i];
  if (!ch.exercises) return ch.blocks.map(blockHTML).join("");
  return ch.blocks.map(blockHTML).join("") +
    ch.exercises.map((p, j) => exerciseHTML(p, j)).join("");
}

function renderChapter(i){
  const bk = openBook;
  chIndex = Math.max(0, Math.min(i, bk.chapters.length - 1));
  const ch = bk.chapters[chIndex];
  readBody.innerHTML = `<div class="read-inner">
    <p class="ch-eyebrow">${bk.title} — chapter ${chIndex + 1} of ${bk.chapters.length}</p>
    <h2>${ch.title}</h2>
    ${chapterBlocks(bk, chIndex)}
    <div class="ch-nav">
      <button class="ghost" id="chPrev" ${chIndex === 0 ? "disabled" : ""}>Previous</button>
      <span>${chIndex + 1} / ${bk.chapters.length}</span>
      <button class="ghost" id="chNext" ${chIndex === bk.chapters.length - 1 ? "disabled" : ""}>Next</button>
    </div>
  </div>`;
  const pv = readBody.querySelector("#chPrev"), nx = readBody.querySelector("#chNext");
  if (pv && !pv.disabled) pv.addEventListener("click", () => renderChapter(chIndex - 1));
  if (nx && !nx.disabled) nx.addEventListener("click", () => renderChapter(chIndex + 1));
  tocEl.querySelectorAll(".toc-btn").forEach((b, j) =>
    b.setAttribute("aria-current", String(j === chIndex)));
  wireExercises(readBody);
  readBody.scrollTop = 0;
}

function openBooklet(id){
  const bk = loadBooklet(id);
  if (!bk) return;
  // The vocabulary chapter is built once, from the terms defined in the text.
  if (bk.vocab && !bk._vocabAdded) {
    bk.chapters.push({
      title: "Vocabulary",
      blocks: [
        { t:"p", x:"Every term the booklet defined, in one place. The write-in exercises are answered with words from this list, so it is worth reading through before attempting them." },
        { t:"terms", items: bk.vocab }
      ]
    });
    bk._vocabAdded = true;
  }
  openBook = bk;
  tocEl.innerHTML = `<p class="toc-head">${bk.title}</p>
    <p class="toc-meta">${bk.chapters.length} chapters</p>` +
    bk.chapters.map((c, i) =>
      `<button class="toc-btn"><span class="toc-num">${i + 1}</span>${c.title}</button>`).join("");
  tocEl.querySelectorAll(".toc-btn").forEach((b, i) =>
    b.addEventListener("click", () => renderChapter(i)));
  reader.hidden = false;
  renderChapter(0);
  document.getElementById("readClose").focus();
}

function closeBooklet(){
  reader.hidden = true;
  openBook = null;
}
document.getElementById("readClose").addEventListener("click", closeBooklet);

/* ---------- entry points ---------- */

const startsEl = document.getElementById("starts");
function renderStarts(){
  startsEl.innerHTML = `<p class="lines-title">Places to start</p>`;
  const entries = visibleNodes().filter(n => n.start).sort((a, b) => a.order - b.order);
  if (!entries.length) {
    startsEl.insertAdjacentHTML("beforeend",
      `<p class="none" style="padding:0 8px">No entry points in the categories you have on.</p>`);
    return;
  }
  entries.forEach(n => {
    const b = document.createElement("button");
    b.className = "start-btn";
    b.innerHTML = `<span class="dot"></span>
      <span class="start-text"><strong>${n.label}</strong><em>${n.note}</em></span>`;
    b.addEventListener("click", () => { select(n.id); centerOn(n.id); });
    startsEl.appendChild(b);
  });
}

/* ---------- line filters ---------- */

const linesEl = document.getElementById("lines");
for (const [key, t] of Object.entries(TRACKS)) {
  const count = NODES.filter(n => n.track === key).length;
  const b = document.createElement("button");
  b.className = "line-btn";
  b.setAttribute("aria-pressed", "true");
  b.dataset.track = key;
  b.innerHTML = `<span class="rule" style="${ruleStyle(t)}"></span>${t.name}<span class="line-count">${count}</span>`;
  b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") === "true";
    if (on && state.hiddenTracks.size === Object.keys(TRACKS).length - 1) return; // keep one
    b.setAttribute("aria-pressed", String(!on));
    if (on) state.hiddenTracks.add(key); else state.hiddenTracks.delete(key);
    applyFilter();
  });
  linesEl.appendChild(b);
}

// Rebuild everything a hidden category touches: tiers, layout, study numbers,
// the entry point list, and the current selection if it just disappeared.
function applyFilter(){
  // Several goals union together: a concept survives if any chosen goal needs it.
  const targets = [...state.goals].flatMap(k => GOALS[k].targets);
  const need = targets.length ? requiredFor(targets) : null;
  NODES.forEach(n => {
    n.hidden = state.hiddenTracks.has(n.track) || (need ? !need.has(n.id) : false);
  });
  layout(ctx);
  buildFallback();
  renderStarts();
  updateLineCounts();
  updateGoalNote();
  if (state.selected && byId.get(state.selected).hidden) select(null);
  else if (state.selected) select(state.selected);
  fit();
}

function updateLineCounts(){
  document.querySelectorAll("[data-track]").forEach(el => {
    const k = el.dataset.track;
    const n = NODES.filter(x => x.track === k && !x.hidden).length;
    el.querySelector(".line-count").textContent = n;
    el.style.opacity = n === 0 ? ".45" : "1";
  });
}

/* ---------- search ---------- */

const search = document.getElementById("search");
search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  state.query = q;
  if (!q) { state.matches = null; dirty = true; return; }
  state.matches = new Set(
    NODES.filter(n => n.label.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q))
         .map(n => n.id)
  );
  dirty = true;
});

/* ---------- rail buttons ---------- */

const dirLR = document.getElementById("dirLR"), dirTB = document.getElementById("dirTB");
function setOrient(o){
  if (o === orient) return;
  orient = o;
  layout(ctx);
  fit();
  if (state.selected) renderDrawer(byId.get(state.selected));
  buildFallback();
  dirLR.setAttribute("aria-pressed", String(o === "lr"));
  dirTB.setAttribute("aria-pressed", String(o === "tb"));
}
dirLR.addEventListener("click", () => setOrient("lr"));
dirTB.addEventListener("click", () => setOrient("tb"));

const goalsEl = document.getElementById("goals");
goalsEl.innerHTML = `<p class="lines-title">Aim for one or more of these</p>`;
for (const [key, g] of Object.entries(GOALS)) {
  const b = document.createElement("button");
  b.className = "goal-btn";
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = `<span class="box"></span>${g.name}`;
  b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") === "true";
    b.setAttribute("aria-pressed", String(!on));
    if (on) state.goals.delete(key); else state.goals.add(key);
    applyFilter();
  });
  goalsEl.appendChild(b);
}
const goalNote = document.createElement("p");
goalNote.className = "goal-note";
goalsEl.appendChild(goalNote);

function updateGoalNote(){
  const picked = [...state.goals];
  if (!picked.length) {
    goalNote.textContent = `Nothing chosen, so all ${NODES.length} concepts are numbered.`;
  } else if (picked.length === 1) {
    goalNote.textContent = `${GOALS[picked[0]].note} ${visibleCount()} concepts, numbered 1 to ${visibleCount()}.`;
  } else {
    goalNote.textContent = `${picked.map(k => GOALS[k].name).join(" and ")}, merged into one order of ${visibleCount()} concepts.`;
  }
}

document.getElementById("fit").addEventListener("click", () => fit());
document.getElementById("relayout").addEventListener("click", () => { layout(ctx); buildFallback(); fit(); });
document.getElementById("copy").addEventListener("click", async (e) => {
  const payload = JSON.stringify({
    tracks: TRACKS,
    goals: [...state.goals],
    nodes: STUDY.map(({ id, label, track, desc, tier, order, start, note }) =>
      ({ id, label, track, desc, tier, order, start: !!start, note: note || null,
         ...(DETAILS[id] || {}) })),
    edges: EDGES
  }, null, 2);
  try {
    await navigator.clipboard.writeText(payload);
    e.target.textContent = "Copied";
  } catch {
    e.target.textContent = "Copy blocked";
  }
  setTimeout(() => { e.target.textContent = "Copy data"; }, 1600);
});

/* ---------- screen-reader fallback ---------- */

function buildFallback(){
  document.getElementById("fallback").innerHTML =
    "<h2>Concepts in study order</h2><ol>" +
    STUDY.map(n => `<li>${n.label} — category: ${TRACKS[n.track].name}.${
      n.start ? " Entry point: " + n.note : ""
    } Requires: ${
      inOf(n).length ? inOf(n).map(i => byId.get(i).label).join(", ") : "nothing"
    }.</li>`).join("") + "</ol>";
}

/* ---------- boot ---------- */

function paintGrain(){
  const n = document.createElement("canvas");
  n.width = n.height = 140;
  const g = n.getContext("2d");
  const img = g.createImageData(140, 140);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 40 + Math.random() * 215;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  document.getElementById("grain").style.backgroundImage = `url(${n.toDataURL()})`;
}

function boot(){
  paintGrain();
  resize();
  layout(ctx);
  buildFallback();
  renderStarts();
  updateLineCounts();
  updateGoalNote();
  fit();
  state.reveal = reduceMotion ? 1 : 0;
  requestAnimationFrame(frame);
}

window.addEventListener("resize", () => { resize(); });
// The drawer opening changes the canvas box without a window resize event.
if (window.ResizeObserver) new ResizeObserver(() => resize()).observe(canvas.parentElement);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
else window.addEventListener("load", boot);
