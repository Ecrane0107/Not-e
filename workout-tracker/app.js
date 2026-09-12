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
// body map geometry — a detailed anatomical chart, not a few blobs.
// 89 individually-named regions per figure (both views share one
// coordinate space: front is viewBox "0 0 35 93", back is "37 0 35 93").
// Adapted from the Apache-2.0 licensed body-muscles project
// (github.com/vulovix/body-muscles, © Viktor Vulovic).
//
// Each entry is one <path>. Entries WITH a `muscle` key are interactive
// and map onto this tool's 15 trackable groups -- several distinct
// anatomical regions share one group, so e.g. "quads" lights up the
// quadriceps, adductors and hip flexors together, and "calves" lights
// both gastrocnemius heads plus the soleus and tibialis anterior. The
// `name` is the specific muscle, shown on hover. Entries WITHOUT a
// `muscle` key (head, face, neck, hands, feet, knees, elbows, spine)
// fill the figure out but aren't tracked, so they're non-interactive.
// ---------------------------------------------------------------
const FRONT_PARTS = [
  { d: "m 11.671635,6.3585449 -0.0482,-2.59085 4.20648,-2.46806 4.42769,2.95361 -0.0405,1.94408 0.24197,-3.34467 -2.03129,-2.31103004 -2.84508,-0.51629 -2.20423,0.52915 -1.9363,2.63077004 z" },
  { d: "m 19.748825,6.7034949 0.0203,-2.20747 -3.96689,-2.7637 -3.74099,2.23559 -0.006,2.63528 -0.60741,0.0403 0.27408,1.82447 0.97635,0.33932 0.44244,2.1802901 1.82222,2.06556 2.03518,-0.0607 1.79223,-1.94408 0.35957,-2.2406601 0.97616,-0.33932 0.25159,-1.78416 z" },
  { d: "m 13.304665,11.910505 1.64975,2.35202 0.74426,2.62159 -1.73486,-1.38354 -0.86649,-2.97104 z" },
  { d: "m 18.385135,11.910505 -1.64975,2.35202 -0.74538,2.62234 1.73486,-1.38354 0.86649,-2.97104 z" },
  { muscle: "front-delts", d: "m 19.047795,13.248365 3.55748,1.97916 0.72653,-0.35074 z m -0.107,0.43288 -0.37119,1.73073 2.1846,0.53561 1.40116,-0.49436 z", name: "Deltoid, anterior head" },
  { muscle: "front-delts", d: "m 22.922305,15.657195 0.75814,-0.41 2.40806,1.66799 1.17364,1.50707 0.62662,1.5626 -0.0464,3.70194 -1.3284,-1.72153 0.0407,-2.59376 -0.48842,-0.50049 c 0,0 -3.09778,-3.19058 -3.14371,-3.21401 z m -0.2409,0.10873 c -0.001,0.0525 3.32987,3.54733 3.32987,3.54733 l 0.10067,3.10396 -1.15426,-1.97782 -2.22547,-0.94804 -1.56576,-2.88481 z", name: "Deltoid, lateral head" },
  { muscle: "front-delts", d: "m 12.624785,13.248365 -3.5574599,1.97916 -0.72653,-0.35074 z m 0.107,0.43288 0.37119,1.73073 -2.18459,0.53561 -1.4011499,-0.49436 z", name: "Deltoid, anterior head" },
  { muscle: "front-delts", d: "m 8.7502951,15.657195 -0.75814,-0.41 -2.40806,1.66799 -1.17364,1.50707 -0.62662,1.56259 0.0464,3.70195 1.3284,-1.72153 -0.0407,-2.59376 0.48843,-0.5005 c 0,0 3.09777,-3.19057 3.1437,-3.214 z m 0.2409,0.10873 c 0.002,0.0525 -3.32987,3.54733 -3.32987,3.54733 l -0.10067,3.10396 1.15426,-1.97782 2.22547,-0.94804 1.5657499,-2.88481 z", name: "Deltoid, lateral head" },
  { muscle: "biceps", d: "m 27.621665,30.814715 -0.33838,1.70499 -1.81932,-2.54418 -0.6629,-1.26895 z m -2.85271,-2.6096 c -0.0259,-0.0144 -0.0536,-0.0254 -0.0824,-0.0324 l -1.48333,-4.95503 1.00456,-2.08428 1.65511,1.74532 2.23034,6.67667 0.0415,0.93739 c -1.06528,-0.84215 -2.18962,-1.60679 -3.36434,-2.28803 z m 1.6945,-5.75654 1.64893,6.43421 -0.36469,-4.92266 z", name: "Biceps brachii" },
  { muscle: "forearms", d: "m 26.955425,32.969125 1.30083,10.28927 -1.10778,0.01 -1.89387,-7.99609 0.19174,-4.53719 z m 1.21978,-1.94971 -0.58729,2.58635 1.11876,9.15614 0.55849,-0.21663 0.2304,-6.77018 z", name: "Forearm flexors" },
  { muscle: "biceps", d: "m 4.0746451,30.814715 0.33838,1.70499 1.81931,-2.54418 0.66289,-1.26895 z m 2.8527,-2.6096 c 0.0259,-0.0144 0.0536,-0.0254 0.0824,-0.0324 l 1.48332,-4.95503 -1.00455,-2.08428 -1.65509,1.74532 -2.23034,6.67667 -0.0415,0.93739 c 1.06528,-0.84215 2.18961,-1.60679 3.36433,-2.28803 z m -1.6945,-5.75654 -1.64891,6.43421 0.36468,-4.92266 z", name: "Biceps brachii" },
  { muscle: "forearms", d: "m 4.5752651,32.969125 -1.30083,10.28927 1.10778,0.01 1.89387,-7.99609 -0.19174,-4.53719 z m -1.21978,-1.94971 0.58728,2.58635 -1.11875,9.15614 -0.55849,-0.21663 -0.2304,-6.77018 z", name: "Forearm flexors" },
  { muscle: "chest", d: "m 20.337455,17.085495 1.72942,3.09103 1.890,0.94 -0.5,0.3 -6.8, -2.1 z", name: "Pectoralis major, clavicular head" },
  { muscle: "chest", d: "m 16.66,19.72 6.8,2.1 -0.65,0.5 -0.90604,2.63773 -2.09968,0.86537 -3.34524,-1.655 0.2,-3.8 z", name: "Pectoralis major, sternal head" },
  { muscle: "chest", d: "m 11.351215,17.085495 -1.7294199,3.09103 -1.890,0.94 0.5,0.3 6.8,-2.1 z", name: "Pectoralis major, clavicular head" },
  { muscle: "chest", d: "m 15.03,19.72 -6.8,2.1 0.65,0.5 0.90586,2.63773 2.0996699,0.86537 3.34636,-1.655 -0.2,-3.8 z", name: "Pectoralis major, sternal head" },
  { muscle: "abs", d: "m 19.641935,34.707615 1.81341,-1.36479 0.15748,1.83347 1.28642,2.37338 -1.98044,2.73652 -1.03109,0.16554 -0.37026,-3.88816 z", name: "Rectus abdominis, upper" },
  { muscle: "obliques", d: "M 19.289,26.152 l -3.11202 -1.40604 0.0937 2.27965 2.80119 1.43603 z M 21.224,27.820 l -1.29355 0.7212 0.14997 -1.70898 z M 20.171,26.183 l 2.47968 -1.03241 -0.9336 2.52093 z M 21.702,27.921 l -1.69005 1.03372 -0.28871 2.0678 1.64975 -1.07533 z", name: "Serratus anterior" },
  { muscle: "obliques", d: "M 18.791,29.025 l -0.0622 1.62387 -2.30308 -0.49961 -0.12448 -2.21722 z M 18.635,31.429 l 0.0311 1.99844 -2.20953 0.59391 -0.0311 -3.1227 z M 21.290,30.444 l -1.48383 1.03372 -0.20622 2.10905 1.64862 -1.32355 z", name: "External oblique" },
  { muscle: "abs", d: "m 12.045985,34.707615 -1.81341,-1.36479 -0.15748,1.83347 -1.2856799,2.37432 1.9804499,2.73595 1.03109,0.16554 0.37119,-3.88721 z", name: "Rectus abdominis, upper" },
  { muscle: "abs", d: "m 15.636055,44.919735 -0.60647,-5.91209 -0.015,-3.84879 -2.18479,-1.07533 -0.24746,7.03017 z", name: "Rectus abdominis, lower" },
  { muscle: "abs", d: "m 16.051865,44.919165 0.60628,-5.91209 0.0154,-3.84915 2.18404,-1.07515 0.24746,7.03017 z", name: "Rectus abdominis, lower" },
  { muscle: "obliques", d: "m 12.399365,26.152365 3.11202,-1.40603 -0.0937,2.27965 -2.80138,1.4364 z m -1.93508,1.6685 1.29355,0.72139 -0.14997,-1.70899 z m 1.05303,-1.637 -2.4793099,-1.03259 0.93361,2.52148 z m -1.5316399,1.73729 1.6900499,1.03372 0.28871,2.06743 -1.64881,-1.07515 z", name: "Serratus anterior" },
  { muscle: "obliques", d: "M 12.897,29.025 l 0.0623 1.62387 2.30327 -0.49961 0.12448 -2.21703 z M 13.053,31.430 l -0.0309 1.99844 2.20973 0.59353 0.0311 -3.1227 z M 10.398,30.445 l 1.48384 1.0339 0.20622 2.10905 -1.64975 -1.32355 z", name: "External oblique" },
  { muscle: "quads", d: "m 14.404465,45.040075 0.0221,-0.0277 -0.14866,-0.37945 -3.10172,-3.40449 -0.23283,-0.0825 2.05918,5.32009 z m -1.17263,2.01833 1.27705,3.29948 0.42631,-4.04862 -0.25196,-0.64303 z", name: "Hip flexors (iliopsoas)" },
  { muscle: "quads", d: "m 17.284025,45.040455 -0.0221,-0.0281 0.14867,-0.37926 3.10171,-3.40449 0.23246,-0.0825 -2.05843,5.3199 z m 1.17263,2.01795 -1.27706,3.29948 -0.42631,-4.04843 0.25197,-0.64303 z", name: "Hip flexors (iliopsoas)" },
  { muscle: "quads", d: "m 23.419015,50.399125 -0.15504,4.75091 -2.40263,6.60949 0.7362,1.90021 2.36401,-8.34435 z m -0.58154,-11.60825 -0.15485,4.00722 1.31793,7.93154 0.61977,-6.40308 z m -0.38731,5.12268 -2.75152,6.07258 -0.62015,4.87425 1.16232,6.85771 2.51886,-6.98144 0.15504,-7.18764 z", name: "Quadriceps femoris" },
  { muscle: "quads", d: "m 22.063225,39.369605 v 4.21363 l -2.94574,5.82511 -1.86027,5.78349 0.19365,-4.0072 z m -3.24944,13.42596 -0.0649,0.15467 -1.21294,2.90207 0.78325,7.18803 1.23619,-0.66122 -1.0714,-6.69272 z", name: "Adductor group" },
  { d: "m 17.255895,87.868445 0.1243,3.45228 0.28983,1.20638 h 0.87136 l 0.24897,-0.83181 0.29058,-0.0416 -0.0624,0.83181 1.09914,-0.33332 0.29058,-0.16629 1.24444,-0.27033 0.0416,-0.97748 -1.20319,-2.03743 -0.82974,-1.0399 -2.03294,-0.83181 z" },
  { muscle: "calves", d: "m 18.251375,70.441125 0.29058,0.91486 0.6224,3.8681 0.0829,5.15733 -0.87136,5.03304 0.0412,-6.44714 -0.91242,-2.57848 -0.12561,-2.82837 z m 1.9915,2.32915 -0.20753,7.73637 -1.65949,6.23904 1.80478,-0.853 3.00816,-10.83583 -1.03727,-6.82095 z", name: "Tibialis anterior" },
  { d: "m 21.404635,64.784375 0.1243,1.12295 -0.87118,1.08171 -0.29058,1.70599 -0.58116,0.24933 -0.49774,-2.57866 -0.33182,-0.91486 0.29058,-0.58247 z m -3.85853,0.0832 0.6224,1.74685 1.3273,2.57867 -0.33182,2.37095 -0.95423,-2.66209 -0.78738,-1.49734 z m 4.97811,-2.37039 -0.95423,5.11609 0.62241,-0.33295 0.49773,1.66381 z" },
  { muscle: "quads", d: "m 8.2694651,50.399125 0.15504,4.75053 2.4026299,6.60968 -0.73638,1.90021 -2.3640099,-8.34435 z m 0.58117,-11.60768 0.15503,4.00684 -1.31754,7.93154 -0.61978,-6.40308 z m 0.38769,5.1223 2.7515099,6.07239 0.61997,4.87425 -1.16232,6.85771 -2.5190499,-6.98163 -0.15504,-7.18801 z", name: "Quadriceps femoris" },
  { muscle: "quads", d: "m 9.6258251,39.369415 v 4.21363 l 2.9451699,5.8253 1.86028,5.78349 -0.19366,-4.0072 z m 3.2488699,13.42559 0.0647,0.15485 1.21294,2.90207 -0.78307,7.18803 -1.23618,-0.66102 1.0714,-6.69273 z", name: "Adductor group" },
  { d: "m 14.433335,87.868265 -0.12448,3.45228 -0.29058,1.20637 h -0.87118 l -0.24877,-0.83181 -0.29059,-0.0416 0.0623,0.83181 -1.09934,-0.33333 -0.29058,-0.16629 -1.2448,-0.27033 -0.0412,-0.97747 1.2031899,-2.03781 0.82975,-1.04009 2.03294,-0.83181 z" },
  { muscle: "calves", d: "m 13.437675,70.440945 -0.29058,0.91486 -0.62241,3.86828 -0.0829,5.15733 0.87174,5.03304 -0.0418,-6.44714 0.91298,-2.57848 0.1243,-2.82837 z m -1.99151,2.32914 0.20735,7.73637 1.65968,6.23904 -1.80497,-0.85299 -3.0079799,-10.83584 1.03728,-6.82095 z", name: "Tibialis anterior" },
  { d: "m 10.284405,64.784375 -0.12448,1.12295 0.87118,1.08171 0.29058,1.70599 0.58116,0.24933 0.49774,-2.57866 0.33182,-0.91486 -0.29058,-0.58247 z m 3.85854,0.0832 -0.62241,1.74685 -1.32767,2.57867 0.33182,2.37095 0.95423,-2.66209 0.78832,-1.4964 z m -4.9786799,-2.37058 0.9542299,5.11609 -0.6223999,-0.33313 -0.49793,1.6638 z" },
  { d: "m 3.2054751,27.370125 0.005,3.09419 -0.57959,1.91184 -0.54539,-2.41185 z" },
  { d: "m 4.3904451,43.563145 -1.5198,0.0506 -0.76631,-0.67112 -1.21261996,2.15767 -0.86245,3.32873 0.49386,0.22113 0.59814996,-2.20238 0.50016,0.25356 -0.35639,2.49422 0.62382,0.24345 0.41402,-2.49194 0.55839,0.17851 -0.2262,2.76603 0.76938,0.32268 0.25788,-2.86764 0.4578,-0.0181 0.16611,2.65239 0.65997,0.2633 0.0712,-4.56643 0.34158,-0.19428 1.35316,1.68367 0.32832,-0.34354 -0.72644,-2.0551 z" },
  { d: "m 28.325215,27.370125 -0.005,3.09419 0.57959,1.91184 0.54538,-2.41185 z" },
  { d: "m 27.140245,43.563145 1.5198,0.0506 0.76631,-0.67111 1.21262,2.15766 0.86245,3.32873 -0.49386,0.22113 -0.59815,-2.20238 -0.50016,0.25356 0.35639,2.49422 -0.62382,0.24345 -0.41402,-2.49194 -0.55839,0.17851 0.2262,2.76603 -0.76938,0.32268 -0.25788,-2.86764 -0.4578,-0.0181 -0.16611,2.6524 -0.65997,0.26329 -0.0712,-4.56643 -0.34158,-0.19428 -1.35316,1.68368 -0.32832,-0.34355 0.72644,-2.0551 z" },
];

