/*
 * Workout & Calories — a plain-JS tool (no framework, no build step,
 * same spirit as the rest of this site). Two front/back body-map SVGs
 * built from a small set of hand-placed muscle regions (a stylized
 * diagram, not anatomy-textbook accurate), an exercise library tagged
 * with the muscles each one hits, a per-day workout log, and a per-day
 * calorie log. Everything persists to localStorage only.
 */

// ---------------------------------------------------------------
// muscle list + labels
// ---------------------------------------------------------------
const MUSCLE_LABELS = {
  chest: "Chest", "front-delts": "Front Delts", "rear-delts": "Rear Delts",
  biceps: "Biceps", triceps: "Triceps", forearms: "Forearms",
  abs: "Abs", obliques: "Obliques", traps: "Traps", lats: "Lats",
  "lower-back": "Lower Back", glutes: "Glutes", quads: "Quads",
  hamstrings: "Hamstrings", calves: "Calves",
};

// ---------------------------------------------------------------
// exercise library — primary muscles are what the map lights up bright,
// secondary muscles light up dim. Not exhaustive, just solid coverage of
// each muscle group across common equipment types.
// ---------------------------------------------------------------
const EXERCISES = [
  { id: "bench-press", name: "Barbell Bench Press", equipment: "barbell", primary: ["chest"], secondary: ["front-delts", "triceps"] },
  { id: "incline-db-press", name: "Incline Dumbbell Press", equipment: "dumbbell", primary: ["chest"], secondary: ["front-delts", "triceps"] },
  { id: "push-up", name: "Push-Up", equipment: "bodyweight", primary: ["chest"], secondary: ["front-delts", "triceps", "abs"] },
  { id: "cable-fly", name: "Cable Fly", equipment: "cable", primary: ["chest"], secondary: ["front-delts"] },
  { id: "dips", name: "Dips", equipment: "bodyweight", primary: ["triceps", "chest"], secondary: ["front-delts"] },
  { id: "overhead-press", name: "Overhead Press", equipment: "barbell", primary: ["front-delts"], secondary: ["triceps", "traps"] },
  { id: "db-shoulder-press", name: "Dumbbell Shoulder Press", equipment: "dumbbell", primary: ["front-delts"], secondary: ["triceps"] },
  { id: "lateral-raise", name: "Lateral Raise", equipment: "dumbbell", primary: ["front-delts"], secondary: [] },
  { id: "front-raise", name: "Front Raise", equipment: "dumbbell", primary: ["front-delts"], secondary: [] },
  { id: "rear-delt-fly", name: "Rear Delt Fly", equipment: "dumbbell", primary: ["rear-delts"], secondary: ["traps"] },
  { id: "face-pull", name: "Face Pull", equipment: "cable", primary: ["rear-delts"], secondary: ["traps"] },
  { id: "barbell-row", name: "Barbell Row", equipment: "barbell", primary: ["lats"], secondary: ["rear-delts", "biceps", "traps"] },
  { id: "pull-up", name: "Pull-Up", equipment: "bodyweight", primary: ["lats"], secondary: ["biceps", "rear-delts"] },
  { id: "lat-pulldown", name: "Lat Pulldown", equipment: "cable", primary: ["lats"], secondary: ["biceps"] },
  { id: "seated-cable-row", name: "Seated Cable Row", equipment: "cable", primary: ["lats"], secondary: ["rear-delts", "biceps", "traps"] },
  { id: "single-arm-db-row", name: "Single-Arm Dumbbell Row", equipment: "dumbbell", primary: ["lats"], secondary: ["biceps", "rear-delts"] },
  { id: "deadlift", name: "Deadlift", equipment: "barbell", primary: ["lower-back", "glutes", "hamstrings"], secondary: ["traps", "forearms"] },
  { id: "shrug", name: "Barbell Shrug", equipment: "barbell", primary: ["traps"], secondary: ["forearms"] },
  { id: "bicep-curl", name: "Dumbbell Bicep Curl", equipment: "dumbbell", primary: ["biceps"], secondary: ["forearms"] },
  { id: "hammer-curl", name: "Hammer Curl", equipment: "dumbbell", primary: ["biceps"], secondary: ["forearms"] },
  { id: "barbell-curl", name: "Barbell Curl", equipment: "barbell", primary: ["biceps"], secondary: ["forearms"] },
  { id: "cable-curl", name: "Cable Curl", equipment: "cable", primary: ["biceps"], secondary: ["forearms"] },
  { id: "tricep-pushdown", name: "Tricep Pushdown", equipment: "cable", primary: ["triceps"], secondary: [] },
  { id: "skullcrusher", name: "Skullcrusher", equipment: "barbell", primary: ["triceps"], secondary: [] },
  { id: "overhead-tricep-ext", name: "Overhead Tricep Extension", equipment: "dumbbell", primary: ["triceps"], secondary: [] },
  { id: "wrist-curl", name: "Wrist Curl", equipment: "dumbbell", primary: ["forearms"], secondary: [] },
  { id: "farmers-carry", name: "Farmer's Carry", equipment: "dumbbell", primary: ["forearms", "traps"], secondary: ["abs"] },
  { id: "crunch", name: "Crunch", equipment: "bodyweight", primary: ["abs"], secondary: [] },
  { id: "hanging-leg-raise", name: "Hanging Leg Raise", equipment: "bodyweight", primary: ["abs"], secondary: ["obliques"] },
  { id: "plank", name: "Plank", equipment: "bodyweight", primary: ["abs"], secondary: ["obliques", "lower-back"] },
  { id: "cable-crunch", name: "Cable Crunch", equipment: "cable", primary: ["abs"], secondary: [] },
  { id: "russian-twist", name: "Russian Twist", equipment: "bodyweight", primary: ["obliques"], secondary: ["abs"] },
  { id: "side-bend", name: "Dumbbell Side Bend", equipment: "dumbbell", primary: ["obliques"], secondary: [] },
  { id: "squat", name: "Barbell Squat", equipment: "barbell", primary: ["quads", "glutes"], secondary: ["hamstrings", "lower-back"] },
  { id: "goblet-squat", name: "Goblet Squat", equipment: "dumbbell", primary: ["quads", "glutes"], secondary: ["hamstrings"] },
  { id: "leg-press", name: "Leg Press", equipment: "machine", primary: ["quads"], secondary: ["glutes", "hamstrings"] },
  { id: "lunge", name: "Walking Lunge", equipment: "dumbbell", primary: ["quads", "glutes"], secondary: ["hamstrings"] },
  { id: "leg-extension", name: "Leg Extension", equipment: "machine", primary: ["quads"], secondary: [] },
  { id: "romanian-deadlift", name: "Romanian Deadlift", equipment: "barbell", primary: ["hamstrings", "glutes"], secondary: ["lower-back"] },
  { id: "leg-curl", name: "Leg Curl", equipment: "machine", primary: ["hamstrings"], secondary: [] },
  { id: "hip-thrust", name: "Hip Thrust", equipment: "barbell", primary: ["glutes"], secondary: ["hamstrings"] },
  { id: "glute-bridge", name: "Glute Bridge", equipment: "bodyweight", primary: ["glutes"], secondary: ["hamstrings"] },
  { id: "calf-raise", name: "Standing Calf Raise", equipment: "machine", primary: ["calves"], secondary: [] },
  { id: "seated-calf-raise", name: "Seated Calf Raise", equipment: "machine", primary: ["calves"], secondary: [] },
];
const EXERCISE_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
const EQUIPMENT_TYPES = Array.from(new Set(EXERCISES.map(e => e.equipment))).sort();

