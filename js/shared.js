/* Trimzy — Shared JS v3 · Premium 2026 */

// Global Placeholder for Auth Modal (Prevent race conditions)
if (typeof window.openAuthModal !== 'function') {
  window.openAuthModal = function() {
    void('Trimzy Auth: Loading modal...');
    // The real function in auth-modal.js will overwrite this when loaded.
    // If user clicks before load, we can either wait or show a simple alert.
    const checkInterval = setInterval(() => {
      if (window.openAuthModal && window.openAuthModal.isReal) {
        clearInterval(checkInterval);
        window.openAuthModal();
      }
    }, 100);
  };
}

// ══════════════════════════════════════════════
// AUTH STATE
// ══════════════════════════════════════════════
const AUTH = {
  get user() {
    try { return JSON.parse(sessionStorage.getItem('ss_user')); }
    catch { return null; }
  },
  set user(v) {
    v ? sessionStorage.setItem('ss_user', JSON.stringify(v))
      : sessionStorage.removeItem('ss_user');
  },
  logout() {
    if (typeof window.firebaseLogout === 'function') {
      window.firebaseLogout();
    } else {
      sessionStorage.removeItem('ss_user');
      location.href = '/';
    }
  }
};
window.AUTH = AUTH;

// ══════════════════════════════════════════════
// NAV — Auth-aware CTA injection
// ══════════════════════════════════════════════
window.injectAuthNav = function() {
  // Disabled: React Navbar.jsx now handles the auth CTA injection securely.
};

// Start initial injection
window.injectAuthNav();

// ── Auth Modal Logic ──
(function () {
  const loadAuthModal = () => {
    // Always load auth-modal.js to handle persistent login & listeners
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'js/auth-modal.js';
    document.head.appendChild(script);
  };

  if (typeof window.TRIMZY_CONFIG === 'undefined') {
    const configScript = document.createElement('script');
    configScript.src = 'config.js';
    configScript.onload = loadAuthModal;
    configScript.onerror = loadAuthModal; // Fallback if config is missing
    document.head.appendChild(configScript);
  } else {
    loadAuthModal();
  }
})();

function toggleUserMenu() {
  const menu = document.getElementById('nav-user-menu');
  if (menu) menu.classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const btn = document.getElementById('nav-avatar-btn');
  const menu = document.getElementById('nav-user-menu');
  if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ══════════════════════════════════════════════
// HAMBURGER / MOBILE MENU
// ══════════════════════════════════════════════
// HAMBURGER / MOBILE MENU (Handled by React Navbar.jsx)

// ── NAV — Scroll effects & SlideTabs ──
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // 1. Scroll effects
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

// 2. SlideTabs Highlighter Logic (Handled by React Navbar.jsx)
})();

// ══════════════════════════════════════════════
// SCROLL-TRIGGERED REVEALS
// ══════════════════════════════════════════════
(function () {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Auto-reveal for common elements
  document.querySelectorAll(
    '.step-card, .feat-card, .testi-card, .price-card, ' +
    '.benefit-card, .value-card, .team-card, .faq-item, ' +
    '.process-step, .story-item, .customer-perk, .perk, ' +
    '.join-step, .type-card, .earnings-card, .dash-metric'
  ).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity .6s ${i * 0.08}s cubic-bezier(.22,1,.36,1), transform .6s ${i * 0.08}s cubic-bezier(.22,1,.36,1)`;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    obs.observe(el);
  });
})();

// ══════════════════════════════════════════════
// ANIMATED COUNTERS  
// ══════════════════════════════════════════════
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const start = performance.now();

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));
})();

// ══════════════════════════════════════════════
// SMOOTH PARALLAX for hero backgrounds
// ══════════════════════════════════════════════
(function () {
  const circles = document.querySelectorAll('.hero-bg-circle, .bh-bg1, .bh-bg2, .ah-bg, .ah-bg2, .ph-bg, .al-bg1, .al-bg2');
  if (!circles.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        circles.forEach((c, i) => {
          const speed = (i % 2 === 0) ? 0.04 : 0.02;
          c.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ══════════════════════════════════════════════
// CURSOR GLOW (desktop only)
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768 || 'ontouchstart' in window) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 400px; height: 400px;
    border-radius: 50%; pointer-events: none; z-index: 9999;
    background: radial-gradient(circle, rgba(232,164,74,.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity .3s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
});

// ══════════════════════════════════════════════
// GLOBAL BLUEPRINT LOADER
// ══════════════════════════════════════════════
window.hideGlobalLoader = function() {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.classList.add('hidden');
    // Remove from DOM after transition
    setTimeout(() => {
      if (loader) {
        loader.style.display = 'none';
      }
    }, 600);
  }
};

// Default behavior: hide on full page load
window.addEventListener('load', () => {
  // Add a tiny delay to ensure a smooth transition
  setTimeout(window.hideGlobalLoader, 150);
});

