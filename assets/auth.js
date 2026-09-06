/*
 * Sitewide sign-in + per-user data storage, built on Firebase Auth +
 * Firestore. Any page can import from here to know who's signed in and
 * save/load that user's own data — this file is the only place that
 * touches the Firebase SDK directly, so every project on the site shares
 * one auth session and one consistent way of reading/writing data.
 *
 * Requires assets/firebase-config.js to hold a real project config (see
 * that file's comment) — until it does, initializeApp below will throw,
 * which auth-widget.js catches and surfaces as a visible error instead
 * of a silently broken button.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signOutUser() {
  return signOut(auth);
}

// fires immediately with the current user (or null), then again on every
// sign-in/sign-out — the standard way to keep UI in sync with auth state
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export function currentUser() {
  return auth.currentUser;
}

// per-user data, namespaced by project so e.g. Nightfall's save and a
// future high-score list don't collide: users/{uid}/data/{project}
export async function saveUserData(project, data) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  await setDoc(doc(db, "users", user.uid, "data", project), data, { merge: true });
}

export async function loadUserData(project) {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, "users", user.uid, "data", project));
  return snap.exists() ? snap.data() : null;
}