// ---------------------------------------------------------------
// body map geometry — a stylized-but-detailed figure (curved muscle
// "bellies" via SVG paths, several groups split into their real
// sub-heads), not a medical-textbook illustration, but a lot closer to
// one than plain rounded rectangles. Shared filler shapes (head/neck/
// torso/limb base silhouettes) sit behind everything so adjacent muscle
// shapes don't leave visible seams; DETAIL lines (collarbone, ab
// striations, spine, kneecaps) are non-interactive decoration drawn on
// top of the regions they cross.
// ---------------------------------------------------------------
const BODY_FILLER = [
  { type: "circle", cx: 100, cy: 22, r: 15 },
  { type: "rect", x: 91, y: 34, w: 18, h: 13, rx: 4 },
  { type: "path", d: "M68,48 C58,56 54,78 56,108 C58,136 64,150 74,152 L126,152 C136,150 142,136 144,108 C146,78 142,56 132,48 C120,42 80,42 68,48 Z" },
  { type: "rect", x: 74, y: 148, w: 52, h: 32, rx: 16 },
  { type: "path", d: "M32,62 C28,80 28,112 32,134 C34,150 38,168 42,180 L54,178 C52,158 50,138 50,118 C50,94 50,74 54,62 Z" },
  { type: "path", d: "M168,62 C172,80 172,112 168,134 C166,150 162,168 158,180 L146,178 C148,158 150,138 150,118 C150,94 150,74 146,62 Z" },
  { type: "rect", x: 27, y: 176, w: 19, h: 19, rx: 7 },
  { type: "rect", x: 154, y: 176, w: 19, h: 19, rx: 7 },
  { type: "path", d: "M66,174 C60,206 60,242 66,266 C68,292 70,320 74,338 L98,338 C96,306 94,274 94,244 C94,214 94,192 98,174 Z" },
  { type: "path", d: "M134,174 C140,206 140,242 134,266 C132,292 130,320 126,338 L102,338 C104,306 106,274 106,244 C106,214 106,192 102,174 Z" },
  { type: "rect", x: 67, y: 335, w: 25, h: 15, rx: 5 },
  { type: "rect", x: 108, y: 335, w: 25, h: 15, rx: 5 },
];

