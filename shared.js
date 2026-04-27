/* Trimzy — Shared JS v3 · Premium 2026 */

// Global Placeholder for Auth Modal (Prevent race conditions)
if (typeof window.openAuthModal !== 'function') {
  window.openAuthModal = function() {
    console.log('Trimzy Auth: Loading modal...');
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
      location.href = 'index.html';
    }
  }
};

// ══════════════════════════════════════════════
// NAV — Auth-aware CTA injection
// ══════════════════════════════════════════════
window.injectAuthNav = function() {
  const user = AUTH.user;
  const navCta = document.querySelector('.nav-cta');
  if (navCta) {
    if (user) {
      const randomId = Math.floor(Math.random() * 5) + 1;
      const avatarSrc = user.profilePic || user.photoURL || `https://images.shadcnspace.com/assets/profiles/user-${randomId}.jpg`;
      
      navCta.innerHTML = `
        <div class="nav-user" id="nav-user">
          <div style="position:relative; width:fit-content; margin:0 auto;">
            <div class="nav-user-avatar" id="nav-avatar-btn" title="${user.name}" style="overflow:hidden; border:none; padding:0; background:none;">
              <img src="${avatarSrc}" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
            </div>
            <span style="position:absolute; right:-2px; bottom:-2px; display:flex; width:16px; height:16px; align-items:center; justify-content:center; border-radius:50%; background:white; pointer-events:none;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:100%;"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
            </span>
          </div>
          <div class="nav-user-menu" id="nav-user-menu">
            <div class="num-header">
              <div class="num-name">${user.name}</div>
              <div class="num-detail">${user.phone || user.email || ''}</div>
            </div>
            <div class="num-divider"></div>
            <a class="num-item" href="app.html?view=bookings">My Bookings</a>
            <a class="num-item" href="app.html">Book a Barber</a>
            <div class="num-divider"></div>
            <button class="num-item num-logout" onclick="AUTH.logout()">Log Out</button>
          </div>
        </div>
      `;
    } else {
      navCta.innerHTML = `
        <button class="btn-outline" onclick="openAuthModal()">Log In</button>
      `;
    }
  }

  const mobileMenuBtns = document.querySelector('.mobile-menu-btns');
  if (mobileMenuBtns) {
    if (user) {
      mobileMenuBtns.innerHTML = `
        <div style="text-align:center;padding:8px 0;font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:var(--gold)">${user.name}</div>
        <button class="btn-gold" onclick="location.href='app.html'">Book a Barber</button>
        <button class="btn-outline" onclick="AUTH.logout()">Log Out</button>
      `;
    } else {
      mobileMenuBtns.innerHTML = `
        <button class="btn-outline" onclick="openAuthModal()">Log In</button>
      `;
    }
  }
};

// Start initial injection
window.injectAuthNav();

// ── Auth Modal Logic ──
(function () {
  // Always load auth-modal.js to handle persistent login & listeners
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'auth-modal.js';
  document.head.appendChild(script);
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
(function () {
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

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

  // 2. SlideTabs Highlighter Logic
  const navLinks = document.querySelector('.nav-links');
  const highlighter = document.querySelector('.nav-highlighter');
  if (!navLinks || !highlighter) return;

  const links = navLinks.querySelectorAll('a');
  const activeLink = navLinks.querySelector('a.active');

  function moveHighlighter(el) {
    if (!el) {
      highlighter.style.opacity = '0';
      return;
    }
    const rect = el.getBoundingClientRect();
    const parentRect = navLinks.getBoundingClientRect();

    highlighter.style.width = `${rect.width}px`;
    highlighter.style.height = `${rect.height}px`;
    highlighter.style.left = `${rect.left - parentRect.left}px`;
    highlighter.style.top = `${rect.top - parentRect.top}px`;
    highlighter.style.opacity = '1';
  }

  // Initial position
  setTimeout(() => moveHighlighter(activeLink), 100);

  links.forEach(link => {
    link.addEventListener('mouseenter', () => moveHighlighter(link));
  });

  navLinks.addEventListener('mouseleave', () => {
    moveHighlighter(activeLink);
  });

  window.addEventListener('resize', () => moveHighlighter(activeLink));
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
