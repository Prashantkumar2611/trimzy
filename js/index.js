    // Hero particles
    (function () {
      const container = document.getElementById('hero-particles');
      if (!container || window.innerWidth < 768) return;
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        container.appendChild(p);
      }
    })();

    // Animated counter for hero stats
    (function () {
      const counters = document.querySelectorAll('[data-count]');
      counters.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = parseInt(el.dataset.count);
              const suffix = el.dataset.suffix || '';
              const prefix = el.dataset.prefix || '';
              const duration = 2200;
              const start = performance.now();

              function animate(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                let current = Math.round(target * eased);
                if (target >= 1000) {
                  el.textContent = prefix + (current / 1000).toFixed(current >= target ? 0 : 0) + 'K' + suffix;
                } else {
                  el.textContent = prefix + current + suffix;
                }
                if (progress < 1) requestAnimationFrame(animate);
              }
              requestAnimationFrame(animate);
              observer.unobserve(el);
            }
          });
        }, { threshold: 0.3 });
        observer.observe(el);
      });
    })();

    // ── HOMEPAGE LOCATION DETECTION ──
    (function () {
      // Reverse geocode using Nominatim — city level only
      async function getCity(lat, lng) {
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
          const d = await r.json();
          const a = d.address || {};
          return a.city || a.town || a.county || 'Bhubaneswar';
        } catch { return 'Bhubaneswar'; }
      }

      function applyCity(city) {
        const badge = document.getElementById('hero-city');
        const phone = document.getElementById('phone-city');
        if (badge) badge.textContent = city;
        if (phone) phone.textContent = city;
        // Hide toast
        const toast = document.getElementById('loc-toast');
        if (toast) { toast.style.opacity = '0'; toast.style.transform = 'translateY(20px)'; setTimeout(() => toast.remove(), 400); }
      }

      function detect() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
          async pos => { const city = await getCity(pos.coords.latitude, pos.coords.longitude); applyCity(city); },
          () => { applyCity('Bhubaneswar'); },
          { timeout: 8000 }
        );
      }

      function showToast() {
        // Don't show if already dismissed
        if (sessionStorage.getItem('loc_asked')) { detect(); return; }
        const toast = document.createElement('div');
        toast.id = 'loc-toast';
        toast.innerHTML = `
      <div class="lt-inner">
        <div class="lt-icon">📍</div>
        <div class="lt-text">
          <strong>Find barbers near you</strong>
          <span>Allow location access to show your city</span>
        </div>
        <button class="lt-allow" onclick="window._locAllow()">Allow</button>
        <button class="lt-skip" onclick="window._locSkip()">✕</button>
      </div>`;
        document.body.appendChild(toast);
        // Animate in (Preserving translateX for centering)
        requestAnimationFrame(() => {
          toast.style.opacity = '1';
          toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        sessionStorage.setItem('loc_asked', '1');
      }

      window._locAllow = function () { detect(); };
      window._locSkip = function () { applyCity('Bhubaneswar'); };

      // Check permission state first
      // ── HERO VIDEO OPTIMIZATION ──
      (function () {
        const video = document.getElementById('hero-video');
        if (!video) return;

        // When video is ready to play, add the loaded class for smooth fade in
        video.addEventListener('canplaythrough', () => {
          video.classList.add('loaded');
        });

        // Safety fallback: if it doesn't trigger in 2s, force show
        setTimeout(() => {
          if (!video.classList.contains('loaded')) video.classList.add('loaded');
        }, 3000);
      })();

      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(p => {
          if (p.state === 'granted') { detect(); }
          else if (p.state === 'denied') { /* do nothing */ }
          else { setTimeout(showToast, 1800); }
        });
      } else { setTimeout(showToast, 1800); }
    })();

    // ── TESTIMONIALS CAROUSEL LOGIC REMOVED (Replaced by Vertical Marquee) ──