const FRONT_REGIONS = [
  { muscle: "front-delts", type: "ellipse", cx: 58, cy: 60, rx: 17, ry: 16 },
  { muscle: "front-delts", type: "ellipse", cx: 142, cy: 60, rx: 17, ry: 16 },
  { muscle: "chest", type: "path", d: "M100,54 C88,52 74,56 68,68 C65,78 68,86 78,88 C90,90 100,84 100,70 Z" },
  { muscle: "chest", type: "path", d: "M100,54 C112,52 126,56 132,68 C135,78 132,86 122,88 C110,90 100,84 100,70 Z" },
  { muscle: "abs", type: "rect", x: 84, y: 98, w: 32, h: 50, rx: 8 },
  { muscle: "obliques", type: "path", d: "M68,98 C62,110 62,134 68,148 L80,146 C76,130 76,112 80,100 Z" },
  { muscle: "obliques", type: "path", d: "M132,98 C138,110 138,134 132,148 L120,146 C124,130 124,112 120,100 Z" },
  { muscle: "biceps", type: "path", d: "M38,70 C34,80 34,96 38,110 C40,118 46,120 50,110 C52,96 52,80 48,70 C46,66 40,66 38,70 Z" },
  { muscle: "biceps", type: "path", d: "M162,70 C166,80 166,96 162,110 C160,118 154,120 150,110 C148,96 148,80 152,70 C154,66 160,66 162,70 Z" },
  { muscle: "forearms", type: "path", d: "M36,130 C34,144 34,160 38,178 C40,184 46,184 48,178 C50,160 50,144 48,130 Z" },
  { muscle: "forearms", type: "path", d: "M164,130 C166,144 166,160 162,178 C160,184 154,184 152,178 C150,160 150,144 152,130 Z" },
  { muscle: "quads", type: "path", d: "M66,178 C62,208 62,236 66,258 L80,256 C77,228 77,200 80,178 Z" },
  { muscle: "quads", type: "path", d: "M82,178 C80,208 80,236 84,258 C90,262 96,258 98,250 C99,220 97,196 96,178 Z" },
  { muscle: "quads", type: "path", d: "M134,178 C138,208 138,236 134,258 L120,256 C123,228 123,200 120,178 Z" },
  { muscle: "quads", type: "path", d: "M118,178 C120,208 120,236 116,258 C110,262 104,258 102,250 C101,220 103,196 104,178 Z" },
  { muscle: "calves", type: "path", d: "M70,266 C66,288 66,312 70,334 L92,334 C90,308 88,284 90,266 Z" },
  { muscle: "calves", type: "path", d: "M130,266 C134,288 134,312 130,334 L108,334 C110,308 112,284 110,266 Z" },
];
const FRONT_DETAIL = [
  { type: "path", d: "M74,50 Q100,44 126,50" },
  { type: "path", d: "M100,58 L100,86" },
  { type: "path", d: "M85,109 L115,109" },
  { type: "path", d: "M85,122 L115,122" },
  { type: "path", d: "M85,135 L115,135" },
  { type: "path", d: "M100,100 L100,148" },
  { type: "circle", cx: 82, cy: 259, r: 5 },
  { type: "circle", cx: 118, cy: 259, r: 5 },
];

