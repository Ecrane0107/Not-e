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
// body map geometry — real anatomical polygon data (viewBox 0 0 1000
// 2000), not hand-drawn shapes. Adapted from the MIT-licensed
// react-body-highlighter project (github.com/giavinh79/react-body-
// highlighter, © 2020 GV79): each muscle group is one or more <polygon>
// pieces that tile edge-to-edge to form the whole figure, so there's no
// separate body silhouette underneath -- the regions ARE the body.
// FRONT_FILLER/BACK_FILLER hold the head/neck/kneecap polygons, which
// exist to fill in the figure but aren't tied to a trackable muscle so
// they're drawn non-interactive. Original polygon muscle names are
// remapped to this tool's 15-muscle vocabulary (a few originals with no
// equivalent here -- outer-thigh "abductors", inner-thigh "adductor",
// calf "soleus" -- are folded into the nearest tracked muscle).
// ---------------------------------------------------------------
const FRONT_FILLER = [
  "424 29 400 118 420 196 461 233 498 253 547 224 576 192 592 102 571 24 498 0", // head
  "555 237 506 335 506 392 616 400 706 449 694 367 633 351 584 306", // neck (r)
  "290 449 302 371 363 351 412 302 445 245 490 339 486 392 380 396", // neck (l)
  "339 1400 347 1433 355 1473 363 1510 351 1567 298 1567 273 1527 273 1473 302 1441", // knee (l)
  "657 1400 722 1478 722 1522 698 1571 649 1567 629 1510", // knee (r)
].map(points => ({ type: "polygon", points }));

const FRONT_REGIONS = [
  { muscle: "chest", points: "518 416 510 551 580 580 678 555 706 473 620 416" },
  { muscle: "chest", points: "298 465 314 555 408 580 482 551 478 420 376 420" },
  { muscle: "obliques", points: "686 633 673 571 588 596 600 641 604 833 657 788 665 698" },
  { muscle: "obliques", points: "339 784 331 718 310 633 322 571 408 592 392 633 392 837" },
  { muscle: "abs", points: "563 592 580 641 584 780 584 927 563 984 551 1041 514 1078 510 845 506 673 510 571" },
  { muscle: "abs", points: "437 588 486 571 490 673 486 845 482 1073 445 1037 408 914 408 784 412 645" },
  { muscle: "biceps", points: "167 682 180 714 229 661 290 539 278 494 204 559" },
  { muscle: "biceps", points: "714 494 702 547 763 661 816 718 829 690 788 555" },
  { muscle: "triceps", points: "694 555 694 616 759 727 776 702 755 673" },
  { muscle: "triceps", points: "224 694 298 555 298 608 229 731" },
  { muscle: "front-delts", points: "784 531 796 478 792 412 759 380 710 363 722 429 714 473" },
  { muscle: "front-delts", points: "282 473 212 531 200 478 204 408 245 371 286 371 269 433" },
  { muscle: "quads", points: "527 1102 543 1249 600 1102 620 1000 649 943 600 927 567 1045" }, // outer thigh
  { muscle: "quads", points: "478 1106 449 1253 420 1159 404 1131 396 1073 380 1024 347 939 396 922 416 992 437 1053" },
  { muscle: "quads", points: "347 988 371 1082 371 1278 343 1371 310 1327 294 1200 282 1114 294 1008 322 947" },
  { muscle: "quads", points: "633 1057 645 1000 669 947 702 1012 710 1118 682 1331 653 1376 624 1286 620 1114" },
  { muscle: "quads", points: "388 1294 384 1122 412 1184 445 1294 429 1351 400 1461 363 1465 355 1400" },
  { muscle: "quads", points: "596 1457 555 1290 608 1139 612 1302 641 1396 629 1465" },
  { muscle: "quads", points: "327 1384 265 1457 257 1367 257 1273 269 1143 294 1335" },
  { muscle: "quads", points: "718 1131 739 1241 739 1404 727 1457 665 1384 702 1335" },
  { muscle: "calves", points: "714 1604 735 1535 767 1612 796 1678 784 1878 796 1955 747 1955" },
  { muscle: "calves", points: "249 1947 278 1649 282 1604 261 1543 249 1576 224 1616 208 1678 220 1882 208 1955" },
  { muscle: "calves", points: "727 1951 698 1592 653 1584 641 1624 641 1653 657 1771" },
  { muscle: "calves", points: "355 1584 359 1624 359 1669 351 1722 351 1767 322 1820 306 1873 269 1947 273 1878 282 1804 286 1755 290 1698 298 1641 302 1588" },
  { muscle: "forearms", points: "61 886 102 751 147 702 163 743 192 735 45 976 0 1000" },
  { muscle: "forearms", points: "845 698 833 735 800 731 951 984 1000 1004 935 894 898 763" },
  { muscle: "forearms", points: "776 722 776 776 804 841 853 898 922 1012 947 996" },
  { muscle: "forearms", points: "69 1012 135 906 188 841 216 771 212 718 49 988" },
];

