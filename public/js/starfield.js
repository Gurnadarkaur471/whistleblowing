/* ================================================
   SecureVoice – Blinking Starfield Background
   ================================================
   Renders a full-viewport canvas of softly twinkling
   star-like dots behind all page content.
   ================================================ */

(function () {
  'use strict';

  const STAR_COUNT = 60; // Reduced background stars
  const COLORS = [
    { r: 255, g: 255, b: 255 }    // Pure white only
  ];

  /* ── Create Canvas ─────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');

  /* ── Resize Handler ────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight || window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Re-measure on DOM changes (dynamic pages)
  let resizeTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  /* ── Star Factory ──────────────────────────────── */
  function createStar() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:        Math.random() * canvas.width,
      y:        Math.random() * canvas.height,
      radius:   0.3 + Math.random() * 0.8,         // small size (0.3 - 1.1 px)
      baseAlpha: 0.10 + Math.random() * 0.40,       // 0.10 – 0.50
      phase:    Math.random() * Math.PI * 2,         // random start offset
      speed:    0.02 + Math.random() * 0.05,         // faster blinking effect
      r: color.r,
      g: color.g,
      b: color.b,
    };
  }

  const stars = Array.from({ length: STAR_COUNT }, createStar);

  /* ── Animation Loop ────────────────────────────── */
  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      // Sine-based opacity oscillation → smooth twinkling
      const flicker = Math.sin(frame * s.speed + s.phase);
      const alpha   = s.baseAlpha + flicker * 0.3;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${Math.max(0.04, alpha)})`;
      ctx.fill();

      // Optional soft glow for larger stars
      if (s.radius > 1.3) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${Math.max(0.01, alpha * 0.12)})`;
        ctx.fill();
      }
    }

    frame++;
    requestAnimationFrame(draw);
  }

  draw();

  /* ── Reposition stars on resize ────────────────── */
  window.addEventListener('resize', () => {
    for (const s of stars) {
      s.x = Math.random() * canvas.width;
      s.y = Math.random() * canvas.height;
    }
  });
})();