const BACK_REGIONS = [
  { muscle: "rear-delts", type: "ellipse", cx: 58, cy: 60, rx: 17, ry: 16 },
  { muscle: "rear-delts", type: "ellipse", cx: 142, cy: 60, rx: 17, ry: 16 },
  { muscle: "traps", type: "path", d: "M84,38 C90,36 110,36 116,38 C126,50 134,66 136,80 C124,90 112,94 100,94 C88,94 76,90 64,80 C66,66 74,50 84,38 Z" },
  { muscle: "lats", type: "path", d: "M64,78 C58,96 58,120 64,144 C70,154 82,158 90,152 C88,128 86,102 88,80 C80,76 70,76 64,78 Z" },
  { muscle: "lats", type: "path", d: "M136,78 C142,96 142,120 136,144 C130,154 118,158 110,152 C112,128 114,102 112,80 C120,76 130,76 136,78 Z" },
  { muscle: "lower-back", type: "rect", x: 84, y: 148, w: 32, h: 30, rx: 8 },
  { muscle: "triceps", type: "path", d: "M38,70 C34,82 34,98 38,112 C40,120 46,122 50,112 C52,98 52,82 48,70 C46,66 40,66 38,70 Z" },
  { muscle: "triceps", type: "path", d: "M162,70 C166,82 166,98 162,112 C160,120 154,122 150,112 C148,98 148,82 152,70 C154,66 160,66 162,70 Z" },
  { muscle: "forearms", type: "path", d: "M36,130 C34,144 34,160 38,178 C40,184 46,184 48,178 C50,160 50,144 48,130 Z" },
  { muscle: "forearms", type: "path", d: "M164,130 C166,144 166,160 162,178 C160,184 154,184 152,178 C150,160 150,144 152,130 Z" },
  { muscle: "glutes", type: "path", d: "M68,178 C62,192 62,208 68,216 C76,222 88,220 92,210 C94,198 92,184 84,178 Z" },
  { muscle: "glutes", type: "path", d: "M132,178 C138,192 138,208 132,216 C124,222 112,220 108,210 C106,198 108,184 116,178 Z" },
  { muscle: "hamstrings", type: "path", d: "M66,214 C62,236 62,256 66,270 L78,268 C76,248 76,228 78,214 Z" },
  { muscle: "hamstrings", type: "path", d: "M80,214 C78,236 78,256 82,270 C88,274 94,270 96,262 C97,244 95,226 94,214 Z" },
  { muscle: "hamstrings", type: "path", d: "M134,214 C138,236 138,256 134,270 L122,268 C124,248 124,228 122,214 Z" },
  { muscle: "hamstrings", type: "path", d: "M120,214 C122,236 122,256 118,270 C112,274 106,270 104,262 C103,244 105,226 106,214 Z" },
  { muscle: "calves", type: "path", d: "M68,266 C64,280 64,296 68,308 C70,314 76,312 78,302 C80,286 78,274 74,266 Z" },
  { muscle: "calves", type: "path", d: "M78,266 C74,282 74,300 78,314 C82,322 90,320 92,308 C94,290 92,274 88,266 Z" },
  { muscle: "calves", type: "path", d: "M132,266 C136,280 136,296 132,308 C130,314 124,312 122,302 C120,286 122,274 126,266 Z" },
  { muscle: "calves", type: "path", d: "M122,266 C126,282 126,300 122,314 C118,322 110,320 108,308 C106,290 108,274 112,266 Z" },
];
const BACK_DETAIL = [
  { type: "path", d: "M100,40 L100,88" },
  { type: "path", d: "M100,150 L100,176" },
];

