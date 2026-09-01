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

/* ============================================================
   13. PROJECT PREVIEW LIGHTBOX
   ============================================================ */
const lightbox     = document.getElementById('preview-lightbox');
const lbImg        = document.getElementById('lightbox-img');
const lbTitle      = document.getElementById('lightbox-title');
const lbCaption    = document.getElementById('lightbox-caption');
const lbCounter    = document.getElementById('lightbox-counter');
const lbDots       = document.getElementById('lightbox-dots');
const lbPlaceholder= document.getElementById('lightbox-placeholder');

let lbImages   = [];
let lbCaptions = [];
let lbCurrent  = 0;

// Re-scale iMac on browser resize/zoom changes
window.addEventListener('resize', () => {
  const mockup = document.getElementById('device-mockup');
  if (mockup && mockup.classList.contains('is-desktop') && lightbox.classList.contains('is-open')) {
    scaleDesktopMockup();
  }
});

/* --- Open lightbox --- */
function openPreview(btn) {
  lbImages   = (btn.dataset.images   || '').split(',').map(s => s.trim()).filter(Boolean);
  lbCaptions = (btn.dataset.captions || '').split(',').map(s => s.trim());
  lbTitle.textContent = btn.dataset.title || 'Project Preview';
  lbCurrent = 0;

  const isDesktop = btn.dataset.device === 'desktop';

  const mockup = document.getElementById('device-mockup');
  if (mockup) {
    mockup.classList.toggle('is-desktop', isDesktop);
  }

  const panel = lightbox.querySelector('.lightbox-panel');
  if (panel) {
    panel.classList.toggle('is-desktop-mode', isDesktop);
  }

  buildDots();
  renderSlide(0, false);

  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Scale desktop mockup after layout settles
  if (isDesktop) {
    // Two rAF passes: first lets CSS transitions run, second measures real size
    requestAnimationFrame(() => requestAnimationFrame(scaleDesktopMockup));
  }

  // Focus close button for accessibility
  lightbox.querySelector('.lightbox-close').focus();
}

/* --- Close lightbox --- */
function closePreview() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lbImg.src = '';
}

/* --- Navigate slides --- */
function lightboxNav(dir) {
  const next = lbCurrent + dir;
  if (next < 0 || next >= lbImages.length) return;
  renderSlide(next, true);
}

/* --- Render a specific slide --- */
function renderSlide(index, animate) {
  lbCurrent = index;
  const src     = lbImages[index]  || '';
  const caption = lbCaptions[index] || '';

  // Caption & counter
  lbCaption.textContent = caption;
  lbCounter.textContent = `${index + 1} / ${lbImages.length}`;

  // Dot state
  document.querySelectorAll('.lightbox-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
    d.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });

  // Nav arrows disabled state
  lightbox.querySelector('.lightbox-prev').disabled = index === 0;
  lightbox.querySelector('.lightbox-next').disabled = index === lbImages.length - 1;

  // Image transition
  if (animate) lbImg.classList.add('is-loading');

  // Try loading the image
  const testImg = new Image();
  testImg.onload = () => {
    lbImg.src = src;
    lbImg.classList.remove('is-loading');
    lbPlaceholder.classList.add('hidden');
    lbImg.style.display = 'block';
    scaleDesktopMockup(); // re-scale after real image dimensions are known
  };
  testImg.onerror = () => {
    // Image doesn't exist — show placeholder
    lbImg.src = '';
    lbImg.style.display = 'none';
    lbImg.classList.remove('is-loading');
    lbPlaceholder.classList.remove('hidden');
  };
  testImg.src = src;
}

/* --- Scale iMac mockup to fit stage (desktop mode only) --- */
function scaleDesktopMockup() {
  const mockup = document.getElementById('device-mockup');
  if (!mockup || !mockup.classList.contains('is-desktop')) return;

  const stage = lightbox.querySelector('.lightbox-stage');
  if (!stage) return;

  // Reset zoom to measure natural size
  mockup.style.zoom = '1';

  requestAnimationFrame(() => {
    const stageH = stage.clientHeight;
    const stageW = stage.clientWidth;

    // Nav arrows take ~50px each side, add some padding
    const availW = stageW - 120;
    const availH = stageH - 32; // 16px padding top/bottom

    const mockupH = mockup.offsetHeight;
    const mockupW = mockup.offsetWidth;

    if (!mockupH || !mockupW) return;

    // Calculate required scale to fit
    const scale = Math.min(availH / mockupH, availW / mockupW, 1);

    // Apply via zoom (modifies actual layout size, works perfectly with flex centering)
    mockup.style.zoom = scale.toFixed(3);
  });
}

/* --- Build dot indicators --- */
function buildDots() {
  lbDots.innerHTML = '';
  lbImages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'lightbox-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Screenshot ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => renderSlide(i, true));
    lbDots.appendChild(dot);
  });
}

/* --- Keyboard navigation --- */
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape')      closePreview();
  if (e.key === 'ArrowRight')  lightboxNav(1);
  if (e.key === 'ArrowLeft')   lightboxNav(-1);
});

/* --- Touch / Swipe support (swipe left/right OUTSIDE phone screen to navigate) --- */
let touchStartX = 0;
let touchStartY = 0;
let swipeOriginInScreen = false;

lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
  // Check if touch starts inside the phone screen (let it scroll natively)
  const phoneScreen = lightbox.querySelector('.phone-screen');
  swipeOriginInScreen = phoneScreen ? phoneScreen.contains(e.target) : false;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (swipeOriginInScreen) return; // Let phone screen handle its own touch
  const diffX = touchStartX - e.changedTouches[0].clientX;
  const diffY = Math.abs(touchStartY - e.changedTouches[0].clientY);
  // Only trigger slide nav if horizontal swipe dominates
  if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) lightboxNav(diffX > 0 ? 1 : -1);
}, { passive: true });
