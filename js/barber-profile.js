    import { auth, db, doc, getDoc, getDocs, collection, query, where, addDoc, updateDoc, serverTimestamp, orderBy } from './firebase.js';
    import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    window.firebaseAuth = auth;

    // ── State ──
    let currentUser = null;
    let mode = sessionStorage.getItem('trimzy_booking_mode') || 'shop';
    let BARBER = null;
    let selectedService = { id: '1', name: 'Haircut + Wash', price: 120, dur: '30 min' };
    let selectedDate = '';
    let selectedSlot = null;
    let currentStep = 1;
    let selectedPayment = 'upi';

    // ── Load barber ──
    async function loadBarber() {
      const urlParams = new URLSearchParams(window.location.search);
      const isPreview = urlParams.get('mode') === 'preview';
      
      if (isPreview) {
        const bookCard = document.querySelector('.book-card');
        if (bookCard) {
          // Hide original steps instead of deleting them to prevent JS crashes
          const steps = ['step-service', 'step-datetime', 'step-confirm'];
          steps.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
          });
          
          // Insert Preview Badge
          const badge = document.createElement('div');
          badge.id = 'preview-badge';
          badge.innerHTML = `
            <div style="padding:40px 20px; text-align:center;">
              <div style="width:60px; height:60px; background:rgba(232,164,74,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:var(--gold);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <h3 style="font-family:'Sora',sans-serif; font-size:18px; color:var(--navy); margin-bottom:8px;">Shop Preview</h3>
              <p style="font-size:13px; color:var(--gray); line-height:1.6; margin-bottom:0;">This is how your profile appears to customers. Booking is disabled in preview mode.</p>
            </div>
          `;
          bookCard.appendChild(badge);
        }
        // Hide mobile footer
        const mobileFooter = document.querySelector('.mobile-book-footer');
        if (mobileFooter) mobileFooter.style.display = 'none';

        // Hide Navbar CTA (Login/Book button) to clean up preview
        const navCta = document.querySelector('.nav-cta');
        if (navCta) navCta.style.display = 'none';
      }

      const barberId = urlParams.get('id');
      if (!barberId) { window.location.href = 'app.html'; return; }
      
      try {
        const snap = await getDoc(doc(db, "barbers", barberId));

        if (snap.exists()) {
          BARBER = { id: snap.id, ...snap.data() };
          populatePage();
          window.generateDates();
          window.renderSlots();
          loadRealReviews(snap.id);
        } else {
          document.body.innerHTML = `
            <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);color:white;font-family:sans-serif;text-align:center;padding:20px;">
              <div>
                <div style="font-size:48px;margin-bottom:16px;">✂️</div>
                <h1 style="color:var(--gold);margin-bottom:8px;">Profile Not Found</h1>
                <p style="color:var(--gray);margin-bottom:24px;">This barber profile does not exist or has been removed.</p>
                <button onclick="window.location.href='app.html'" class="btn-gold" style="padding:12px 24px;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">Browse Barbers</button>
              </div>
            </div>
          `;
        }
      } catch (e) {
        console.error('Error loading barber:', e);
        alert('Crash inside profile code: ' + e.message);
        // window.location.href = 'app.html'; // temporarily disabled redirect to see the screen
      }
    }

    onAuthStateChanged(auth, user => {
      currentUser = user;
      if (user) {
        document.getElementById('inp-name').value = user.displayName || '';
        document.getElementById('inp-phone').value = user.phoneNumber || '';
        document.getElementById('inp-email').value = user.email || '';
      }
    });

    function populatePage() {
      const b = BARBER;
      if (!b) return;
      const shopName = b.shopName || b.name || 'Barber';
      const initials = (shopName || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      
      document.title = shopName + ' — Trimzy';
      
      // Update Name & Branding
      const bcName = document.getElementById('bc-barber-name'); if (bcName) bcName.textContent = shopName;
      const heroName = document.getElementById('hero-name'); if (heroName) heroName.textContent = shopName;
      const locName = document.getElementById('loc-name'); if (locName) locName.textContent = shopName;
      
      // Update Avatar
      const avatar = document.getElementById('hero-avatar');
      if (avatar) {
        if (b.profilePic) {
          avatar.innerHTML = `<img src="${b.profilePic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        } else {
          avatar.innerHTML = `${initials}`;
        }
      }

      // Update Hero Banner
      const bannerImg = document.getElementById('hero-banner-img');
      const bannerContainer = document.getElementById('hero-banner');
      if (bannerImg && bannerContainer) {
        if (b.salonPhotos && b.salonPhotos.length > 0) {
          bannerImg.src = b.salonPhotos[0];
          bannerImg.style.display = 'block';
          bannerContainer.style.display = 'block';
        } else if (b.profilePic) {
          bannerImg.src = b.profilePic;
          bannerImg.style.display = 'block';
          bannerContainer.style.display = 'block';
        } else {
          bannerContainer.style.display = 'none';
        }
      }

      // Update Stats
      const ratingEl = document.getElementById('hero-rating'); 
      if (ratingEl) {
        const rVal = parseFloat(b.rating);
        ratingEl.textContent = (!isNaN(rVal) ? rVal : 5.0).toFixed(1) + ' ★';
      }
      const expEl = document.getElementById('hero-experience'); if (expEl) expEl.textContent = b.experience || '1 yr';

      // Update Location
      const homeTag = document.getElementById('hero-home-tag'); if (homeTag) homeTag.style.display = b.homeVisit ? 'inline-flex' : 'none';
      const locDetail = document.getElementById('hero-loc-detail');
      if (locDetail) locDetail.textContent = b.area || b.address || 'Bhubaneswar';
      const locAddr = document.getElementById('loc-addr'); if (locAddr && b.address) locAddr.textContent = b.address;

      let _services = [];
      if (Array.isArray(b.services) && b.services.length > 0) {
        _services = b.services;
      } else if (typeof b.services === 'string' && b.services.includes('₹')) {
        try {
          _services = b.services.split(',').map(pair => {
            const parts = pair.trim().split('₹');
            return { name: parts[0].trim(), price: (parts[1] || '0').trim(), time: '30 min' };
          }).filter(s => s.name);
        } catch (e) { console.error("Legacy parse error", e); }
      }
      
      // If still empty, use a default service to avoid breaking the UI
      if (_services.length === 0) {
        _services = [{ name: 'Standard Haircut', price: b.minPrice || '100', time: '30 min' }];
      }
      
      
      const hoursVal = document.getElementById('bp-hours-val');
      if (hoursVal) {
        hoursVal.textContent = (b.startTime || '9:00 AM') + '–' + (b.endTime || '8:00 PM');
      }

      // Update Mobile Footer Price (Dynamic Min Price)
      const footerMinPrice = document.getElementById('footer-min-amount');
      if (footerMinPrice && _services.length > 0) {
        const prices = _services.map(s => parseInt(String(s.price).replace(/[^0-9]/g, '')) || 0);
        const minPrice = Math.min(...prices.filter(p => p > 0));
        if (minPrice !== Infinity) {
          footerMinPrice.textContent = '₹' + minPrice;
        }
      }

      buildServices(_services, shopName);
      
      // Universal Photo Sync: Handle multiple possible field names
      const _photos = Array.isArray(b.salonPhotos) ? b.salonPhotos : (Array.isArray(b.photos) ? b.photos : (Array.isArray(b.gallery) ? b.gallery : []));
      console.log(`[DEBUG] Photo detection: salonPhotos(${Array.isArray(b.salonPhotos) ? b.salonPhotos.length : 0}), photos(${Array.isArray(b.photos) ? b.photos.length : 0}), gallery(${Array.isArray(b.gallery) ? b.gallery.length : 0})`);
      buildGallery(_photos);
    }

    let currentGalleryPhotos = [];
    let currentPhotoIndex = 0;

    window.openLightbox = function(index) {
      if (!currentGalleryPhotos || currentGalleryPhotos.length === 0) return;
      currentPhotoIndex = index;
      updateLightboxImage();
      const overlay = document.getElementById('lightbox-overlay');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    window.closeLightbox = function() {
      const overlay = document.getElementById('lightbox-overlay');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    window.lightboxNext = function() {
      if (currentPhotoIndex < currentGalleryPhotos.length - 1) {
        currentPhotoIndex++;
        updateLightboxImage();
      }
    }

    window.lightboxPrev = function() {
      if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updateLightboxImage();
      }
    }

    function updateLightboxImage() {
      const img = document.getElementById('lightbox-img');
      const caption = document.getElementById('lightbox-caption');
      if (img && currentGalleryPhotos[currentPhotoIndex]) {
        img.src = currentGalleryPhotos[currentPhotoIndex];
        if (caption) caption.textContent = `Photo ${currentPhotoIndex + 1} of ${currentGalleryPhotos.length}`;
      }
    }

    function buildGallery(photos) {
      const container = document.getElementById('barber-gallery');
      if (!container) return;
      
      const photoArray = Array.isArray(photos) ? photos : [];
      currentGalleryPhotos = photoArray;
      console.log(`[DEBUG] Rendering gallery with ${photoArray.length} photos.`);
      
      if (photoArray.length === 0) return; // Keep demo if truly empty

      // FORCE CLEAR: Remove all static placeholders (+8 more etc.)
      container.innerHTML = '';
      
      container.innerHTML = photoArray.map((url, i) => `
        <div class="gallery-item" style="${i===0 ? 'grid-column:span 2;grid-row:span 2' : ''}; cursor: pointer; transition: transform 0.2s;" onclick="openLightbox(${i})" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
          <img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;image-rendering:-webkit-optimize-contrast;image-rendering:high-quality" alt="Salon photo ${i+1}">
        </div>
      `).join('');
    }

    function buildServices(services, shopName) {
      const listEl = document.getElementById('services-list');
      const miniListEl = document.getElementById('footer-services-list');
      if (!listEl) return;

      if (!services || !services.length) {
        listEl.innerHTML = '<p style="color:#888;font-size:13px;font-style:italic">No specific services listed. Contact barber for details.</p>';
        return;
      }

      // Render main list
      listEl.innerHTML = services.map((s, i) => `
        <div class="service-row ${i === 0 ? 'selected' : ''}" 
             onclick="window.selectServiceItem('${s.name}', '${s.price}', '${s.time}', this)">
            <div class="service-left">
              <div class="service-name">${s.name}</div>
              <div class="service-dur">${s.time || '30 min'}</div>
            </div>
            <div class="service-price">₹${s.price}</div>
            <div class="service-select-btn"></div>
        </div>
      `).join('');

      // Render mini list in footer
      if (miniListEl) {
        miniListEl.innerHTML = services.map((s, i) => `
          <div class="service-mini-item ${i===0?'sel':''}" onclick="window.selectServiceItem('${s.name}', '${s.price}', '${s.time}', this, true)">
            <div style="display:flex; align-items:center;">
              <div class="s-radio"></div>
              <div class="service-mini-name" style="font-family:'Inter',sans-serif; font-size:14px; color:#000; font-weight:500;">${s.name} - ${s.time || '30 min'}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="service-mini-price" style="font-family:'Inter',sans-serif; font-size:14px; color:#000; font-weight:700;">₹${s.price}</span>
              <svg class="sel-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>`).join('');
      }
      
      // Initialize default selection safely
      const firstSvc = services[0];
      if (firstSvc) {
        selectedService = { id: '1', name: firstSvc.name, price: parseInt(firstSvc.price) || 0, dur: firstSvc.time || '30 min' };
        window.updatePriceButtons();
      }
    }

    async function saveBookingFn({ name, phone, email, notes, address, paymentMethod, paymentStatus, razorpayId }) {
      // PREVIEW LOCKDOWN
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') === 'preview') {
        showToast("Cannot book in Preview Mode", "info");
        return;
      }

      // NUCLEAR LOCKDOWN: Stop any anonymous database saves
      if (!currentUser) {
        console.error("[SECURITY] Blocking anonymous save attempt. Redirecting to login.");
        if (typeof window.openAuthModal === 'function') {
          window.openAuthModal();
          showToast("Session expired. Please login to complete your booking.", "error");
        }
        return;
      }

      try {
        const shopName = BARBER.shopName || BARBER.name || 'Barber';
        const initials = (shopName || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const docRef = await addDoc(collection(db, "bookings"), {
          barberId: BARBER.id,
          userId: currentUser.uid, // Mandatory UID
          customerName: name,
          customerPhone: phone,
          serviceName: selectedService.name,
          price: selectedService.price,
          scheduledAt: selectedDate + ' ' + selectedSlot,
          status: 'upcoming',
          paymentMethod: paymentMethod || 'cash',
          paymentStatus: paymentStatus || 'pending',
          razorpayId: razorpayId || null,
          pin,
          createdAt: serverTimestamp(),
          // Metadata for history
          barberName: shopName,
          barberGradient: BARBER.gradient || 'var(--gold)',
          barberInitials: initials,
          barberProfilePic: BARBER.profilePic || ''
        });

        document.getElementById('ss-card').innerHTML = `
          <div class="ss-row"><span class="ss-row-label">Service</span><span class="ss-row-value">${selectedService.name}</span></div>
          <div class="ss-row"><span class="ss-row-label">When</span><span class="ss-row-value">${selectedDate}, ${selectedSlot}</span></div>
          <div class="ss-row"><span class="ss-row-label">Trip PIN</span><span class="ss-row-value" style="background:rgba(232, 164, 74, .1);color:var(--gold);padding:4px 12px;border-radius:6px;font-weight:800;font-size:18px;letter-spacing:2px">${pin}</span></div>
        `;
        document.getElementById('ss-id').textContent = 'ID: ' + docRef.id.slice(0,8).toUpperCase();
        document.getElementById('success-screen').classList.add('show');
      } catch (err) {
        alert('Booking failed. Please try again.');
        console.error(err);
      }
    }

    async function loadRealReviews(barberId) {
      // Collect all possible IDs this barber might have reviews under
      const possibleIds = new Set([barberId]);
      if (BARBER) {
        if (BARBER.id) possibleIds.add(BARBER.id);
        if (BARBER.uid) possibleIds.add(BARBER.uid);
      }
      // Also include the URL param in case it differs
      const urlId = new URLSearchParams(window.location.search).get('id');
      if (urlId) possibleIds.add(urlId);

      console.log('[REVIEWS] Querying reviews for all possible barberIds:', [...possibleIds]);

      try {
        // Query for each possible ID and merge results (deduplicate by doc ID)
        const reviewMap = new Map();
        for (const id of possibleIds) {
          const q = query(collection(db, "reviews"), where("barberId", "==", id));
          const snap = await getDocs(q);
          snap.docs.forEach(d => {
            if (!reviewMap.has(d.id)) reviewMap.set(d.id, { id: d.id, ...d.data() });
          });
        }

        console.log('[REVIEWS] Total unique reviews found:', reviewMap.size);

        const container = document.getElementById('reviews-container');
        const seeAllWrap = document.getElementById('see-all-container');
        const seeAllBtn = document.getElementById('btn-see-all');
        const ratingOverview = document.getElementById('rating-overview');
        const noReviewsOverview = document.getElementById('no-reviews-overview');

        if (reviewMap.size === 0) {
          container.innerHTML = '';
          if (seeAllWrap) seeAllWrap.style.display = 'none';
          if (ratingOverview) ratingOverview.style.display = 'none';
          if (noReviewsOverview) noReviewsOverview.style.display = 'block';
          return;
        }

        // Sort manually by createdAt (descending)
        const allReviews = [...reviewMap.values()].sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return tB - tA;
        });

        // ── Compute & Render Rating Overview (Dynamic) ──
        let sum = 0;
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        allReviews.forEach(r => {
          const rate = Math.min(5, Math.max(1, r.rating || 5));
          sum += rate;
          dist[rate] = (dist[rate] || 0) + 1;
        });
        const avg = allReviews.length > 0 ? (sum / allReviews.length) : 0;
        const total = allReviews.length;

        // Show the overview, hide the empty placeholder
        if (ratingOverview) ratingOverview.style.display = 'flex';
        if (noReviewsOverview) noReviewsOverview.style.display = 'none';

        // Populate average
        const avgEl = document.getElementById('review-avg');
        if (avgEl) avgEl.textContent = avg.toFixed(1);

        // Populate stars
        const starsEl = document.getElementById('review-stars');
        if (starsEl) {
          const fullStars = Math.round(avg);
          starsEl.textContent = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
        }

        // Populate distribution bars
        const barsEl = document.getElementById('rating-bars');
        if (barsEl) {
          barsEl.innerHTML = ''; // Removed rating bars for new minimalist design
        }

        // Populate count
        const countEl = document.getElementById('review-count');
        if (countEl) countEl.textContent = total;

        // Also update the hero rating badge
        const heroRating = document.getElementById('hero-rating');
        if (heroRating) heroRating.textContent = avg.toFixed(1) + ' ★';

        // ── Render Review Cards ──
        const displayReviews = allReviews; // Show all for masonry layout
        
        container.innerHTML = displayReviews.map(r => {
          const rawName = (r.customerName && r.customerName !== 'Customer') ? r.customerName : 'Verified Guest';
          const initials = rawName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          
          let dateStr = 'Recently';
          if (r.createdAt) {
            const date = r.createdAt.toDate ? r.createdAt.toDate() : new Date(r.createdAt.seconds * 1000);
            dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
          }

          const starsHtml = '★'.repeat(Math.min(5, Math.max(1, r.rating || 5)));
          const comment = r.comment || 'Great service!';

          return `<div class="review">
            <div class="review-avatar">${initials}</div>
            <div class="review-details">
              <div class="review-name-stars">
                ${initials} - ${rawName} <span class="review-stars-inline">${starsHtml}</span>
              </div>
              <div class="review-text-date">
                ${comment} - <span>${dateStr}</span>
              </div>
            </div>
          </div>`;
        }).join('');

        // Show/Hide See All
        if (allReviews.length > 3) {
          if (seeAllWrap) seeAllWrap.style.display = 'block';
          if (seeAllBtn) {
            seeAllBtn.onclick = () => {
              window.location.href = `reviews.html?id=${barberId}`;
            };
          }
        } else {
          if (seeAllWrap) seeAllWrap.style.display = 'none';
        }

      } catch (err) {
        console.error('[REVIEWS] Load error:', err);
        const container = document.getElementById('reviews-container');
        if (container) container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--gray)">Reviews temporarily unavailable.</div>';
      }
    }

    // Initialize...
    loadBarber();

    // ── Exported helpers ──
    window.scrollToBook = () => {
      const el = document.getElementById('step-service');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    window.selectServiceItem = (name, price, time, el, isMini = false) => {
      // Update data
      selectedService = { id: '1', name, price: parseInt(price), dur: time };
      
      // Update UI - Main List
      document.querySelectorAll('.service-row').forEach(r => r.classList.remove('selected'));
      // Update UI - Mini List
      document.querySelectorAll('.service-mini-item').forEach(r => r.classList.remove('sel'));

      if (isMini) {
        el.classList.add('sel');
        // Find corresponding main list item if it exists
        const mainRows = document.querySelectorAll('.service-row');
        mainRows.forEach(r => {
           const nameEl = r.querySelector('.service-name');
           if (nameEl && nameEl.textContent === name) r.classList.add('selected');
        });
      } else {
        el.classList.add('selected');
        // Find corresponding mini list item if it exists
        const miniItems = document.querySelectorAll('.service-mini-item');
        miniItems.forEach(r => {
           const miniNameEl = r.querySelector('.service-mini-name');
           if (miniNameEl && miniNameEl.textContent === name) r.classList.add('sel');
        });
      }
      
      window.updatePriceButtons();
    };
    window.updatePriceButtons = () => {
      const btn1 = document.getElementById('btn1-price');
      const payTotal = document.getElementById('pay-total-display');
      
      if (btn1) btn1.textContent = '₹' + selectedService.price;
      if (payTotal) payTotal.textContent = '₹' + selectedService.price;

      // Update Mobile Footer Price (Sync with selection)
      const footerMinPrice = document.getElementById('footer-min-amount');
      const footerLabel = document.getElementById('footer-min-label');
      if (footerMinPrice) footerMinPrice.textContent = '₹' + selectedService.price;
      if (footerLabel) footerLabel.textContent = 'Total';
    };
    window.attemptGoToStep3 = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') === 'preview') {
        showToast("Cannot proceed in Preview Mode", "info");
        return;
      }
      const user = auth.currentUser;
      if (!user) {
        if (typeof window.openAuthModal === 'function') {
          window.openAuthModal();
          showToast("Please login to continue booking", "info");
        } else {
          showToast("Login required", "error");
        }
        return;
      }

      // Populate booking summary when entering step 3
      const summaryRows = document.getElementById('summary-rows');
      if (summaryRows) {
        summaryRows.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="color:var(--gray); font-size:13px;">Service</span>
            <span style="font-weight:600; color:var(--navy); font-size:13px;">${selectedService.name}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="color:var(--gray); font-size:13px;">Date</span>
            <span style="font-weight:600; color:var(--navy); font-size:13px;">${new Date(selectedDate).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--gray); font-size:13px;">Time</span>
            <span style="font-weight:600; color:var(--navy); font-size:13px;">${selectedSlot}</span>
          </div>
        `;
      }
      goToStep(3);
    };

    window.attemptGoToStep4 = () => {
      const name = document.getElementById('inp-name').value;
      const phone = document.getElementById('inp-phone').value;
      if (!name || !phone) { showToast("Name and phone required", "error"); return; }
      goToStep(4);
    };

    window.goToStep = (n) => {
      document.getElementById('step-service').style.display = n === 1 ? 'block' : 'none';
      document.getElementById('step-datetime').style.display = n === 2 ? 'block' : 'none';
      document.getElementById('step-details').style.display = n === 3 ? 'block' : 'none';
      document.getElementById('step-payment').style.display = n === 4 ? 'block' : 'none';

      const tabs = ['tab-service', 'tab-datetime', 'tab-details', 'tab-payment'];
      tabs.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          if (idx + 1 === n) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
          // Remove old inline styles to prevent CSS conflicts
          el.style.background = '';
          el.style.color = '';
          el.style.border = '';
          el.style.borderRight = '';
        }
      });
    };
    window.submitBooking = async () => {
      // AUTH GUARD: Ensure user is logged in before they can pay/book
      const user = auth.currentUser;
      if (!user) {
        if (typeof window.openAuthModal === 'function') {
          window.openAuthModal();
          showToast("Please login to book a barber", "info");
        } else {
          showToast("Login required for booking", "error");
        }
        return;
      }

      const name = document.getElementById('inp-name').value;
      const phone = document.getElementById('inp-phone').value;
      if (!name || !phone) { showToast('Name and phone required', 'error'); return; }

      const email = document.getElementById('inp-email') ? document.getElementById('inp-email').value : user.email;
      const notes = document.getElementById('inp-notes') ? document.getElementById('inp-notes').value : '';
      const address = document.getElementById('inp-address') ? document.getElementById('inp-address').value : '';

      const btnSubmit = document.getElementById('btn-submit');
      if (btnSubmit) {
        btnSubmit.querySelector('.btn-text').style.display = 'none';
        btnSubmit.querySelector('.btn-loader').style.display = 'inline-block';
        btnSubmit.disabled = true;
      }

      // Proceed with user details
      saveBookingFn({ 
        name: name || user.displayName || 'Customer', 
        phone: phone || user.phoneNumber || '', 
        email: email || '', 
        notes: notes, 
        address: address, 
        paymentMethod: selectedPayment || 'cash', 
        paymentStatus: 'pending' 
      });
    };

    // ── Missing Booking Flow Logic ──
    window.generateDates = () => {
      const scroll = document.getElementById('date-scroll');
      if (!scroll) return;
      const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
      let html = '';
      const today = new Date();
      for(let i=0; i<5; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        const isToday = i === 0;
        if (isToday) selectedDate = iso;
        html += `
          <button class="date-btn ${isToday?'active':''}" data-date="${iso}" onclick="selectDate(this)">
            <div class="date-btn-day">${days[d.getDay()]}</div>
            <div class="date-btn-num">${d.getDate()}</div>
          </button>`;
      }
      scroll.innerHTML = html;
    };

    window.selectDate = (el) => {
      document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      selectedDate = el.dataset.date;
      selectedSlot = null;
      document.getElementById('btn-confirm').disabled = true;
      window.renderSlots();
    };

    window.renderSlots = () => {
      const grid = document.getElementById('slot-grid');
      if (!grid || !BARBER) return;
      
      const startStr = BARBER.startTime || '09:00 AM';
      const endStr = BARBER.endTime || '08:00 PM';
      
      const parseTime = (str) => {
        const [time, period] = str.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };

      const formatTime = (totalMin) => {
        let h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        const period = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
      };

      const startMin = parseTime(startStr);
      const endMin = parseTime(endStr);
      const slots = [];
      
      // Generate 30min slots from shift start to shift end
      // Note: We stop before the end time (e.g. if shop closes at 9PM, last slot is 8:30PM)
      for (let m = startMin; m < endMin; m += 30) {
        slots.push(formatTime(m));
      }
      
      // Real-time filtering for 'Today'
      const now = new Date();
      const todayIso = now.toISOString().split('T')[0];
      const isToday = (selectedDate === todayIso);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const availableSlots = slots.filter(s => {
        if (!isToday) return true;
        const slotMinutes = parseTime(s);
        // Show only if slot is at least 15 mins in future
        return slotMinutes > (currentMinutes + 15);
      });

      if (availableSlots.length === 0 && isToday) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:20px;color:var(--gray);font-size:14px;">No more slots available for today. Please pick a future date!</div>`;
        return;
      }

      grid.innerHTML = availableSlots.map(s => {
        const active = selectedSlot === s ? 'active' : '';
        return `<button class="slot-btn ${active}" onclick="selectSlot(this, '${s}')">${s}</button>`;
      }).join('');
    };

    window.selectSlot = (el, time) => {
      document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      selectedSlot = time;
      document.getElementById('btn-confirm').disabled = false;
    };
    
    window.joinQueue = () => {
      alert('Virtual Queue joined! We will notify you when it is your turn.');
    };

    window.selectPayment = (pay) => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      document.getElementById('po-' + pay).classList.add('selected');
      selectedPayment = pay;
    };

    // ── Maintenance: One-time Name Repair ──
    window.repairReviewNames = async () => {
      if(!confirm("This will find all 'Customer' reviews and try to fix their names from the original bookings. Continue?")) return;
      const q = query(collection(db, "reviews"), where("customerName", "==", "Customer"));
      const snap = await getDocs(q);
      let count = 0;
      for(const d of snap.docs) {
        const r = d.data();
        if(r.bookingId) {
          const bSnap = await getDoc(doc(db, "bookings", r.bookingId));
          if(bSnap.exists() && bSnap.data().customerName) {
            await updateDoc(d.ref, { customerName: bSnap.data().customerName });
            count++;
          }
        }
      }
      alert(`Success! Repaired ${count} review names. Please refresh the page.`);
    };
    // ── Navigation Highlighter ──
    (function() {
      const pill = document.getElementById('nav-pill');
      const highlighter = document.getElementById('nav-highlighter');
      const links = pill.querySelectorAll('a');

      function moveHighlighter(target) {
        if (!target) {
          highlighter.style.opacity = '0';
          return;
        }
        highlighter.style.opacity = '1';
        highlighter.style.width = `${target.offsetWidth}px`;
        highlighter.style.height = `${target.offsetHeight}px`;
        highlighter.style.left = `${target.offsetLeft}px`;
        highlighter.style.top = `${target.offsetTop}px`;
      }

      links.forEach(link => {
        link.addEventListener('mouseenter', () => moveHighlighter(link));
      });

      pill.addEventListener('mouseleave', () => {
        highlighter.style.opacity = '0';
      });
    })();
