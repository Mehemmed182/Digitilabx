/* ===================================================================
   DIGITILABX — SHARED COMPONENTS
   Navbar, Footer — injected by JS on every page
   =================================================================== */

const NAV_LINKS = [
  { key: 'nav_home',      href: 'index.html' },
  { key: 'nav_blog',      href: 'blog.html' },
  { key: 'nav_ai_tech',   href: 'pages/ai-technology.html' },
  { key: 'nav_services',  href: 'services.html' },
  { key: 'nav_business',  href: 'pages/business.html' },
  { key: 'nav_tutorials', href: 'pages/tutorials.html' },
  { key: 'nav_about',     href: 'about.html' },
  { key: 'nav_contact',   href: 'contact.html' },
];

// Resolve relative href based on current page depth
function resolveHref(href) {
  // Normalize path
  const path = window.location.pathname.replace(/\\/g, '/');
  // Check if current file is inside a known subfolder: /blog/, /services/, /pages/
  const isSubdir = /\/(blog|services|pages)\//i.test(path);
  const prefix = isSubdir ? '../' : '';
  return prefix + href;
}

function buildNavbar() {
  const container = document.getElementById('navbar');
  if (!container) return;

  const navLinksHtml = NAV_LINKS.map(link => `
    <a class="nav-link" href="${resolveHref(link.href)}" data-i18n="${link.key}">
      ${TRANSLATIONS['en'][link.key]}
    </a>
  `).join('');

  const mobileLinksHtml = NAV_LINKS.map(link => `
    <a class="mobile-nav-link" href="${resolveHref(link.href)}" data-i18n="${link.key}">
      ${TRANSLATIONS['en'][link.key]}
    </a>
  `).join('');

  container.innerHTML = `
    <div class="nav-inner">
      <!-- Logo -->
      <a href="${resolveHref('index.html')}" class="nav-logo" aria-label="DigitilabX Home">
        <img src="${resolveHref('assets/images/logo.jpg')}" alt="DigitilabX Logo" width="36" height="36" loading="lazy">
        <span class="nav-logo-text">Digitilab<span>X</span></span>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="nav-links" role="navigation" aria-label="Main navigation">
        ${navLinksHtml}
      </nav>

      <!-- Right side actions -->
      <div class="nav-actions">
        <!-- Language Selector -->
        <div class="lang-selector" role="navigation" aria-label="Language selector">
          ${['en','az','ru','tr'].map(l => `
            <button class="lang-btn" data-lang="${l}" aria-label="Switch to ${LANG_CONFIG[l].name}">
              ${LANG_CONFIG[l].label}
            </button>
          `).join('')}
        </div>

        <!-- Search -->
        <div class="nav-search">
          <button class="search-toggle" id="searchToggle" aria-label="Search articles" aria-expanded="false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <div class="search-dropdown" id="searchDropdown" role="search">
            <input class="search-input" id="searchInput" type="search"
              data-i18n-placeholder="nav_search_placeholder"
              placeholder="Search articles..."
              aria-label="Search articles">
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('searchInput').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}))">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- CTA Button -->
        <a href="${resolveHref('contact.html')}" class="btn btn-primary btn-sm" data-i18n="nav_cta">
          Request a Service
        </a>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu" role="navigation" aria-label="Mobile navigation">
      ${mobileLinksHtml}
      <div class="mobile-lang-row">
        ${['en','az','ru','tr'].map(l => `
          <button class="lang-btn" data-lang="${l}">${LANG_CONFIG[l].label} — ${LANG_CONFIG[l].name}</button>
        `).join('')}
      </div>
      <div style="padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 8px;">
        <a href="${resolveHref('contact.html')}" class="btn btn-primary w-full" data-i18n="nav_cta" style="justify-content:center;">
          Request a Service
        </a>
      </div>
    </div>
  `;
}