const BACK_PARTS = [
  { d: "m 48.157455,6.3585449 0.44208,-0.14964 0.16111,0.16427 1.48163,4.0475101 2.32401,1.45118 2.39971,-1.52387 0.97577,-3.6896901 0.52752,-0.55908 0.23367,0.0981 0.24198,-3.34467 -2.03129,-2.31103004 -2.84509,-0.51629 -2.20422,0.52915 -1.93631,2.63077004 z" },
  { d: "m 52.369695,12.105075 -2.35767,-1.55045 -1.47119,-3.9514301 -0.60741,0.0403 0.27409,1.82447 0.97635,0.33932 0.7613,2.2157201 0.33017,1.06849 0.0895,2.14894 1.16448,0.008 0.10563,-0.70833 0.54716,-0.0606 z m 1.01793,1.47595 0.23768,0.64982 1.38107,-0.004 0.01,-2.38784 0.25971,-0.79061 0.57215,-2.1698001 0.76359,-0.41018 0.25158,-1.78416 -0.62859,0.0193 -1.08488,3.8998101 -2.39725,1.46684 0.2768,1.48507 z" },
  { muscle: "traps", d: "M 49.625,14.629 L 49.688,12.005 L 48.974,13.157 L 44.594,14.654 L 45.945,16.925 L 51.222,16.925 L 51.183,14.550 Z", name: "Trapezius, upper" },
  { muscle: "traps", d: "M 46.034,17.075 L 48.920,21.925 L 51.303,21.925 L 51.224,17.075 Z", name: "Trapezius, middle" },
  { muscle: "traps", d: "M 49.009,22.075 L 49.572,23.022 L 51.403,28.104 L 51.305,22.075 Z", name: "Trapezius, lower" },
  { muscle: "traps", d: "M 55.439,14.729 L 55.376,12.104 L 56.090,13.256 L 60.470,14.754 L 59.179,16.925 L 53.844,16.925 L 53.881,14.649 Z", name: "Trapezius, upper" },
  { muscle: "traps", d: "M 59.089,17.075 L 56.204,21.925 L 53.763,21.925 L 53.842,17.075 Z", name: "Trapezius, middle" },
  { muscle: "traps", d: "M 56.114,22.075 L 55.492,23.121 L 53.661,28.203 L 53.761,22.075 Z", name: "Trapezius, lower" },
  { muscle: "lats", d: "M 44.144,15.285 L 39.888,20.286 L 39.426,22.749 L 41.263,21.510 L 44.025,20.355 L 45.663,23.400 L 49.103,23.400 Z", name: "Latissimus dorsi, upper" },
  { muscle: "rear-delts", d: "M 42.201,16.586 L 40.626,18.152 L 39.736,20.156 L 43.992,15.155 Z", name: "Deltoid, posterior head" },
  { muscle: "lats", d: "M 45.771,23.600 L 45.872,23.789 L 47.009,29.286 L 47.023,30.400 L 51.080,30.400 L 51.053,28.314 L 49.185,23.600 Z", name: "Latissimus dorsi, middle" },
  { muscle: "lats", d: "M 47.026,30.600 L 47.086,35.145 L 51.156,36.255 L 51.082,30.600 Z", name: "Latissimus dorsi, lower" },
  { muscle: "rear-delts", d: "M 62.863,16.686 L 64.438,18.251 L 65.328,20.255 L 61.073,15.254 Z", name: "Deltoid, posterior head" },
  { muscle: "lats", d: "M 60.921,15.384 L 65.176,20.385 L 65.290,22.849 L 63.801,21.609 L 61.039,20.454 L 59.455,23.400 L 56.022,23.400 Z", name: "Latissimus dorsi, upper" },
  { muscle: "lats", d: "M 59.347,23.600 L 59.192,23.888 L 58.055,29.385 L 58.042,30.400 L 53.986,30.400 L 54.012,28.413 L 55.918,23.600 Z", name: "Latissimus dorsi, middle" },
  { muscle: "lats", d: "M 58.039,30.600 L 57.979,35.245 L 53.908,36.354 L 53.983,30.600 Z", name: "Latissimus dorsi, lower" },
  { muscle: "triceps", d: "M 43.593,21.039 L 44.920,23.967 L 43.615,25.653 L 43.186,27.069 L 39.209,29.802 Z", name: "Triceps brachii, long head" },
  { muscle: "triceps", d: "M 43.459,20.972 L 39.075,29.735 L 38.871,25.461 L 39.407,23.674 L 41.242,21.927 Z", name: "Triceps brachii, lateral head" },
  { d: "M 40.716955,42.424835 l -1.5182,0.0863 -0.78184,-0.65295 -1.16168,2.1855 -0.78414,3.34805 0.49892,0.20949 0.54632,-2.2158 0.50597,0.24175 -0.29779,2.5019 0.62936,0.22875 0.35546,-2.50096 0.56242,0.16536 -0.16126,2.77057 0.77674,0.30455 0.19056,-2.87291 0.45724,-0.0289 0.22827,2.64778 0.66597,0.24774 -0.0359,-4.56685 0.33693,-0.20224 1.39227,1.65147 0.32017,-0.35115 -0.77444,-2.03749 z" },
  { muscle: "forearms", d: "M 40.775,29.006 L 42.870,27.644 L 42.187,29.635 L 42.603,34.383 L 40.799,42.081 L 39.814,42.253 Z", name: "Forearm flexors" },
  { muscle: "forearms", d: "M 39.665,42.242 L 38.305,41.501 L 37.998,34.491 L 38.635,31.429 L 39.245,30.209 L 40.625,28.994 Z", name: "Forearm extensors" },
  { muscle: "triceps", d: "M 61.376,21.213 L 60.056,24.145 L 61.330,26.199 L 61.657,27.251 L 65.780,29.966 Z", name: "Triceps brachii, long head" },
  { muscle: "triceps", d: "M 61.510,21.146 L 65.914,29.899 L 66.108,25.624 L 65.568,23.839 L 63.729,22.096 Z", name: "Triceps brachii, lateral head" },
  { d: "M 64.301385,42.592325 l 1.51839,0.0828 0.78033,-0.65476 1.16673,2.18281 0.79187,3.34623 -0.49843,0.21064 -0.55144,-2.21453 -0.50541,0.24292 0.30356,2.5012 -0.62882,0.23021 -0.36124,-2.50014 -0.56203,0.16666 0.16765,2.77019 -0.77603,0.30634 -0.19719,-2.87245 -0.45732,-0.0278 -0.22215,2.64829 -0.66539,0.24928 0.0254,-4.56692 -0.3374,-0.20146 -1.38845,1.65469 -0.32098,-0.35041 0.76973,-2.03928 z" },
  { muscle: "forearms", d: "M 65.204,42.420 L 63.925,29.007 L 61.764,27.798 L 62.786,29.733 L 62.397,34.555 L 64.219,42.248 Z", name: "Forearm flexors" },
  { muscle: "forearms", d: "M 64.075,28.993 L 65.353,42.405 L 66.712,41.663 L 67.002,34.653 L 66.358,31.591 L 65.745,30.373 Z", name: "Forearm extensors" },
  { d: "m 51.733705,14.788555 0.53876,25.33066 0.48967,-0.0297 0.65658,-25.3387 -0.28147,-0.84188 -1.25059,-4.9e-4 z" },
  { muscle: "lower-back", d: "M 52.100,37.310 L 49.537,36.465 L 50.244,40.788 L 52.200,42.030 L 52.200,40.270 L 52.150,40.280 Z", name: "Erector spinae" },
  { muscle: "lower-back", d: "M 49.389,36.490 L 46.240,35.460 L 44.720,39.420 L 50.096,40.812 Z", name: "Quadratus lumborum" },
  { muscle: "lower-back", d: "M 52.800,42.030 L 52.800,40.270 L 52.850,40.260 L 52.900,37.290 L 55.289,36.625 L 54.805,40.801 Z", name: "Erector spinae" },
  { muscle: "lower-back", d: "M 55.439,36.643 L 55.980,36.470 L 58.320,35.720 L 59.660,39.450 L 54.955,40.819 Z", name: "Quadratus lumborum" },
  { muscle: "glutes", d: "M 50.191,41.481 L 44.740,39.690 L 43.830,41.580 L 43.431,44.301 Z", name: "Gluteus medius" },
  { muscle: "glutes", d: "M 50.249,41.619 L 43.489,44.439 L 44.410,50.520 L 47.180,51.030 L 51.620,49.090 L 52.200,49.480 L 52.200,42.880 Z", name: "Gluteus maximus" },
  { muscle: "glutes", d: "M 55.274,41.079 L 61.354,45.519 L 60.640,42.150 L 59.740,39.860 Z", name: "Gluteus medius" },
  { muscle: "glutes", d: "M 55.186,41.201 L 52.800,42.880 L 52.800,49.480 L 53.570,49.090 L 57.680,50.760 L 60.500,50.600 L 61.266,45.641 Z", name: "Gluteus maximus" },
  { d: "m 51.176145,64.073985 -1.20605,3.01461 0.70738,0.26558 0.89754,3.51771 -0.55801,-4.01191 z m -5.08496,-3.15003 0.63355,1.8609 0.16813,2.03261 0.61314,1.93117 -0.90585,-0.0851 -0.28534,2.15982 z" },
  { d: "m 54.019305,64.073985 1.20605,3.01461 -0.70737,0.26558 -0.89755,3.51771 0.55802,-4.01191 z m 5.08496,-3.15003 -0.63355,1.8609 -0.16813,2.03261 -0.61313,1.93117 0.90584,-0.0851 0.28534,2.15982 z" },
  { muscle: "calves", d: "M 50.568,67.512 L 51.669,72.509 L 51.379,75.532 L 51.292,76.825 L 48.983,76.825 Z", name: "Gastrocnemius, medial head" },
  { muscle: "calves", d: "M 50.218,67.512 L 48.633,76.825 L 46.283,76.825 L 45.533,74.263 L 46.783,67.088 Z", name: "Gastrocnemius, lateral head" },
  { muscle: "calves", d: "M 46.386,77.175 L 51.269,77.175 L 50.701,85.598 L 49.037,86.233 Z", name: "Soleus" },
  { muscle: "calves", d: "M 54.628,67.512 L 53.526,72.509 L 53.816,75.532 L 53.903,76.825 L 56.213,76.825 Z", name: "Gastrocnemius, medial head" },
  { muscle: "calves", d: "M 54.978,67.512 L 56.563,76.825 L 58.912,76.825 L 59.662,74.263 L 58.412,67.088 Z", name: "Gastrocnemius, lateral head" },
  { muscle: "calves", d: "M 53.927,77.175 L 58.810,77.175 L 56.158,86.233 L 54.495,85.598 Z", name: "Soleus" },
  { d: "M 50.933115,88.340995 l 0.85194,1.3581 0.37189,0.79238 -0.15588,1.21774 -0.76984,0.74446 -1.51185,0.12543 -1.1299,-0.29192 -0.24225,-0.95894 0.80765,-1.30405 -0.22562,-0.85987 0.29679,-0.84153 -0.0194,-1.81524 1.53568,-0.54817 z m -1.19598,0.4675 0.15943,1.25776 -0.6023,0.97431 m -0.54436,0.29544 1.06474,0.40084 1.55326,-0.65137 z" },
  { muscle: "hamstrings", d: "M 49.550,50.504 L 51.751,49.461 L 52.389,49.692 L 52.424,51.499 L 52.499,56.145 L 50.521,62.188 L 50.997,63.602 L 49.569,66.897 L 48.755,66.754 Z", name: "Hamstrings, semitendinosus" },
  { muscle: "hamstrings", d: "M 49.400,50.496 L 48.605,66.746 L 47.803,66.596 L 47.302,64.480 L 47.133,62.723 L 44.712,54.565 L 44.369,50.918 L 47.200,51.500 Z", name: "Biceps femoris" },
  { d: "M 54.262335,88.340995 l -0.85194,1.3581 -0.37189,0.79238 0.15589,1.21774 0.76983,0.74446 1.51186,0.12543 1.12989,-0.29192 0.24225,-0.95894 -0.80765,-1.30405 0.22563,-0.85987 -0.29679,-0.84153 0.0194,-1.81524 -1.53568,-0.54817 z m 1.19598,0.4675 -0.15943,1.25776 0.6023,0.97431 m 0.54436,0.29544 -1.06474,0.40084 -1.55326,-0.65137 z" },
  { muscle: "hamstrings", d: "M 57.425,51.196 L 56.565,66.806 L 55.759,66.965 L 54.331,63.670 L 54.807,62.256 L 52.829,56.213 L 52.904,51.567 L 52.956,49.769 L 53.520,49.498 Z", name: "Hamstrings, semitendinosus" },
  { muscle: "hamstrings", d: "M 57.575,51.204 L 60.625,50.950 L 60.616,54.633 L 58.195,62.791 L 58.026,64.547 L 57.525,66.663 L 56.715,66.814 Z", name: "Biceps femoris" },
];