const SVGNS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}
function shapeToEl(shape, extraAttrs) {
  let el;
  if (shape.type === "circle") el = svgEl("circle", { cx: shape.cx, cy: shape.cy, r: shape.r });
  else if (shape.type === "ellipse") el = svgEl("ellipse", { cx: shape.cx, cy: shape.cy, rx: shape.rx, ry: shape.ry });
  else if (shape.type === "rect") el = svgEl("rect", { x: shape.x, y: shape.y, width: shape.w, height: shape.h, rx: shape.rx || 0 });
  else if (shape.type === "path") el = svgEl("path", { d: shape.d });
  Object.entries(extraAttrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function buildMap(svg, regions, details, onMuscleClick) {
  svg.innerHTML = "";
  BODY_FILLER.forEach(shape => svg.appendChild(shapeToEl(shape, { class: "body-outline", fill: "var(--panel-hi)", stroke: "none" })));
  regions.forEach(r => {
    const el = shapeToEl(r, { class: "muscle-shape", "data-muscle": r.muscle });
    el.addEventListener("click", () => onMuscleClick(r.muscle));
    svg.appendChild(el);
  });
  details.forEach(shape => svg.appendChild(shapeToEl(shape, { class: "muscle-detail" })));
}

// ---------------------------------------------------------------
// state + persistence
// ---------------------------------------------------------------
const WORKOUT_KEY = "workout-tracker:workouts:v1";
const FOOD_KEY = "workout-tracker:food:v1";
const GOAL_KEY = "workout-tracker:calgoal:v1";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}
function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private browsing etc -- just won't persist */ }
}

let workoutLog = loadJSON(WORKOUT_KEY, {}); // { 'YYYY-MM-DD': [{id, exerciseId, name, sets, reps, weight}] }
let foodLog = loadJSON(FOOD_KEY, {});       // { 'YYYY-MM-DD': [{id, name, cal}] }
let calorieGoal = loadJSON(GOAL_KEY, 2200);