const BACK_FILLER = [
  "506 0 460 9 409 55 404 128 451 200 557 200 591 136 596 47 557 13", // head
  "345 1532 311 1591 336 1664 374 1626", // knee (l)
  "664 1536 630 1630 668 1664 694 1591", // knee (r)
].map(points => ({ type: "polygon", points }));

const BACK_REGIONS = [
  { muscle: "traps", points: "447 217 477 217 472 383 477 647 383 532 353 409 311 366 391 332 438 272" },
  { muscle: "traps", points: "523 217 557 217 566 272 609 328 689 366 647 404 617 532 523 647 532 383" },
  { muscle: "rear-delts", points: "294 370 230 391 174 443 183 536 243 494 272 464" },
  { muscle: "rear-delts", points: "711 370 783 396 826 447 817 536 749 489 723 451" },
  { muscle: "lats", points: "311 387 281 489 285 553 340 753 472 711 472 664 366 540 336 413" },
  { muscle: "lats", points: "689 387 719 494 715 562 660 753 528 711 528 664 634 545 664 417" },
  { muscle: "triceps", points: "268 498 179 557 145 723 166 817 217 638 268 557" },
  { muscle: "triceps", points: "736 502 821 557 860 732 834 821 779 630 732 557" },
  { muscle: "triceps", points: "268 583 268 685 230 753 191 774 226 655" },
  { muscle: "triceps", points: "728 583 770 647 804 774 766 753 728 689" },
  { muscle: "lower-back", points: "477 728 345 770 353 834 494 1021 468 830" },
  { muscle: "lower-back", points: "523 728 655 770 647 834 506 1021 532 838" },
  { muscle: "forearms", points: "864 757 911 834 932 940 1000 1064 962 1043 881 894 843 838" },
  { muscle: "forearms", points: "136 757 89 838 68 936 0 1064 38 1043 123 885 157 830" },
  { muscle: "forearms", points: "813 796 774 779 791 847 911 1038 932 1089 945 1047" },
  { muscle: "forearms", points: "187 796 221 779 209 843 94 1030 68 1085 51 1047" },
  { muscle: "glutes", points: "447 996 302 1085 298 1187 315 1260 472 1213 494 1149" },
  { muscle: "glutes", points: "553 991 511 1145 523 1209 681 1260 698 1191 694 1085" },
  { muscle: "hamstrings", points: "481 1230 447 1230 413 1255 451 1443 485 1357 489 1294" }, // inner thigh (adductor)
  { muscle: "hamstrings", points: "519 1226 557 1234 591 1260 549 1443 519 1362 511 1294" },
  { muscle: "hamstrings", points: "289 1221 311 1294 366 1260 353 1353 345 1502 294 1583 289 1468 277 1413 272 1315" },
  { muscle: "hamstrings", points: "715 1217 694 1289 638 1260 655 1366 664 1502 711 1583 715 1477 728 1421 736 1319" },
  { muscle: "hamstrings", points: "387 1255 443 1460 404 1668 362 1528 370 1353" },
  { muscle: "hamstrings", points: "617 1255 634 1362 643 1532 600 1668 562 1464" },
  { muscle: "calves", points: "294 1604 285 1672 247 1796 238 1928 255 1970 285 1932 298 1800 319 1711 319 1668" },
  { muscle: "calves", points: "374 1651 353 1677 332 1719 311 1804 302 1919 340 2000 387 1906 391 1689" },
  { muscle: "calves", points: "630 1651 613 1685 617 1906 664 1996 706 1919 689 1796 668 1702" },
  { muscle: "calves", points: "706 1604 723 1685 757 1791 766 1928 745 1966 723 1936 706 1796 681 1681" },
  { muscle: "calves", points: "285 1957 302 1957 336 2017 306 2200 285 2136 268 1983" }, // soleus (l)
  { muscle: "calves", points: "698 1957 719 1957 736 1983 719 2132 702 2196 672 2021" }, // soleus (r)
];

const SVGNS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}
function shapeToEl(shape, extraAttrs) {
  const el = svgEl("polygon", { points: shape.points });
  Object.entries(extraAttrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function buildMap(svg, filler, regions, onMuscleClick) {
  svg.innerHTML = "";
  filler.forEach(shape => svg.appendChild(shapeToEl(shape, { class: "muscle-filler" })));
  regions.forEach(r => {
    const el = shapeToEl(r, { class: "muscle-shape", "data-muscle": r.muscle });
    // native <title> gives a hover tooltip with the muscle's name for
    // free, in every browser, with no extra positioning/tracking code
    const title = svgEl("title", {});
    title.textContent = MUSCLE_LABELS[r.muscle] || r.muscle;
    el.appendChild(title);
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
buildMap(mapFront, FRONT_FILLER, FRONT_REGIONS, onMuscleClick);
buildMap(mapBack, BACK_FILLER, BACK_REGIONS, onMuscleClick);

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
