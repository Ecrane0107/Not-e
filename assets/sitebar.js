/* ============================================================
   SITE BAR — one persistent strip on every page.

   Back, Menu, Settings (theme), Help. Built here rather than copied
   into ten HTML files, so it cannot drift between pages.

   Reads two data attributes off its own <script> tag:
     data-root  path back to the site root, e.g. "../"  (default "")
     data-where the project's name, shown on the right

   A page that wants its own settings can append to #sbExtra inside
   the settings panel — see the home page's background controls.
   ============================================================ */
(function () {
  "use strict";

  var me = document.currentScript;
  var ROOT = (me && me.dataset.root) || "";
  var WHERE = (me && me.dataset.where) || "";
  var THEME_KEY = "site:theme";

  /* ---------- theme ---------- */
  function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }
  function storedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
    } catch (e) {
      return "dark";
    }
  }
  // Storage is the authority, not the markup. The snippet in each page's
  // <head> exists only to get the right theme painted on the first frame; if
  // a page is served from cache without it, the theme would otherwise be
  // whatever the stylesheet defaults to, and the setting would look ignored.
  function applyStoredTheme() {
    var want = storedTheme();
    if (currentTheme() === want) return;
    document.documentElement.dataset.theme = want;
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: want } }));
  }
  function setTheme(name) {
    document.documentElement.dataset.theme = name;
    try { localStorage.setItem(THEME_KEY, name); } catch (e) { /* private mode */ }
    syncTheme();
    // let a page redraw anything it paints itself (canvas maps, charts)
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: name } }));
  }
  function syncTheme() {
    var now = currentTheme();
    settings.querySelectorAll("[data-theme-set]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.themeSet === now));
    });
  }

  var icon = {
    back: '<svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true">' +
          '<path d="M7.5 2.5 3 6l4.5 3.5" stroke="currentColor" stroke-width="1.5" ' +
          'stroke-linecap="round" stroke-linejoin="round"/></svg>',
    home: '<svg viewBox="0 0 14 14" width="12" height="12" fill="none" aria-hidden="true">' +
          '<path d="M2 6.5 7 2.5l5 4M3.4 7.6V11a.6.6 0 0 0 .6.6h6a.6.6 0 0 0 .6-.6V7.6" ' +
          'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gear: '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">' +
          '<path fill="currentColor" fill-rule="evenodd" d="M21,12 L18.5,14.7 L18.4,18.4 ' +
          'L14.7,18.5 L12,21 L9.3,18.5 L5.6,18.4 L5.5,14.7 L3,12 L5.5,9.3 L5.6,5.6 L9.3,5.5 ' +
          'L12,3 L14.7,5.5 L18.4,5.6 L18.5,9.3 Z M8.8,12 A3.2,3.2 0 1,0 15.2,12 A3.2,3.2 0 1,0 8.8,12 Z"/></svg>',
    sun:  '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">' +
          '<circle cx="8" cy="8" r="3.1" stroke="currentColor" stroke-width="1.4"/>' +
          '<path d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1' +
          'M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1" stroke="currentColor" stroke-width="1.4" ' +
          'stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">' +
          '<path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z" ' +
          'stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>'
  };

  /* ---------- the bar ---------- */
  // Back is left-anchored and Settings/Help are pushed to the right edge by
  // the spacer, so both ends sit in the same place on every page whatever is
  // between them. Menu is the one thing that varies, and only because on the
  // menu it would be a button for going where you already are.
  var atHome = /(^|\/)index\.html$/.test(location.pathname) ||
               /\/$/.test(location.pathname);

  var bar = document.createElement("header");
  bar.className = "sitebar";
  bar.innerHTML =
    '<button type="button" class="sb-btn sb-btn--wide" id="sbBack" aria-label="Go back">' +
      icon.back + "<span>Back</span></button>" +
    (atHome ? "" :
      '<a class="sb-btn sb-btn--wide" id="sbHome" href="' + ROOT + 'index.html" aria-label="Main menu">' +
        icon.home + "<span>Menu</span></a>") +
    (WHERE ? '<span class="sb-where">' + WHERE + "</span>" : "") +
    '<span class="sb-spacer"></span>' +
    '<button type="button" class="sb-btn sb-btn--icon" id="sbSettings" aria-haspopup="dialog" ' +
      'aria-expanded="false" aria-label="Settings">' + icon.gear + "</button>" +
    '<button type="button" class="sb-btn sb-btn--icon" id="sbHelp" aria-haspopup="dialog" ' +
      'aria-expanded="false" aria-label="About this site">?</button>';

  var settings = document.createElement("div");
  settings.className = "sb-pop";
  settings.id = "sbSettingsPanel";
  settings.setAttribute("role", "dialog");
  settings.setAttribute("aria-label", "Settings");
  settings.hidden = true;
  settings.innerHTML =
    '<div class="sb-pop-head"><h2>Settings</h2>' +
      '<button type="button" class="sb-close" data-sb-close aria-label="Close">&times;</button></div>' +
    "<h3>Appearance</h3>" +
    '<div class="sb-seg" role="group" aria-label="Colour theme">' +
      '<button type="button" data-theme-set="dark" aria-pressed="true">' + icon.moon + "Dark</button>" +
      '<button type="button" data-theme-set="light" aria-pressed="false">' + icon.sun + "Light</button>" +
    "</div>" +
    '<div id="sbExtra"></div>' +
    "<h3>Data</h3>" +
    '<p class="sb-note" id="sbDataNote"></p>' +
    '<button type="button" class="sb-wide-btn sb-danger" id="sbClear">Clear all saved data</button>';

  var help = document.createElement("div");
  help.className = "sb-pop";
  help.id = "sbHelpPanel";
  help.setAttribute("role", "dialog");
  help.setAttribute("aria-label", "About this site");
  help.hidden = true;
  help.innerHTML =
    '<div class="sb-pop-head"><h2>Where your data lives</h2>' +
      '<button type="button" class="sb-close" data-sb-close aria-label="Close">&times;</button></div>' +
    "<p>In this browser, and nowhere else. There is no account, no sign-in " +
      "and no server keeping anything: every page here is a plain file your " +
      "browser downloads and runs on its own.</p>" +
    "<p>What you type — a budget, a workout plan, a week's schedule, how far " +
      "you have read — goes into this browser's own storage on this device, " +
      "filed under this site's address, and it is only ever read back by the " +
      "page that wrote it. Nothing is uploaded, because there is nowhere to " +
      "upload it to.</p>" +
    "<p>That means it survives closing the tab and restarting the computer, " +
      "but it does not follow you anywhere: open the site in a different " +
      "browser, on a different device, or in a private window and it will " +
      "start empty. Nobody else can read it, including me.</p>" +
    "<p>It also means the browser owns it. Clearing your browsing data for " +
      "this site clears it, and so does the button in Settings. Neither can " +
      "be undone, so export anything you would miss first.</p>";

  /* ---------- clearing it all ----------
     This throws away every tool's saved work and cannot be undone, so it
     asks twice: the first click only arms the button, and it disarms itself
     again after a few seconds or as soon as the panel closes. */
  function storedKeys() {
    try {
      return Object.keys(localStorage);
    } catch (e) {
      return [];
    }
  }

  function describeStored() {
    var n = storedKeys().length;
    // localStorage is per origin, and both copies of this site are published
    // under the same github.io domain, so one clear takes out both.
    return n === 0
      ? "Nothing is saved in this browser yet."
      : n + (n === 1 ? " item is" : " items are") + " saved in this browser " +
        "for this site — every tool's, not just this page's. Clearing cannot " +
        "be undone. The theme resets, and any tool that ships with a starter " +
        "set of its own will lay that out again, the way it does on a first " +
        "visit.";
  }

  function wireClear() {
    var btn = settings.querySelector("#sbClear");
    var note = settings.querySelector("#sbDataNote");
    if (!btn || !note) return;
    var armed = false, timer = null;

    function disarm() {
      armed = false;
      clearTimeout(timer);
      btn.textContent = "Clear all saved data";
      btn.classList.remove("is-armed");
      note.textContent = describeStored();
    }
    disarm();
    clearReset = disarm;

    btn.addEventListener("click", function () {
      if (!armed) {
        if (!storedKeys().length) return;   // nothing to throw away
        armed = true;
        btn.textContent = "Click again to erase it";
        btn.classList.add("is-armed");
        note.textContent = "This cannot be undone. Export anything you want " +
                           "to keep first.";
        timer = setTimeout(disarm, 6000);
        return;
      }
      try { localStorage.clear(); } catch (e) { /* blocked storage */ }
      location.reload();
    });
  }
  var clearReset = function () {};

  function mount() {
    applyStoredTheme();
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.appendChild(settings);
    document.body.appendChild(help);
    wire();
    syncTheme();
    // A page that adds its own settings cannot just listen for
    // DOMContentLoaded: its inline script sits above this file, so its
    // listener would run first, before the panel exists.
    window.dispatchEvent(new CustomEvent("sitebarready"));
  }

  function wire() {
    var back = bar.querySelector("#sbBack");
    if (back) {
      // Opened in a fresh tab there is nothing behind this page. The button
      // keeps its place either way — it just says so rather than pretending.
      if (history.length <= 1) back.disabled = true;
      back.addEventListener("click", function () {
        if (history.length > 1) history.back();
        else location.href = ROOT + "index.html";
      });
    }

    function pop(panel, button) {
      var other = panel === settings ? help : settings;
      var otherBtn = panel === settings ? bar.querySelector("#sbHelp") : bar.querySelector("#sbSettings");
      other.hidden = true;
      otherBtn.setAttribute("aria-expanded", "false");
      var open = panel.hidden;
      panel.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
      // never leave the erase button armed behind a closed panel, and
      // recount on the way in, since another tab may have saved since
      clearReset();
      if (open) {
        var first = panel.querySelector("button, a, input, select");
        if (first) first.focus();
      }
    }

    bar.querySelector("#sbSettings").addEventListener("click", function () {
      pop(settings, this);
    });
    bar.querySelector("#sbHelp").addEventListener("click", function () {
      pop(help, this);
    });

    [settings, help].forEach(function (panel) {
      panel.querySelector("[data-sb-close]").addEventListener("click", function () {
        panel.hidden = true;
        clearReset();
        var b = bar.querySelector(panel === settings ? "#sbSettings" : "#sbHelp");
        b.setAttribute("aria-expanded", "false");
        b.focus();
      });
    });

    settings.querySelectorAll("[data-theme-set]").forEach(function (b) {
      b.addEventListener("click", function () { setTheme(b.dataset.themeSet); });
    });

    wireClear();

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      [settings, help].forEach(function (panel) {
        if (panel.hidden) return;
        panel.hidden = true;
        clearReset();
        bar.querySelector(panel === settings ? "#sbSettings" : "#sbHelp")
           .setAttribute("aria-expanded", "false");
      });
    });

    // click away to dismiss
    document.addEventListener("pointerdown", function (e) {
      [settings, help].forEach(function (panel) {
        if (panel.hidden || panel.contains(e.target) || bar.contains(e.target)) return;
        panel.hidden = true;
        clearReset();
        bar.querySelector(panel === settings ? "#sbSettings" : "#sbHelp")
           .setAttribute("aria-expanded", "false");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }

  window.SiteBar = {
    settingsExtra: function () { return document.getElementById("sbExtra"); },
    theme: currentTheme,
    setTheme: setTheme
  };
})();