let selectedDate = todayStr();
let muscleFilter = null;   // muscle id, filters the exercise list
let previewExercise = null; // exercise id, highlighted on the map

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function uid() { return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

// ---------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------
const dateInput = document.getElementById("dateInput");
const mapFront = document.getElementById("mapFront");
const mapBack = document.getElementById("mapBack");
const mapFilterRow = document.getElementById("mapFilterRow");
const mapHint = document.getElementById("mapHint");
const exerciseSearch = document.getElementById("exerciseSearch");
const equipmentFilter = document.getElementById("equipmentFilter");
const exerciseList = document.getElementById("exerciseList");
const libraryCount = document.getElementById("libraryCount");
const workoutList = document.getElementById("workoutList");
const workoutHeadRow = document.getElementById("workoutHeadRow");
const workoutSummary = document.getElementById("workoutSummary");
const foodList = document.getElementById("foodList");
const calConsumed = document.getElementById("calConsumed");
const calRemaining = document.getElementById("calRemaining");
const calRemainingLabel = document.getElementById("calRemainingLabel");
const calBarFill = document.getElementById("calBarFill");
const calGoalInput = document.getElementById("calGoal");
const calSummaryLabel = document.getElementById("calSummaryLabel");

// ---------------------------------------------------------------
// map rendering
// ---------------------------------------------------------------
function onMuscleClick(muscle) {
  previewExercise = null;
  muscleFilter = muscleFilter === muscle ? null : muscle;
  renderAll();
}
buildMap(mapFront, FRONT_REGIONS, FRONT_DETAIL, onMuscleClick);
buildMap(mapBack, BACK_REGIONS, BACK_DETAIL, onMuscleClick);

function renderMaps() {
  const allShapes = [...mapFront.querySelectorAll(".muscle-shape"), ...mapBack.querySelectorAll(".muscle-shape")];
  const exercise = previewExercise ? EXERCISE_BY_ID[previewExercise] : null;
  allShapes.forEach(el => {
    const m = el.dataset.muscle;
    el.classList.remove("is-primary", "is-secondary", "is-filtered");
    if (exercise) {
      if (exercise.primary.includes(m)) el.classList.add("is-primary");
      else if (exercise.secondary.includes(m)) el.classList.add("is-secondary");
    } else if (muscleFilter && m === muscleFilter) {
      el.classList.add("is-filtered");
    }
  });

  mapFilterRow.innerHTML = "";
  if (muscleFilter) {
    const chip = document.createElement("span");
    chip.className = "filter-chip";
    chip.innerHTML = "Showing exercises for <b>" + MUSCLE_LABELS[muscleFilter] + "</b> ";
    const clear = document.createElement("button");
    clear.type = "button";
    clear.textContent = "×";
    clear.setAttribute("aria-label", "Clear filter");
    clear.addEventListener("click", () => { muscleFilter = null; renderAll(); });
    chip.appendChild(clear);
    mapFilterRow.appendChild(chip);
    mapHint.hidden = true;
  } else if (exercise) {
    const chip = document.createElement("span");
    chip.className = "filter-chip";
    chip.innerHTML = "<b>" + exercise.name + "</b>";
    mapFilterRow.appendChild(chip);
    mapHint.hidden = true;
  } else {
    mapHint.hidden = false;
  }
}

// ---------------------------------------------------------------
// exercise library rendering
// ---------------------------------------------------------------
EQUIPMENT_TYPES.forEach(eq => {
  const opt = document.createElement("option");
  opt.value = eq;
  opt.textContent = eq[0].toUpperCase() + eq.slice(1);
  equipmentFilter.appendChild(opt);
});

function renderExerciseList() {
  const q = exerciseSearch.value.trim().toLowerCase();
  const eq = equipmentFilter.value;
  const filtered = EXERCISES.filter(e => {
    if (muscleFilter && !e.primary.includes(muscleFilter) && !e.secondary.includes(muscleFilter)) return false;
    if (eq && e.equipment !== eq) return false;
    if (q && !e.name.toLowerCase().includes(q)) return false;
    return true;
  });

  libraryCount.textContent = filtered.length + " of " + EXERCISES.length;
  exerciseList.innerHTML = "";
  if (filtered.length === 0) {
    exerciseList.innerHTML = '<div class="exercise-empty">No exercises match. Try clearing the muscle filter or search.</div>';
    return;
  }
  filtered.forEach(e => {
    const row = document.createElement("div");
    row.className = "exercise-row" + (previewExercise === e.id ? " is-active" : "");
    const tagText = [MUSCLE_LABELS[e.primary[0]]]
      .concat(e.primary.slice(1).map(m => MUSCLE_LABELS[m]))
      .join(", ") + (e.secondary.length ? " (+" + e.secondary.length + ")" : "");
    row.innerHTML =
      '<div class="exercise-info">' +
        '<div class="exercise-name"></div>' +
        '<div class="exercise-tags"><span class="eq"></span> &middot; </div>' +
      '</div>' +
      '<button type="button" class="add-btn" aria-label="Add to today\'s workout">+</button>';
    row.querySelector(".exercise-name").textContent = e.name;
    row.querySelector(".eq").textContent = e.equipment;
    row.querySelector(".exercise-tags").appendChild(document.createTextNode(tagText));
    row.addEventListener("click", (evt) => {
      if (evt.target.closest(".add-btn")) return;
      previewExercise = previewExercise === e.id ? null : e.id;
      muscleFilter = null;
      renderAll();
    });
    row.querySelector(".add-btn").addEventListener("click", () => addToWorkout(e));
    exerciseList.appendChild(row);
  });
}
exerciseSearch.addEventListener("input", renderExerciseList);
equipmentFilter.addEventListener("change", renderExerciseList);

// ---------------------------------------------------------------
// workout log
// ---------------------------------------------------------------
function addToWorkout(exercise) {
  const list = workoutLog[selectedDate] || (workoutLog[selectedDate] = []);
  list.push({ id: uid(), exerciseId: exercise.id, name: exercise.name, sets: "", reps: "", weight: "" });
  saveJSON(WORKOUT_KEY, workoutLog);
  renderWorkout();
}
function renderWorkout() {
  const list = workoutLog[selectedDate] || [];
  workoutHeadRow.hidden = list.length === 0;
  workoutList.innerHTML = "";
  if (list.length === 0) {
    workoutList.innerHTML = '<div class="entry-empty">Nothing added yet — click &ldquo;+&rdquo; on an exercise above.</div>';
  } else {
    list.forEach(entry => {
      const row = document.createElement("div");
      row.className = "workout-entry";
      row.innerHTML =
        '<div class="we-name"></div>' +
        '<input type="number" min="0" step="1" placeholder="—" class="we-sets">' +
        '<input type="number" min="0" step="1" placeholder="—" class="we-reps">' +
        '<input type="number" min="0" step="0.5" placeholder="—" class="we-weight">' +
        '<button type="button" class="we-remove" aria-label="Remove">&times;</button>';
      row.querySelector(".we-name").textContent = entry.name;
      const sets = row.querySelector(".we-sets");
      const reps = row.querySelector(".we-reps");
      const weight = row.querySelector(".we-weight");
      sets.value = entry.sets; reps.value = entry.reps; weight.value = entry.weight;
      sets.addEventListener("input", () => { entry.sets = sets.value; saveJSON(WORKOUT_KEY, workoutLog); });
      reps.addEventListener("input", () => { entry.reps = reps.value; saveJSON(WORKOUT_KEY, workoutLog); });
      weight.addEventListener("input", () => { entry.weight = weight.value; saveJSON(WORKOUT_KEY, workoutLog); });
      row.querySelector(".we-remove").addEventListener("click", () => {
        workoutLog[selectedDate] = (workoutLog[selectedDate] || []).filter(x => x.id !== entry.id);
        saveJSON(WORKOUT_KEY, workoutLog);
        renderWorkout();
      });
      workoutList.appendChild(row);
    });
  }
  workoutSummary.textContent = list.length + " exercise" + (list.length === 1 ? "" : "s");
}
document.getElementById("clearWorkout").addEventListener("click", () => {
  if (!(workoutLog[selectedDate] || []).length) return;
  if (!confirm("Clear all exercises logged for this day?")) return;
  delete workoutLog[selectedDate];
  saveJSON(WORKOUT_KEY, workoutLog);
  renderWorkout();
});

// ---------------------------------------------------------------
// calorie log
// ---------------------------------------------------------------
function addFood() {
  const nameEl = document.getElementById("foodName");
  const calEl = document.getElementById("foodCal");
  const name = nameEl.value.trim();
  const cal = parseFloat(calEl.value);
  if (!name || !Number.isFinite(cal) || cal < 0) return;
  const list = foodLog[selectedDate] || (foodLog[selectedDate] = []);
  list.push({ id: uid(), name, cal });
  saveJSON(FOOD_KEY, foodLog);
  nameEl.value = ""; calEl.value = "";
  nameEl.focus();
  renderCalories();
}
document.getElementById("foodAdd").addEventListener("click", addFood);
document.getElementById("foodCal").addEventListener("keydown", e => { if (e.key === "Enter") addFood(); });
document.getElementById("foodName").addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("foodCal").focus(); });

