/*
 * Sitewide sign-in widget: a "Sign in" button that becomes the user's
 * avatar/name + "Sign out" once they're signed in. Drop a container
 * element anywhere (e.g. <div id="authWidget"></div>) and call
 * initAuthWidget(document.getElementById("authWidget")) — used on
 * index.html today; any other page can do the same to get the same
 * sign-in state (Firebase Auth persists the session across pages/tabs
 * on its own).
 */
import { signInWithGoogle, signOutUser, onAuthChange } from "./auth.js";

export function initAuthWidget(container) {
  container.innerHTML = `
    <button type="button" class="auth-signin-btn" hidden>Sign in</button>
    <div class="auth-user" hidden>
      <img class="auth-avatar" alt="">
      <span class="auth-name"></span>
      <button type="button" class="auth-signout-btn">Sign out</button>
    </div>
    <p class="auth-error" hidden></p>
  `;
  const signInBtn = container.querySelector(".auth-signin-btn");
  const userEl = container.querySelector(".auth-user");
  const avatarEl = container.querySelector(".auth-avatar");
  const nameEl = container.querySelector(".auth-name");
  const signOutBtn = container.querySelector(".auth-signout-btn");
  const errorEl = container.querySelector(".auth-error");

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    signInBtn.hidden = true;
    userEl.hidden = true;
  }

  signInBtn.addEventListener("click", () => {
    signInBtn.disabled = true;
    signInWithGoogle()
      .catch((err) => {
        if (err && err.code === "auth/popup-closed-by-user") return; // not a real error
        showError(authErrorMessage(err));
      })
      .finally(() => { signInBtn.disabled = false; });
  });
  signOutBtn.addEventListener("click", () => {
    signOutUser().catch((err) => showError(authErrorMessage(err)));
  });

  try {
    onAuthChange((user) => {
      errorEl.hidden = true;
      if (user) {
        signInBtn.hidden = true;
        userEl.hidden = false;
        avatarEl.src = user.photoURL || "";
        avatarEl.hidden = !user.photoURL;
        nameEl.textContent = user.displayName || user.email || "Signed in";
      } else {
        signInBtn.hidden = false;
        userEl.hidden = true;
      }
    });
  } catch (err) {
    showError("Sign-in isn't set up yet.");
  }
}

function authErrorMessage(err) {
  const code = err && err.code;
  if (code === "auth/unauthorized-domain") return "This site isn't authorized for sign-in yet.";
  if (code === "auth/invalid-api-key" || code === "auth/api-key-not-valid") return "Sign-in isn't set up yet.";
  if (code === "auth/popup-blocked") return "Your browser blocked the sign-in popup — allow popups and try again.";
  return "Sign-in failed. Try again.";
}
