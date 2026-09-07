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
// body map geometry — a stylized figure, not anatomically precise.
// Shared filler shapes (head/neck/waist/feet) give it a recognizable
// silhouette; the muscle regions are the interactive pieces.
// ---------------------------------------------------------------
const BODY_FILLER = [
  { type: "circle", cx: 100, cy: 24, r: 16 },
  { type: "rect", x: 92, y: 38, w: 16, h: 14, rx: 3 },
  { type: "rect", x: 76, y: 146, w: 48, h: 32, rx: 10 },
  { type: "rect", x: 73, y: 334, w: 22, h: 15, rx: 5 },
  { type: "rect", x: 105, y: 334, w: 22, h: 15, rx: 5 },
];
const FRONT_REGIONS = [
  { muscle: "front-delts", type: "ellipse", cx: 60, cy: 64, rx: 16, ry: 14 },
  { muscle: "front-delts", type: "ellipse", cx: 140, cy: 64, rx: 16, ry: 14 },
  { muscle: "chest", type: "rect", x: 72, y: 54, w: 56, h: 40, rx: 10 },
  { muscle: "abs", type: "rect", x: 82, y: 98, w: 36, h: 50, rx: 6 },
  { muscle: "obliques", type: "rect", x: 66, y: 98, w: 14, h: 50, rx: 5 },
  { muscle: "obliques", type: "rect", x: 120, y: 98, w: 14, h: 50, rx: 5 },
  { muscle: "biceps", type: "rect", x: 36, y: 68, w: 18, h: 58, rx: 8 },
  { muscle: "biceps", type: "rect", x: 146, y: 68, w: 18, h: 58, rx: 8 },
  { muscle: "forearms", type: "rect", x: 34, y: 128, w: 17, h: 52, rx: 7 },
  { muscle: "forearms", type: "rect", x: 149, y: 128, w: 17, h: 52, rx: 7 },
  { muscle: "quads", type: "rect", x: 70, y: 176, w: 27, h: 85, rx: 10 },
  { muscle: "quads", type: "rect", x: 103, y: 176, w: 27, h: 85, rx: 10 },
  { muscle: "calves", type: "rect", x: 72, y: 266, w: 23, h: 70, rx: 9 },
  { muscle: "calves", type: "rect", x: 105, y: 266, w: 23, h: 70, rx: 9 },
];
const BACK_REGIONS = [
  { muscle: "rear-delts", type: "ellipse", cx: 60, cy: 64, rx: 16, ry: 14 },
  { muscle: "rear-delts", type: "ellipse", cx: 140, cy: 64, rx: 16, ry: 14 },
  { muscle: "traps", type: "path", d: "M84,38 L116,38 L136,78 L100,92 L64,78 Z" },
  { muscle: "lats", type: "path", d: "M66,80 L92,92 L86,150 L62,140 Z" },
  { muscle: "lats", type: "path", d: "M134,80 L108,92 L114,150 L138,140 Z" },
  { muscle: "lower-back", type: "rect", x: 84, y: 148, w: 32, h: 32, rx: 6 },
  { muscle: "triceps", type: "rect", x: 36, y: 68, w: 18, h: 58, rx: 8 },
  { muscle: "triceps", type: "rect", x: 146, y: 68, w: 18, h: 58, rx: 8 },
  { muscle: "forearms", type: "rect", x: 34, y: 128, w: 17, h: 52, rx: 7 },
  { muscle: "forearms", type: "rect", x: 149, y: 128, w: 17, h: 52, rx: 7 },
  { muscle: "glutes", type: "rect", x: 70, y: 176, w: 27, h: 36, rx: 10 },
  { muscle: "glutes", type: "rect", x: 103, y: 176, w: 27, h: 36, rx: 10 },
  { muscle: "hamstrings", type: "rect", x: 70, y: 214, w: 27, h: 52, rx: 9 },
  { muscle: "hamstrings", type: "rect", x: 103, y: 214, w: 27, h: 52, rx: 9 },
  { muscle: "calves", type: "rect", x: 72, y: 266, w: 23, h: 70, rx: 9 },
  { muscle: "calves", type: "rect", x: 105, y: 266, w: 23, h: 70, rx: 9 },
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

function buildMap(svg, regions, onMuscleClick) {
  svg.innerHTML = "";
  BODY_FILLER.forEach(shape => svg.appendChild(shapeToEl(shape, { class: "body-outline", fill: "var(--panel-hi)", stroke: "none" })));
  regions.forEach(r => {
    const el = shapeToEl(r, { class: "muscle-shape", "data-muscle": r.muscle });
    el.addEventListener("click", () => onMuscleClick(r.muscle));
    svg.appendChild(el);
  });
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
buildMap(mapFront, FRONT_REGIONS, onMuscleClick);
buildMap(mapBack, BACK_REGIONS, onMuscleClick);

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
