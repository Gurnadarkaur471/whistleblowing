/* ================================================
   SecureVoice – Theme Toggle (Light / Dark)
   ================================================
   Persists choice in localStorage.
   Applies data-theme="light" on <html>.
   Default: dark mode (no attribute).
   ================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'sv-theme';
  const LIGHT = 'light';
  const DARK = 'dark';

  // ── Read stored preference ──
  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || DARK;
  }

  // ── Apply theme to the page ──
  function applyTheme(theme) {
    if (theme === LIGHT) {
      document.documentElement.setAttribute('data-theme', LIGHT);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);

    // Update every toggle button on the page
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      var icon = btn.querySelector('i');
      var label = btn.querySelector('.theme-label');
      if (icon) {
        icon.className = theme === LIGHT ? 'fas fa-moon' : 'fas fa-sun';
      }
      if (label) {
        label.textContent = theme === LIGHT ? 'Dark Mode' : 'Light Mode';
      }
      btn.setAttribute('aria-label',
        theme === LIGHT ? 'Switch to dark mode' : 'Switch to light mode'
      );
    });

    // Hide/show starfield canvas in light mode
    var starfield = document.getElementById('starfield-canvas');
    if (starfield) {
      starfield.style.opacity = theme === LIGHT ? '0' : '1';
    }
  }

  // ── Toggle between light and dark ──
  function toggle() {
    var current = getTheme();
    applyTheme(current === LIGHT ? DARK : LIGHT);
  }

  // ── Bind click events to all toggle buttons ──
  function bindButtons() {
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      // Prevent duplicate listeners
      if (!btn.dataset.themeBound) {
        btn.addEventListener('click', toggle);
        btn.dataset.themeBound = 'true';
      }
    });
  }

  // ── Initialize ──
  function init() {
    applyTheme(getTheme());
    bindButtons();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

