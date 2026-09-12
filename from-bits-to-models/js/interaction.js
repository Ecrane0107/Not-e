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

// two-finger pinch to zoom -- touch has no wheel event, so without this
// there was simply no way to zoom on a phone at all. Tracks every active
// pointer by id; once a second one lands, drop any single-finger drag and
// scale/pan from the pinch midpoint instead.
const activePointers = new Map();
let pinch = null;

function pointerDistance(){
  const [a, b] = activePointers.values();
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function pointerMidpoint(){
  const [a, b] = activePointers.values();
  return [(a.x + b.x) / 2, (a.y + b.y) / 2];
}

canvas.addEventListener("pointerdown", e => {
  canvas.setPointerCapture(e.pointerId);
  activePointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });

  if (activePointers.size === 2) {
    drag = null;
    canvas.classList.remove("dragging");
    pinch = { startDist: pointerDistance(), startK: cam.k, startCamX: cam.x, startCamY: cam.y, startMid: pointerMidpoint() };
    return;
  }
  if (activePointers.size > 2) return; // ignore a third finger

  const n = hitTest(e.offsetX, e.offsetY);
  drag = n
    ? { kind:"node", node:n, sx:e.offsetX, sy:e.offsetY, ox:n.x, oy:n.y, moved:false }
    : { kind:"pan", sx:e.offsetX, sy:e.offsetY, ox:cam.x, oy:cam.y, moved:false };
  canvas.classList.toggle("dragging", !n);
});

canvas.addEventListener("pointermove", e => {
  if (activePointers.has(e.pointerId)) activePointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });

  if (pinch && activePointers.size === 2) {
    const dist = pointerDistance();
    const mid = pointerMidpoint();
    const k = Math.min(2.2, Math.max(0.22, pinch.startK * (dist / pinch.startDist)));
    const wx = (pinch.startMid[0] - pinch.startCamX) / pinch.startK;
    const wy = (pinch.startMid[1] - pinch.startCamY) / pinch.startK;
    cam.k = k;
    cam.x = mid[0] - wx * k;
    cam.y = mid[1] - wy * k;
    dirty = true;
    return;
  }

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
  if (e && e.pointerId !== undefined) {
    activePointers.delete(e.pointerId);
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
  }
  if (activePointers.size < 2) pinch = null;
}

canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);
canvas.addEventListener("lostpointercapture", () => { drag = null; canvas.classList.remove("dragging"); });
// Backstop: if a pointerup was missed anywhere, the next move with no button ends it.
window.addEventListener("pointerup", () => { if (drag) endDrag(); });

// zoom +/- and fit-to-view buttons floating over the map -- a pinch gesture
// isn't always discoverable, so this stays as a always-visible fallback
function zoomBy(factor){
  const k = Math.min(2.2, Math.max(0.22, cam.k * factor));
  const cx = viewW / 2, cy = viewH / 2;
  const [wx, wy] = toWorld(cx, cy);
  cam.k = k;
  cam.x = cx - wx * k;
  cam.y = cy - wy * k;
  dirty = true;
}
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomFitBtn = document.getElementById("zoomFit");
if (zoomInBtn) zoomInBtn.addEventListener("click", () => zoomBy(1.35));
if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => zoomBy(1 / 1.35));
if (zoomFitBtn) zoomFitBtn.addEventListener("click", () => fit());

// mobile: the browse panel (search/filters) overlays the map instead of
// pushing it down, so it starts collapsed and toggles open/closed
const railEl = document.querySelector(".rail");
const browseToggle = document.getElementById("browseToggle");
if (browseToggle) {
  browseToggle.addEventListener("click", () => {
    const open = railEl.classList.toggle("open");
    browseToggle.setAttribute("aria-expanded", String(open));
  });
}
canvas.addEventListener("pointerdown", () => {
  if (railEl.classList.contains("open")) {
    railEl.classList.remove("open");
    if (browseToggle) browseToggle.setAttribute("aria-expanded", "false");
  }
});

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
  // Count what the reader will actually get: the vocabulary and mixed-practice
  // chapters are appended on open, so they are added here rather than counted.
  const ex = bk.chapters.reduce((t, c) => t + (c.exercises ? c.exercises.length : 0), 0)
    + ((!bk._problemsAdded && PROBLEMS[n.id]) ? PROBLEMS[n.id].length : 0);
  const ch = bk.chapters.length
    + (bk.vocab && !bk._vocabAdded ? 1 : 0)
    + (!bk._problemsAdded && PROBLEMS[n.id] && PROBLEMS[n.id].length ? 1 : 0);
  return `<button class="open-booklet" data-booklet="${n.id}">Open the booklet
    <small>${ch} chapters, ${ex} practice questions</small></button>`;
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

/* ---------- practice quiz ----------
   A chapter's exercises are worked one card at a time rather than listed
   all at once: a progress strip you can click back through, hints drawn
   from the worked steps and revealed one at a time, a check that lets you
   try again after a miss, and a score at the end. Everything renders from
   `quiz` state, so re-rendering a card is always safe. */

