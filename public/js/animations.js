/**
 * SecureVoice - Smooth Micro-Interactions & Animations
 * Focus: Calm, secure, high performance, accessible
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Page Load Fade In
  if (!prefersReducedMotion) {
    document.body.classList.add('page-transition-enter');
    requestAnimationFrame(() => {
      document.body.classList.add('page-transition-enter-active');
    });
  }

  // 2. Sticky Navbar Shrink on Scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      // Add scrolled class when scrolled past 50px
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // If reduced motion is true, make all scroll animated elements visible immediately and exit
  if (prefersReducedMotion) {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  // 3. Scroll-Based Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element hits the bottom
    threshold: 0.1 // 10% of the element is visible
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });
});