function buildFooter() {
  const container = document.getElementById('footer');
  if (!container) return;

  const year = new Date().getFullYear();

  container.innerHTML = `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand -->
          <div>
            <a href="${resolveHref('index.html')}" class="nav-logo" style="margin-bottom:12px;display:inline-flex;">
              <img src="${resolveHref('assets/images/logo.jpg')}" alt="DigitilabX" width="32" height="32" loading="lazy">
              <span class="nav-logo-text">Digitilab<span>X</span></span>
            </a>
            <p class="footer-brand-tagline" data-i18n="footer_desc">
              A digital innovation and creative services platform — AI solutions, web development, design, marketing, and educational resources.
            </p>
            <p style="font-size:0.8rem;color:var(--gold);font-weight:600;font-style:italic;" data-i18n="footer_tagline">
              Ideas Into Digital Impact.
            </p>
            <div class="footer-social" style="margin-top:16px;">
              <a href="https://wa.me/994513450359" class="footer-social-btn" target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="mailto:contact@digitilabx.com" class="footer-social-btn" aria-label="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="footer-heading" data-i18n="footer_quick_links">Quick Links</h3>
            <ul class="footer-links">
              <li><a class="footer-link" href="${resolveHref('index.html')}" data-i18n="nav_home">Home</a></li>
              <li><a class="footer-link" href="${resolveHref('blog.html')}" data-i18n="nav_blog">Blog</a></li>
              <li><a class="footer-link" href="${resolveHref('services.html')}" data-i18n="nav_services">Our Services</a></li>
              <li><a class="footer-link" href="${resolveHref('about.html')}" data-i18n="nav_about">About Us</a></li>
              <li><a class="footer-link" href="${resolveHref('contact.html')}" data-i18n="nav_contact">Contact</a></li>
              <li><a class="footer-link" href="${resolveHref('pages/tutorials.html')}" data-i18n="nav_tutorials">Tutorials</a></li>
            </ul>
          </div>

          <!-- Blog Topics -->
          <div>
            <h3 class="footer-heading" data-i18n="footer_blog_cats">Blog Topics</h3>
            <ul class="footer-links">
              <li><a class="footer-link" href="${resolveHref('blog.html?cat=ai')}" data-i18n="topic_ai">Artificial Intelligence</a></li>
              <li><a class="footer-link" href="${resolveHref('blog.html?cat=tech')}" data-i18n="topic_tech">Technology</a></li>
              <li><a class="footer-link" href="${resolveHref('blog.html?cat=business')}" data-i18n="topic_business">Business</a></li>
              <li><a class="footer-link" href="${resolveHref('blog.html?cat=marketing')}" data-i18n="topic_marketing">Digital Marketing</a></li>
              <li><a class="footer-link" href="${resolveHref('blog.html?cat=webdev')}" data-i18n="topic_webdev">Web Development</a></li>
              <li><a class="footer-link" href="${resolveHref('blog.html?cat=design')}" data-i18n="topic_design">Graphic Design</a></li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h3 class="footer-heading" data-i18n="footer_services">Services</h3>
            <ul class="footer-links">
              <li><a class="footer-link" href="${resolveHref('services.html#ai-systems')}" data-i18n="svc_ai_title">AI Systems</a></li>
              <li><a class="footer-link" href="${resolveHref('services.html#web-design')}" data-i18n="svc_web_title">Web Design</a></li>
              <li><a class="footer-link" href="${resolveHref('services.html#graphic-design')}" data-i18n="svc_graphic_title">Graphic Design</a></li>
              <li><a class="footer-link" href="${resolveHref('services.html#social-media')}" data-i18n="svc_social_title">Social Media</a></li>
              <li><a class="footer-link" href="${resolveHref('services.html#branding')}" data-i18n="svc_branding_title">Branding</a></li>
              <li><a class="footer-link" href="${resolveHref('services.html#marketing')}" data-i18n="svc_marketing_title">Marketing</a></li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <p class="footer-copyright">
            © <span class="copyright-year">${year}</span> DigitilabX.
            <span data-i18n="footer_copyright" style="display:none"></span>
            All rights reserved.
          </p>
          <nav class="footer-legal" aria-label="Legal">
            <a href="${resolveHref('pages/privacy.html')}" data-i18n="footer_privacy">Privacy Policy</a>
            <a href="${resolveHref('pages/terms.html')}" data-i18n="footer_terms">Terms of Use</a>
          </nav>
        </div>
      </div>
    </footer>
  `;
}

// Auto-build when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  buildNavbar();
  buildFooter();
});