const SVGNS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}
// untracked filler first so the tracked, clickable regions sit on top
function buildMap(svg, parts, onMuscleClick) {
  svg.innerHTML = "";
  const tracked = [];
  parts.forEach(p => {
    const el = svgEl("path", { d: p.d, class: p.muscle ? "muscle-shape" : "muscle-filler" });
    if (!p.muscle) { svg.appendChild(el); return; }
    el.setAttribute("data-muscle", p.muscle);
    // native <title> gives a hover tooltip for free, in every browser,
    // with no positioning/tracking code -- the specific muscle plus the
    // group it counts toward, since one group covers several regions
    const title = svgEl("title", {});
    title.textContent = p.name + " · " + (MUSCLE_LABELS[p.muscle] || p.muscle);
    el.appendChild(title);
    el.addEventListener("click", () => onMuscleClick(p.muscle));
    // one tracked group spans up to 8 separate regions across both
    // figures, so hovering any one of them highlights the whole group
    // -- lighting a single quad head on its own just looks broken
    el.addEventListener("mouseenter", () => setHoverGroup(p.muscle));
    el.addEventListener("mouseleave", () => setHoverGroup(null));
    tracked.push(el);
  });
  tracked.forEach(el => svg.appendChild(el));
}

function setHoverGroup(muscle) {
  [mapFront, mapBack].forEach(svg => {
    svg.querySelectorAll(".muscle-shape").forEach(el => {
      el.classList.toggle("is-hover", !!muscle && el.dataset.muscle === muscle);
    });
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
buildMap(mapFront, FRONT_PARTS, onMuscleClick);
buildMap(mapBack, BACK_PARTS, onMuscleClick);

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