// Status per question: right = first attempt, help = correct after a miss or
// a hint, shown = gave up and read the solution, seen = walkthrough read.
const STATUS_LABEL = { right:"correct", help:"correct with help", shown:"solution shown", seen:"read" };
const CHOICE_LETTER = "ABCDEFGH";

let quiz = null;

function quizKind(p){
  return p.kind === "mc" || p.kind === "write" ? p.kind : "walk";
}
function isGraded(p){ return quizKind(p) !== "walk"; }
function isSettled(s){ return s.status === "right" || s.status === "help" || s.status === "shown"; }

function startQuiz(exercises){
  quiz = {
    items: exercises,
    i: 0,
    finished: false,
    st: exercises.map(() => ({ status:null, picked:null, wrong:[], value:"",
                               hints:0, solved:false, miss:false, everWrong:false }))
  };
}

function quizDotsHTML(){
  return `<div class="qdots">` + quiz.st.map((s, k) => {
    const cls = ["qdot", s.status ? "is-" + s.status : "",
      k === quiz.i && !quiz.finished ? "is-at" : ""].filter(Boolean).join(" ");
    const what = s.status ? ", " + STATUS_LABEL[s.status] : "";
    return `<button class="${cls}" data-jump="${k}" title="Question ${k + 1}${what}"
      aria-label="Question ${k + 1}${what}"></button>`;
  }).join("") + `</div>`;
}

function quizStepsHTML(steps, n, word){
  if (!n) return "";
  return `<div class="qsteps">` + steps.slice(0, n).map((st, k) =>
    `<div class="qstep"><span class="qstep-n">${word} ${k + 1}</span><p>${st}</p></div>`
  ).join("") + `</div>`;
}

function quizCardHTML(){
  const p = quiz.items[quiz.i], s = quiz.st[quiz.i];
  const kind = quizKind(p), steps = p.steps || [];
  const settled = isSettled(s);
  const last = quiz.i === quiz.items.length - 1;

  let field = "";
  if (kind === "mc") {
    field = `<div class="qchoices">` + p.options.map((o, k) => {
      const missed = s.wrong.includes(k);
      const cls = ["qchoice",
        missed ? "is-wrong" : "",
        settled && k === p.correct ? "is-right" : "",
        !settled && s.picked === k ? "is-picked" : ""].filter(Boolean).join(" ");
      return `<button class="${cls}" data-pick="${k}"${settled || missed ? " disabled" : ""}>
        <span class="qletter">${CHOICE_LETTER[k]}</span><span class="qopt">${o}</span></button>`;
    }).join("") + `</div>`;
  } else if (kind === "write") {
    const mark = s.status === "right" || s.status === "help" ? " is-right" : "";
    field = `<div class="qwrite">
      <input type="text" class="qinput${mark}" value="${String(s.value).replace(/"/g, "&quot;")}"
        placeholder="${p.hint || "type your answer"}" autocomplete="off" spellcheck="false"
        ${settled ? "disabled" : ""}>
    </div>`;
  }

  // Hints are the worked steps metered out one at a time; once the question is
  // settled the rest open up as the full explanation, so they read as steps.
  const word = (kind === "walk" || settled) ? "Step" : "Hint";
  const revealed = (s.solved || settled) ? steps.length : s.hints;
  const hintsLeft = revealed < steps.length;

  let feedback = "";
  if (s.status === "right")  feedback = `<p class="qfb is-good">Correct.</p>`;
  if (s.status === "help")   feedback = `<p class="qfb is-good">Correct — you had help on this one.</p>`;
  if (s.status === "shown")  feedback = `<p class="qfb is-flat">Solution shown.</p>`;
  if (s.miss)                feedback = `<p class="qfb is-bad">Not quite. Try again, or take a hint.</p>`;

  const answer = (settled || (kind === "walk" && s.solved))
    ? `<p class="qanswer">${p.answer}</p>` : "";

  let foot;
  if (settled || (kind === "walk" && s.status === "seen")) {
    foot = `<button class="qbtn is-primary" data-act="next">${
      last ? "See how you did" : "Next question"}</button>`;
  } else if (kind === "walk") {
    foot = `<button class="qbtn" data-act="hint"${hintsLeft ? "" : " disabled"}>${
        s.hints === 0 ? "Work through it" : "Next step"}</button>
      <button class="qbtn is-primary" data-act="walkdone">Show the answer</button>`;
  } else {
    const canSolve = s.wrong.length > 0 || s.hints > 0;
    foot = `<button class="qbtn" data-act="hint"${hintsLeft ? "" : " disabled"}>${
        s.hints === 0 ? "Hint" : hintsLeft ? `Next hint (${s.hints}/${steps.length})` : "No hints left"}</button>
      ${canSolve ? `<button class="qbtn" data-act="solution">Show solution</button>` : ""}
      <button class="qbtn is-primary" data-act="check"${
        kind === "mc" && s.picked === null ? " disabled" : ""}>Check</button>`;
  }

  return `<div class="qcard">
      <p class="qprompt">${p.q}</p>
      ${field}
      ${quizStepsHTML(steps, revealed, word)}
      ${answer}
      ${feedback}
      <div class="qfoot">${foot}</div>
    </div>`;
}

