/*
 * Firebase project config — from the Firebase console:
 * Project settings (gear icon) > General > Your apps > SDK setup and
 * configuration > Config.
 *
 * These values identify which Firebase project the site talks to; they
 * are NOT secret (they're always visible in any Firebase web app's
 * client-side JS) — real access control lives in the Firestore security
 * rules instead (see firestore.rules), not in hiding this file.
 *
 * Replace every value below with your own project's before sign-in will
 * work. Until then, auth.js will fail to initialize and the sign-in
 * widget will just show an error instead of a working button.
 */
export const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};