function renderCalories() {
  const list = foodLog[selectedDate] || [];
  foodList.innerHTML = "";
  if (list.length === 0) {
    foodList.innerHTML = '<div class="entry-empty">Nothing logged yet.</div>';
  } else {
    list.forEach(entry => {
      const row = document.createElement("div");
      row.className = "food-entry";
      row.innerHTML =
        '<div class="fe-name"></div>' +
        '<div class="fe-cal"></div>' +
        '<button type="button" class="fe-remove" aria-label="Remove">&times;</button>';
      row.querySelector(".fe-name").textContent = entry.name;
      row.querySelector(".fe-cal").textContent = Math.round(entry.cal) + " kcal";
      row.querySelector(".fe-remove").addEventListener("click", () => {
        foodLog[selectedDate] = (foodLog[selectedDate] || []).filter(x => x.id !== entry.id);
        saveJSON(FOOD_KEY, foodLog);
        renderCalories();
      });
      foodList.appendChild(row);
    });
  }

  const consumed = list.reduce((s, e) => s + e.cal, 0);
  const remaining = calorieGoal - consumed;
  calConsumed.textContent = Math.round(consumed).toLocaleString();
  calSummaryLabel.textContent = list.length + " item" + (list.length === 1 ? "" : "s");

  const pct = calorieGoal > 0 ? Math.min(100, (consumed / calorieGoal) * 100) : 0;
  calBarFill.style.width = pct + "%";
  calBarFill.classList.toggle("over", consumed > calorieGoal);

  if (remaining < 0) {
    calRemainingLabel.textContent = "Over by";
    calRemaining.textContent = Math.round(Math.abs(remaining)).toLocaleString();
    calRemaining.className = "value over";
  } else {
    calRemainingLabel.textContent = "Remaining";
    calRemaining.textContent = Math.round(remaining).toLocaleString();
    calRemaining.className = "value under";
  }
}
document.getElementById("clearFood").addEventListener("click", () => {
  if (!(foodLog[selectedDate] || []).length) return;
  if (!confirm("Clear all food logged for this day?")) return;
  delete foodLog[selectedDate];
  saveJSON(FOOD_KEY, foodLog);
  renderCalories();
});
calGoalInput.addEventListener("input", () => {
  const v = parseFloat(calGoalInput.value);
  calorieGoal = Number.isFinite(v) && v >= 0 ? v : 0;
  saveJSON(GOAL_KEY, calorieGoal);
  renderCalories();
});

// ---------------------------------------------------------------
// date navigation
// ---------------------------------------------------------------
function setDate(str) {
  selectedDate = str;
  dateInput.value = str;
  renderWorkout();
  renderCalories();
}
function shiftDate(days) {
  const [y, m, d] = selectedDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  setDate(dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0"));
}
dateInput.addEventListener("change", () => setDate(dateInput.value || todayStr()));
document.getElementById("datePrev").addEventListener("click", () => shiftDate(-1));
document.getElementById("dateNext").addEventListener("click", () => shiftDate(1));
document.getElementById("dateToday").addEventListener("click", () => setDate(todayStr()));

// ---------------------------------------------------------------
// init
// ---------------------------------------------------------------
function renderAll() {
  renderMaps();
  renderExerciseList();
}
dateInput.value = selectedDate;
calGoalInput.value = calorieGoal;
renderAll();
renderWorkout();
renderCalories();