function quizDoneHTML(){
  const graded = quiz.items.filter(isGraded).length;
  const right = quiz.st.filter(s => s.status === "right").length;
  const help  = quiz.st.filter(s => s.status === "help").length;
  let line;
  if (!graded) line = "Walkthroughs read.";
  else if (right === graded) line = `${right} of ${graded} — all of them first time.`;
  else line = `${right} of ${graded} first time` + (help ? `, ${help} more after a hint.` : ".");
  return `<div class="qdone">
    <p class="qdone-score">${line}</p>
    <p class="qdone-note">Click any square above to look back at a question, or run the set again.</p>
    <button class="qbtn is-primary" data-act="restart">Practice again</button>
  </div>`;
}

function renderQuiz(){
  const mount = document.getElementById("quizMount");
  if (!mount || !quiz) return;
  const n = quiz.items.length;
  mount.innerHTML = `
    <div class="qhead">
      <p class="qtitle">Practice</p>
      ${quizDotsHTML()}
      <p class="qcount">${quiz.finished ? "Done" : `${quiz.i + 1} of ${n}`}</p>
    </div>
    ${quiz.finished ? quizDoneHTML() : quizCardHTML()}`;
  wireQuiz(mount);
}

function wireQuiz(mount){
  const s = quiz.st[quiz.i], p = quiz.items[quiz.i];
  const steps = p ? (p.steps || []) : [];

  mount.querySelectorAll("[data-jump]").forEach(b => b.addEventListener("click", () => {
    quiz.i = Number(b.dataset.jump);
    quiz.finished = false;
    renderQuiz();
  }));

  mount.querySelectorAll("[data-pick]").forEach(b => b.addEventListener("click", () => {
    s.picked = Number(b.dataset.pick);
    s.miss = false;
    renderQuiz();
  }));

  const input = mount.querySelector(".qinput");
  if (input) {
    input.addEventListener("input", () => { s.value = input.value; });
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") { s.value = input.value; check(); }
    });
    if (!input.disabled && s.status === null) input.focus();
  }

  // A miss keeps the question open: the wrong choice is struck out and you
  // pick again, the way Khan Academy handles a first attempt.
  function check(){
    const kind = quizKind(p);
    const ok = kind === "mc"
      ? s.picked === p.correct
      : answerMatches(s.value, p.accept);
    if (ok) {
      // `wrong` only holds struck-out choices, so write-ins need their own flag
      // for a miss -- otherwise a second, correct try would score as first time.
      s.status = (s.everWrong || s.hints) ? "help" : "right";
      s.miss = false;
    } else {
      s.miss = true;
      s.everWrong = true;
      if (kind === "mc" && s.picked !== null && !s.wrong.includes(s.picked)) s.wrong.push(s.picked);
      s.picked = null;
    }
    renderQuiz();
  }

  const advance = () => {
    if (quiz.i === quiz.items.length - 1) quiz.finished = true;
    else quiz.i++;
    renderQuiz();
    const mo = document.getElementById("quizMount");
    if (mo) mo.scrollIntoView({ block:"start", behavior: reduceMotion ? "auto" : "smooth" });
  };

  mount.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => {
    switch (b.dataset.act) {
      case "hint":     if (s.hints < steps.length) s.hints++; s.miss = false; renderQuiz(); break;
      case "solution": s.status = "shown"; s.solved = true; s.miss = false; renderQuiz(); break;
      case "check":    if (quizKind(p) !== "mc" && !String(s.value).trim()) return; check(); break;
      case "walkdone":
        if (!s.solved) { s.solved = true; s.status = "seen"; renderQuiz(); }
        else advance();
        break;
      case "next":     advance(); break;
      case "restart":  startQuiz(quiz.items); renderQuiz(); break;
    }
  }));
}

function renderChapter(i){
  const bk = openBook;
  chIndex = Math.max(0, Math.min(i, bk.chapters.length - 1));
  const ch = bk.chapters[chIndex];
  const hasQuiz = ch.exercises && ch.exercises.length;
  readBody.innerHTML = `<div class="read-inner">
    <p class="ch-eyebrow">${bk.title} — chapter ${chIndex + 1} of ${bk.chapters.length}</p>
    <h2>${ch.title}</h2>
    ${ch.blocks.map(blockHTML).join("")}
    ${hasQuiz ? `<div class="quiz" id="quizMount"></div>` : ""}
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
  if (hasQuiz) { startQuiz(ch.exercises); renderQuiz(); }
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
  // The longer problems in PROBLEMS span the whole concept rather than one
  // chapter, so they close the booklet as a final set instead of sitting in
  // the drawer, where a written booklet used to hide them entirely.
  if (!bk._problemsAdded) {
    const ps = PROBLEMS[id];
    if (ps && ps.length) {
      bk.chapters.push({
        title: "Mixed practice",
        blocks: [
          { t:"p", x:"Longer problems that pull on the whole booklet rather than a single chapter. Work each one out on paper first — the steps are there when you want them." }
        ],
        exercises: ps
      });
    }
    bk._problemsAdded = true;
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
