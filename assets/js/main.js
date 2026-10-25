/* ===================================================================
   DIGITILABX — MAIN JAVASCRIPT
   Core UI logic, language switching, animations, navigation
   =================================================================== */

'use strict';

// ─── STATE ─────────────────────────────────────────────────────────
const State = {
  lang: localStorage.getItem('dlx_lang') || 'en',
  navOpen: false,
  searchOpen: false,
};

// ─── DOM READY ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initNavbar();
  initScrollReveal();
  initParticles();
  initForms();
  initSearch();
  initBlogFilters();
  initNewsletterForm();
  updateCopyrightYear();
  initBackToTop();
  initReadingProgress();
  initFaqAccordion();
  initFilterCounts();
});

// ─── LANGUAGE SYSTEM ────────────────────────────────────────────────
function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const savedLang = (urlLang && TRANSLATIONS[urlLang]) ? urlLang : (localStorage.getItem('dlx_lang') || 'en');
  applyLanguage(savedLang);

  // Wire language buttons
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      applyLanguage(lang);
    });
  });
}

function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = 'en';
  State.lang = lang;
  localStorage.setItem('dlx_lang', lang);

  const t = TRANSLATIONS[lang];
  const config = LANG_CONFIG[lang];

  // Apply html dir attribute
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', config.dir);

  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) {
      el.textContent = t[key].replace('{year}', new Date().getFullYear());
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Translate aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  // Update active language button styles
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update <title> and meta description if present
  const titleEl = document.querySelector('[data-page-title]');
  if (titleEl) {
    const titleKey = titleEl.dataset.pageTitle;
    if (t[titleKey]) document.title = t[titleKey] + ' — DigitilabX';
  }

  // Update select options if they have data-i18n-option
  document.querySelectorAll('select[data-i18n-select]').forEach(sel => {
    const key = sel.dataset.i18nSelect;
    if (t[key]) sel.options[0].text = t[key];
  });

  // Dispatch event so other parts of the page can react
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function t(key) {
  const trans = TRANSLATIONS[State.lang] || TRANSLATIONS['en'];
  return (trans[key] || TRANSLATIONS['en'][key] || key).replace('{year}', new Date().getFullYear());
}

// ─── NAVBAR ─────────────────────────────────────────────────────────
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    State.navOpen = !State.navOpen;
    toggle.classList.toggle('open', State.navOpen);
    mobileMenu?.classList.toggle('open', State.navOpen);
    document.body.style.overflow = State.navOpen ? 'hidden' : '';
  });

  // Close menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      State.navOpen = false;
      toggle?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (State.navOpen && !navbar?.contains(e.target)) {
      State.navOpen = false;
      toggle?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ─── SEARCH ─────────────────────────────────────────────────────────
function initSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchInput = document.getElementById('searchInput');

  searchToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    State.searchOpen = !State.searchOpen;
    searchDropdown?.classList.toggle('open', State.searchOpen);
    if (State.searchOpen) searchInput?.focus();
  });

  document.addEventListener('click', (e) => {
    if (State.searchOpen && !searchDropdown?.contains(e.target) && e.target !== searchToggle) {
      State.searchOpen = false;
      searchDropdown?.classList.remove('open');
    }
  });

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `blog.html?q=${encodeURIComponent(query)}`;
      }
    }
  });
}

// ─── SCROLL REVEAL ──────────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── PARTICLES ──────────────────────────────────────────────────────
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = window.innerWidth < 640 ? 8 : 18;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${6 + Math.random() * 6}s;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}

// ─── FORMS ──────────────────────────────────────────────────────────
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(contactForm)) return;

    const btn = contactForm.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = '...';

    // Simulate send (replace with real backend/form service)
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = orig;
      contactForm.reset();
      showToast(t('form_success'), 'success');
    }, 1200);
  });
}

function validateForm(form) {
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    const errEl = group?.querySelector('.form-error');
    field.classList.remove('error');
    group?.classList.remove('error');

    if (!field.value.trim()) {
      valid = false;
      group?.classList.add('error');
      if (errEl) errEl.textContent = t('form_error_required');
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
      valid = false;
      group?.classList.add('error');
      if (errEl) errEl.textContent = t('form_error_email');
    }
  });

  return valid;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── NEWSLETTER ─────────────────────────────────────────────────────
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('[type="email"]');
    if (!emailInput?.value.trim() || !isValidEmail(emailInput.value)) {
      showToast(t('form_error_email'), 'error');
      return;
    }
    emailInput.value = '';
    showToast('Thank you for subscribing! 🎉', 'success');
  });
}

// ─── BLOG FILTERS ────────────────────────────────────────────────────
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category || 'all';
      const cards = document.querySelectorAll('.article-card[data-category]');

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

// ─── TOAST ──────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icon = type === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  if (type === 'error') toast.style.borderColor = 'rgba(255,100,100,0.4)';
  document.body.appendChild(toast);

  requestAnimationFrame(() => { toast.classList.add('show'); });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ─── YEAR ────────────────────────────────────────────────────────────
function updateCopyrightYear() {
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

// ─── SMOOTH SCROLL ──────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  });
});

// ─── READING TIME ────────────────────────────────────────────────────
function calcReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// ─── BLOG SEARCH (inline) ────────────────────────────────────────────
function initBlogSearch() {
  const input = document.getElementById('blogSearchInput');
  if (!input) return;

  input.addEventListener('input', debounce(() => {
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll('.article-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !query || text.includes(query) ? 'flex' : 'none';
    });
  }, 250));
}

// ─── UTILITY ────────────────────────────────────────────────────────
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function formatDate(dateStr, lang = 'en') {
  const locales = { en: 'en-US', az: 'az-AZ', ru: 'ru-RU', tr: 'tr-TR' };
  try {
    return new Date(dateStr).toLocaleDateString(locales[lang] || 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// Export for use in other scripts
window.DLX = { t, applyLanguage, showToast, formatDate, calcReadingTime, State };

// ─── BACK TO TOP ────────────────────────────────────────────────────
function initBackToTop() {
  // Inject button if not present
  if (!document.querySelector('.back-to-top')) {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>`;
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }
}

// ─── READING PROGRESS BAR ───────────────────────────────────────────
function initReadingProgress() {
  // Only activate on article / blog pages
  const articleBody = document.querySelector('.article-content-body, .article-body-content');
  if (!articleBody) return;

  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.insertBefore(bar, document.body.firstChild);

  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / docH) * 100;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
}

// ─── FAQ ACCORDION ──────────────────────────────────────────────────
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    btn.setAttribute('aria-expanded', 'false');
  });
}

// ─── FILTER ARTICLE COUNTS ──────────────────────────────────────────
function initFilterCounts() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-category]');
  const cards = document.querySelectorAll('.article-card[data-category]');
  if (!filterBtns.length || !cards.length) return;

  const total = cards.length;

  filterBtns.forEach(btn => {
    const cat = btn.dataset.category;
    const count = cat === 'all'
      ? total
      : [...cards].filter(c => c.dataset.category === cat).length;

    if (count > 0) {
      const badge = document.createElement('span');
      badge.className = 'filter-count';
      badge.textContent = count;
      btn.appendChild(badge);
    }
  });
}

