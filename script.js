/* ==========================================================
   BAIKAL / OLKHON  —  interactions
   ========================================================== */

// ---------- LOADER ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  }, 1600);
});

// ---------- MOBILE MENU ----------
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    })
  );
}

// ---------- SCROLL REVEAL ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

// ---------- PARALLAX (hero bg + quote bg) ----------
const heroBg = document.querySelector('.hero__bg');
const quoteBg = document.querySelector('.quote__bg');
const finalBg = document.querySelector('.final__bg');

let lastScroll = 0;
let ticking = false;

function onScroll() {
  lastScroll = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Hero parallax
      if (heroBg) {
        const heroRect = heroBg.parentElement.getBoundingClientRect();
        if (heroRect.bottom > 0) {
          heroBg.style.transform = `translate3d(0, ${lastScroll * 0.35}px, 0)`;
        }
      }
      // Quote parallax (subtle)
      if (quoteBg) {
        const quoteSection = quoteBg.parentElement;
        const rect = quoteSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          const offset = (rect.top * -0.15);
          quoteBg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
        }
      }
      // Final parallax
      if (finalBg) {
        const sec = finalBg.parentElement;
        const rect = sec.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          const offset = (rect.top * -0.12);
          finalBg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
        }
      }
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- COUNTERS ----------
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.count;
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        // ease-out
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach((c) => counterObserver.observe(c));

// ---------- ACTIVE NAV LINK ON SCROLL ----------
const navLinks = document.querySelectorAll('.side-nav .nav-link');
const sections = ['about', 'stats', 'program', 'places', 'guides', 'book']
  .map(id => document.getElementById(id))
  .filter(Boolean);

function setActiveNav() {
  const y = window.scrollY + window.innerHeight * 0.3;
  let activeId = null;
  sections.forEach((sec) => {
    if (sec.offsetTop <= y) activeId = sec.id;
  });
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href === `#${activeId}`;
    link.style.color = isActive ? 'var(--ink)' : '';
    const num = link.querySelector('.num');
    if (num) num.style.color = isActive ? 'var(--accent)' : '';
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });

// ---------- SMOOTH ANCHOR (offset for topbar) ----------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------- HERO TITLE WORD-IN ----------
window.addEventListener('load', () => {
  const words = document.querySelectorAll('.hero__title .word, .hero__title .slash');
  words.forEach((w, i) => {
    w.style.opacity = '0';
    w.style.transform = 'translateY(60px)';
    w.style.transition = `opacity 1.2s var(--easing) ${0.4 + i * 0.15}s, transform 1.2s var(--easing) ${0.4 + i * 0.15}s`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        w.style.opacity = '1';
        w.style.transform = 'translateY(0)';
      }, 1700);
    });
  });
});
