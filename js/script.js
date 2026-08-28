/* ============================================================
   PORTFOLIO — script.js
   Author : Yasser Wahada
   ============================================================ */

'use strict';

/* ============================================================
   1. THEME TOGGLE (dark ↔ light)
   ============================================================ */
const html         = document.documentElement;
const themeToggle  = document.getElementById('theme-toggle');
const themeIcon    = document.getElementById('theme-icon');

const THEME_KEY = 'yw-portfolio-theme';

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  localStorage.setItem(THEME_KEY, theme);
}

// Load saved theme (default = dark)
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   2. SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = scrollPercent + '%';
}, { passive: true });

/* ============================================================
   3. NAVBAR — scroll effects & active section highlight
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

function onNavScroll() {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const sectionTop = sec.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

/* ============================================================
   4. MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// Close on nav link click
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

/* ============================================================
   5. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   6. TYPED / TYPEWRITER EFFECT (Hero role line)
   ============================================================ */
const typedEl    = document.getElementById('typed-text');
const typedWords = [
  'Software Engineer',
];
let wordIdx  = 0;
let charIdx  = 0;
let deleting = false;
let typePause = false;

function typeLoop() {
  if (typePause) { setTimeout(typeLoop, 1800); typePause = false; return; }

  const word    = typedWords[wordIdx];
  const current = deleting
    ? word.substring(0, charIdx - 1)
    : word.substring(0, charIdx + 1);

  typedEl.textContent = current;

  if (!deleting && current === word) {
    typePause = true;
    deleting  = true;
    setTimeout(typeLoop, 1800);
    return;
  }

  if (deleting && current === '') {
    deleting = false;
    wordIdx  = (wordIdx + 1) % typedWords.length;
    charIdx  = 0;
    setTimeout(typeLoop, 350);
    return;
  }

  charIdx += deleting ? -1 : 1;
  setTimeout(typeLoop, deleting ? 45 : 80);
}

typeLoop();

/* ============================================================
   7. ANIMATED COUNTER (Stats in Hero)
   ============================================================ */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);

  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start) + suffix;
    if (start < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(c => {
        animateCounter(c, parseInt(c.dataset.count), c.dataset.suffix || '');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.getElementById('hero-stats');
if (statsSection) statsObserver.observe(statsSection);

/* ============================================================
   8. CONTACT FORM — fake submit with validation
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.querySelector('#cf-name').value.trim();
    const email   = contactForm.querySelector('#cf-email').value.trim();
    const subject = contactForm.querySelector('#cf-subject').value.trim();
    const message = contactForm.querySelector('#cf-message').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      shakeForm(contactForm);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      shakeForm(contactForm);
      highlightField(contactForm.querySelector('#cf-email'));
      return;
    }

    // Simulate success
    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1200);
  });
}

function shakeForm(form) {
  form.style.animation = 'shakeX .4s ease';
  setTimeout(() => form.style.animation = '', 400);
}

function highlightField(field) {
  field.style.borderColor = '#f5576c';
  field.focus();
  setTimeout(() => field.style.borderColor = '', 2000);
}

// Add shakeX keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shakeX { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`;
document.head.appendChild(shakeStyle);

/* ============================================================
   9. SMOOTH SCROLL for all anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 68; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   10. PARALLAX: hero orbs subtle mouse movement
   ============================================================ */
const hero = document.getElementById('hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const orbs = hero.querySelectorAll('.hero-orb');
    const { clientX, clientY } = e;
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (clientX - cx) / cx;
    const dy = (clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 18;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    hero.querySelectorAll('.hero-orb').forEach(orb => {
      orb.style.transform = '';
    });
  });
}

/* ============================================================
   11. PROJECT CARD — tilt effect on hover
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - .5;
    const y      = (e.clientY - rect.top)  / rect.height - .5;
    const tiltX  = y * 8;
    const tiltY  = -x * 8;
    card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transition = 'transform .1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

/* ============================================================
   12. CURRENT YEAR in footer
   ============================================================ */
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
