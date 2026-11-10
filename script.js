/**
 * TECHNOVA — Responsive Navigation & UI Script
 * Minimal Vanilla JavaScript strictly for Mobile Navigation & Interactive UX
 */

document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  // 1. Mobile Menu Toggle
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Prevent body scroll when mobile menu is active
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // Toggle on hamburger click
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Automatically reset when resized above tablet breakpoint (768px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  // 2. Close mobile menu when any nav link or CTA is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  const mobileCtaBtn = document.querySelector('.nav-mobile-cta a');
  if (mobileCtaBtn) {
    mobileCtaBtn.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // 3. Header Background Blur on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 4. Active Navigation Highlighting on Scroll (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
});
