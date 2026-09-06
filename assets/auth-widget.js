/*
 * Sitewide sign-in widget. The real thing (Google sign-in via Firebase,
 * wired up in auth.js) isn't live yet -- assets/firebase-config.js still
 * has placeholder REPLACE_ME values, so this renders a greyed-out,
 * non-interactive stand-in instead of a button that would just fail.
 *
 * Swap this back to the real widget once firebase-config.js has real
 * values: restore the markup/wiring below from auth.js's exports
 * (signInWithGoogle, signOutUser, onAuthChange) -- see git history for
 * the previous version of this file.
 */
export function initAuthWidget(container) {
  container.innerHTML = `
    <div class="auth-placeholder" aria-disabled="true">
      <span class="auth-placeholder-label">Sign in</span>
      <span class="auth-placeholder-sub">In progress</span>
    </div>
  `;
}
