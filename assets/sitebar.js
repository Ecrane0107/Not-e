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
    '<div id="sbExtra"></div>';

  var help = document.createElement("div");
  help.className = "sb-pop";
  help.id = "sbHelpPanel";
  help.setAttribute("role", "dialog");
  help.setAttribute("aria-label", "About this site");
  help.hidden = true;
  help.innerHTML =
    '<div class="sb-pop-head"><h2>About this site</h2>' +
      '<button type="button" class="sb-close" data-sb-close aria-label="Close">&times;</button></div>' +
    "<p>A small collection of things to read and use — a map of computer " +
      "science you can study from, and a few tools that keep track of " +
      "something for you. Pick one from the menu; this bar brings you back.</p>" +
    "<h3>Where your data goes</h3>" +
    "<p>Nowhere. There is no account, no sign-in and no server holding " +
      "anything: every page here is a plain file your browser downloads and " +
      "runs on its own.</p>" +
    "<p>What you type — a budget, a workout plan, a week's schedule, how far " +
      "you have read — is saved in this browser's own storage on this device, " +
      "and it is only ever read back by the same page that wrote it.</p>" +
    "<p>So it survives closing the tab and restarting the computer, but it " +
      "does not follow you to another browser, another device, or a private " +
      "window. Clearing your browsing data clears it too, and nobody else can " +
      "see it — including me.</p>";

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
        var b = bar.querySelector(panel === settings ? "#sbSettings" : "#sbHelp");
        b.setAttribute("aria-expanded", "false");
        b.focus();
      });
    });

    settings.querySelectorAll("[data-theme-set]").forEach(function (b) {
      b.addEventListener("click", function () { setTheme(b.dataset.themeSet); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      [settings, help].forEach(function (panel) {
        if (panel.hidden) return;
        panel.hidden = true;
        bar.querySelector(panel === settings ? "#sbSettings" : "#sbHelp")
           .setAttribute("aria-expanded", "false");
      });
    });

    // click away to dismiss
    document.addEventListener("pointerdown", function (e) {
      [settings, help].forEach(function (panel) {
        if (panel.hidden || panel.contains(e.target) || bar.contains(e.target)) return;
        panel.hidden = true;
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
