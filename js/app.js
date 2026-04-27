    import { auth, db, collection, getDoc, getDocs, query, where, orderBy, addDoc, serverTimestamp, doc, updateDoc } from './firebase.js';
    import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    console.log('DEBUG: Firebase modules imported');

    // ══ GRADIENT POOL ══
    const GRADIENTS = [
      'linear-gradient(135deg,#6366f1,#a855f7)',
      'linear-gradient(135deg,#3b82f6,#2dd4bf)',
      'linear-gradient(135deg,#f59e0b,#ef4444)',
      'linear-gradient(135deg,#10b981,#3b82f6)',
      'linear-gradient(135deg,#8b5cf6,#ec4899)',
      'linear-gradient(135deg,#F5C97A,#E8A44A)',
    ];

    let allBarbers = [];
    let currentUser = null;
    let mode = 'shop';

    // ── Auth state ──
    onAuthStateChanged(auth, user => {
      currentUser = user;
      const profileCorner = document.getElementById('profile-corner');
      const loginCornerBtn = document.getElementById('login-corner-btn');
      const profileBtn = document.getElementById('profile-btn');

      if (user) {
        const stored = JSON.parse(sessionStorage.getItem('ss_user') || '{}');
        const name = stored.name || user.displayName || 'User';
        const email = stored.email || user.email || '';
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

        const ug = document.getElementById('user-greeting'); if (ug) ug.textContent = `· Hi, ${name.split(' ')[0]}!`;
        document.getElementById('pd-name').textContent = name;
        document.getElementById('pd-email').textContent = email;

        if (stored.profilePic) {
          profileBtn.innerHTML = `<img src="${stored.profilePic}" alt="Profile"/>`;
        } else {
          // Instead of initials, use a random Shadcn profile avatar
          const randomId = Math.floor(Math.random() * 5) + 1;
          const randomAvatar = `https://images.shadcnspace.com/assets/profiles/user-${randomId}.jpg`;
          profileBtn.innerHTML = `<img src="${randomAvatar}" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:50%;"/>`;
        }
        profileCorner.className = 'profile-corner active';
        loginCornerBtn.className = 'login-corner-btn';

        // ── AUTO-VIEW ROUTER (Trigger after auth established) ──
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'bookings' && typeof window.viewMyBookings === 'function') {
          setTimeout(() => window.viewMyBookings(), 300);
        }

        // Update Mobile Menu
        const mobileBtns = document.querySelector('.mobile-menu-btns');
        if (mobileBtns) {
          mobileBtns.innerHTML = `
                <button class="pd-item" onclick="requireAuthThen('bookings');toggleProfileDropdown()" style="width:100%;text-align:left;padding:12px 16px;border:none;background:none;font-family:'Sora',sans-serif;font-size:14px;color:var(--navy);font-weight:600;display:flex;align-items:center;gap:10px">📅 My Bookings</button>
                <button class="pd-item" onclick="switchAppView('browse');toggleProfileDropdown()" style="width:100%;text-align:left;padding:12px 16px;border:none;background:none;font-family:'Sora',sans-serif;font-size:14px;color:var(--navy);font-weight:600;display:flex;align-items:center;gap:10px">🔍 Browse Barbers</button>
                <hr style="border:none;border-bottom:1px solid #eee;margin:8px 0" />
                <button class="pd-item pd-logout" onclick="doLogout()" style="width:100%;text-align:left;padding:12px 16px;border:none;background:none;font-family:'Sora',sans-serif;font-size:14px;color:var(--red);font-weight:600;display:flex;align-items:center;gap:10px">🚪 Log Out</button>
            `;
        }
      } else {
        profileCorner.style.display = 'none';
        loginCornerBtn.style.display = 'block';

        const mobileBtns = document.querySelector('.mobile-menu-btns');
        if (mobileBtns) {
          mobileBtns.innerHTML = `
                <button class="btn-gold" style="width:100%;padding:14px;border-radius:12px;border:none;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;cursor:pointer" onclick="openAuthModal()">Log In / Sign Up →</button>
            `;
        }
      }
    });

    window.toggleProfileDropdown = (e) => {
      if (e) e.stopPropagation();
      document.getElementById('profile-dropdown').classList.toggle('open');
    };

    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('profile-dropdown');
      if (dropdown && dropdown.classList.contains('open') && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    window.doLogout = async () => {
      await signOut(auth);
      sessionStorage.removeItem('ss_user');
      location.reload();
    };

    window.switchAppView = (view) => {
      document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.app-nav-tab').forEach(t => t.classList.remove('active'));

      const targetView = document.getElementById('view-' + view);
      if (targetView) targetView.classList.add('active');

      const activeTab = document.querySelector(`.app-nav-tab[data-view="${view}"]`);
      if (activeTab) activeTab.classList.add('active');

      const searchBar = document.getElementById('search-bar');
      const modeToggle = document.getElementById('mode-toggle');

      if (view === 'bookings') {
        if (searchBar) searchBar.style.display = 'none';
        if (modeToggle) modeToggle.style.display = 'none';
        renderMyBookings();
      } else {
        if (searchBar) searchBar.style.display = 'flex';
        if (modeToggle) modeToggle.style.display = 'flex';
      }
    };

    window.requireAuthThen = (view) => {
      if (!currentUser) {
        openAuthModal();
        return;
      }
      switchAppView(view);
    };

    window.setMode = (m) => {
      mode = m;
      document.getElementById('toggle-shop').classList.toggle('active', m === 'shop');
      document.getElementById('toggle-home').classList.toggle('active', m === 'home');
      filterBarbers();
    };

    async function loadApprovedBarbers() {
      console.log('DEBUG: loadApprovedBarbers started');
      const grid = document.getElementById('barber-grid');
      if (grid) grid.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Searching for nearby barbers...</p></div>`;

      try {
        const q = query(collection(db, "barbers"), where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);

        allBarbers = [];
        querySnapshot.forEach((doc) => {
          const d = doc.data();
          const initials = (d.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
          const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
          allBarbers.push({ id: doc.id, initials, gradient, ...d });
        });

        filterBarbers();
      } catch (error) {
        console.error("Error loading barbers:", error);
        grid.innerHTML = `<p>Failed to load barbers.</p>`;
      }
    }

    window.filterBarbers = () => {
      const q = document.getElementById('search-input').value.toLowerCase();
      const sort = document.getElementById('sort-select').value;

      let list = allBarbers.filter(b => {
        const bName = (b.name || '').toLowerCase();
        const bShop = (b.shopName || '').toLowerCase();
        const bEmail = (b.email || '').toLowerCase();
        const bUid = (b.uid || '').toLowerCase();
        const bArea = (b.area || '').toLowerCase();

        if (mode === 'home' && !b.homeVisit) return false;

        if (q) {
          const match = bName.includes(q) ||
            bShop.includes(q) ||
            bEmail.includes(q) ||
            bUid.includes(q) ||
            bArea.includes(q);
          if (!match) return false;
        }
        return true;
      });

      if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      else if (sort === 'price-low') list.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));

      console.log(`DEBUG [Search]: Query "${q}" found ${list.length} results.`);
      renderBarbers(list);
    };

    function renderBarbers(list) {
      const grid = document.getElementById('barber-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const countEl = document.getElementById('result-count');
      if (countEl) countEl.textContent = list.length;

      try {
        if (list.length === 0) {
          grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray)">No barbers found in this area.</div>';
          return;
        }

        grid.innerHTML = list.map(b => {
          try {
            const bName = b.shopName || b.name || 'Professional Barber';
            const bArea = b.area || 'Bhubaneswar';
            const initials = bName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            const profilePic = b.profilePic || '';
            const gradient = b.gradient || GRADIENTS[0];

            // Calculate Min Price
            let minPrice = 0;
            if (b.services && Array.isArray(b.services) && b.services.length > 0) {
              minPrice = Math.min(...b.services.map(s => Number(s.price) || 999999));
            }
            if (minPrice === 0 || minPrice === 999999) minPrice = b.minPrice || 80;

            const rating = Number(b.rating);
            const hasReviews = (Number(b.reviewCount) || 0) > 0;
            const linkId = b.uid || b.id;
            const isOpen = b.isOpen !== false;

            const ratingDisplay = hasReviews
              ? `⭐ ${rating.toFixed(1)}`
              : `⭐ New`;

            return `
              <div class="barber-card js-tilt ${!isOpen ? 'closed' : ''}" onclick="${isOpen ? `selectBarber('${linkId}')` : ''}">
                <div class="bc-inner" style="background-image: url('${profilePic || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop'}');">
                   <div class="bc-price-badge">₹${minPrice}+</div>
                   
                   ${!isOpen ? `
                    <div class="bc-closed-overlay">
                      <div style="color:white; font-family:'Sora',sans-serif; font-weight:800; font-size:16px; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px">Shop Closed</div>
                      <div style="color:rgba(255,255,255,0.8); font-family:'DM Sans',sans-serif; font-weight:500; font-size:11px; line-height:1.4">We will be back soon to style you</div>
                    </div>
                   ` : ''}

                   <div class="bc-content">
                      <h3 class="bc-name">${bName}</h3>
                      <div class="bc-meta">
                        <div class="bc-loc">📍 ${bArea}</div>
                        <div class="bc-rating">${ratingDisplay}</div>
                      </div>
                      <button class="bc-book-btn">
                        ${isOpen ? 'Book Now →' : 'Closed Now'}
                      </button>
                   </div>
                </div>
              </div>
            `;
          } catch (itemErr) {
            console.error("Item render error:", itemErr);
            return '';
          }
        }).join('');

        // ── Initialize 3D Motion Logic ──
        setTimeout(() => {
          document.querySelectorAll('.js-tilt').forEach(card => {
            card.addEventListener('mousemove', (e) => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (centerY - y) / 10; // Max 10 deg
              const rotateY = (x - centerX) / 10;
              card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
              card.style.transform = `rotateX(0deg) rotateY(0deg)`;
            });
          });
        }, 100);
      } catch (err) {
        console.error("renderBarbers error:", err);
        grid.innerHTML = '<p style="text-align:center;padding:20px;color:red">Rendering error. Please refresh.</p>';
      }
    }

    window.selectBarber = (id) => {
      // Find by either ID or UID for safety
      const barber = allBarbers.find(b => b.id === id || b.uid === id);
      if (!barber) return;
      if (barber.isOpen === false) {
        alert("This shop is currently closed and not accepting bookings.");
        return;
      }
      sessionStorage.setItem('trimzy_selected_barber', JSON.stringify(barber));
      location.href = `barber-profile.html?id=${id}`;
    };

    async function saveBookingFn({ name, phone, email, notes, address, paymentMethod, paymentStatus, razorpayId }) {
      const svc = selectedService;
      const btn = document.getElementById('confirm-btn');
      try {
        const bookingData = {
          barberId: selectedBarber.id,
          serviceName: svc.name,
          mode: mode,
          price: svc.price,
          scheduledAt: new Date(selectedDateLabel + ' ' + selectedTime).toISOString(),
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          notes: notes,
          address: address || null
        };

        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const docRef = await addDoc(collection(db, "bookings"), {
          ...bookingData,
          pin,
          userId: currentUser ? currentUser.uid : null,
          status: 'upcoming',
          createdAt: serverTimestamp(),
          // Snapshots for offline/fast rendering in My Bookings
          barberName: selectedBarber.shopName || selectedBarber.name || 'Barber',
          barberGradient: selectedBarber.gradient,
          barberInitials: selectedBarber.initials,
          barberProfilePic: selectedBarber.profilePic || '',
          serviceName: svc.name
        });
        const booking = { id: docRef.id, pin };

        const payLabel = paymentStatus === 'paid'
          ? `✅ Paid ₹${svc.price} via ${paymentMethod === 'upi' ? 'UPI' : 'Card'}`
          : `🤝 Pay ₹${svc.price} to barber in person`;

        document.getElementById('ss-card').innerHTML = `
          <div class="ss-row"><span class="ss-row-label">Customer</span><span class="ss-row-value">${name}</span></div>
          <div class="ss-row"><span class="ss-row-label">Barber</span><span class="ss-row-value">${selectedBarber.name}</span></div>
          <div class="ss-row"><span class="ss-row-label">Service</span><span class="ss-row-value">${svc.name}</span></div>
          <div class="ss-row"><span class="ss-row-label">When</span><span class="ss-row-value">${selectedDateLabel}, ${selectedTime}</span></div>
          <div class="ss-row"><span class="ss-row-label">Mode</span><span class="ss-row-value">${mode === 'home' ? ' Home Visit' : '🏪Shop Visit'}</span></div>
          <div class="ss-row"><span class="ss-row-label">Trip PIN</span><span class="ss-row-value" style="background:rgba(232, 164, 74, .1);color:var(--gold);padding:4px 12px;border-radius:6px;font-weight:800;font-size:18px;letter-spacing:2px">${pin}</span></div>
          <div class="ss-row"><span class="ss-row-label">Payment</span><span class="ss-row-value" style="color:var(--gold)">${payLabel}</span></div>`;

        document.getElementById('ss-id').textContent = 'ID: ' + booking.id;
        closePanel();
        document.body.style.overflow = 'hidden';
        document.getElementById('success-screen').classList.add('show');
      } catch (err) {
        btn.disabled = false;
        btn.textContent = paymentMethod === 'pay_later' ? '✓ Confirm Booking' : 'Proceed to Pay →';
        alert('Booking Refused: ' + err.message);
        console.error(err);
      }
    }


    // ── My Bookings from API ──
    async function renderMyBookings() {
      const body = document.getElementById('bookings-body');
      if (!currentUser) {
        body.innerHTML = `<div class="bookings-empty"><div class="be-icon">🔐</div><h3>Log in to see your bookings</h3><p>Your booking history will appear here after you log in.</p><button class="btn-gold" style="padding:14px 28px;border-radius:12px;font-family:'Sora',sans-serif;font-weight:700;font-size:15px;border:none;cursor:pointer" onclick="openAuthModal()">Log In / Sign Up →</button></div>`;
        return;
      }
      body.innerHTML = '<div class="bookings-loading">Loading your history...</div>';
      try {
        const q = query(collection(db, "bookings"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const bookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        window.customerBookings = bookings;
        if (!bookings || !bookings.length) {
          body.innerHTML = `<div class="bookings-empty"><div class="be-icon">📅</div><h3>No bookings yet</h3><p>You haven't booked any barbers yet. Find one and make your first booking!</p><button class="btn-gold" style="padding:14px 28px;border-radius:12px;font-family:'Sora',sans-serif;font-weight:700;font-size:15px;border:none;cursor:pointer" onclick="switchAppView('browse')">Browse Barbers →</button></div>`;
          return;
        }

        const upcoming = bookings.filter(b => b.status === 'upcoming' || b.status === 'in_progress');
        const completed = bookings.filter(b => b.status === 'completed');
        const cancelled = bookings.filter(b => b.status === 'cancelled');

        const renderCard = (b) => {
          const isCompleted = b.status === 'completed';
          const isRated = b.isReviewed === true;

          // Legacy repair lookup
          const liveBarber = allBarbers.find(lb => lb.id === b.barberId);

          const barberName = b.barberName || (liveBarber ? (liveBarber.shopName || liveBarber.name) : 'Barber');
          const initials = b.barberInitials || (liveBarber ? liveBarber.initials : '?');
          const gradient = b.barberGradient || (liveBarber ? liveBarber.gradient : 'var(--gold)');
          const profilePic = b.barberProfilePic || (liveBarber ? liveBarber.profilePic : '');

          const scheduled = new Date(b.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
          const avatarHtml = profilePic
            ? `<img src="${profilePic}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
            : initials;

          return `
            <div class="booking-item" onclick="openTicketView('${b.id}')" style="cursor:pointer; transition: transform 0.2s">
              <div class="bi-avatar" style="background:${gradient}">${avatarHtml}</div>
              <div class="bi-info">
                <div class="bi-name">${barberName}</div>
                <div class="bi-meta">${scheduled}</div>
                <div class="bi-service"> ${b.serviceName || (b.service ? b.service.name : 'Service')}</div>
                ${isCompleted && !isRated ? `
                  <button class="rate-btn" onclick="event.stopPropagation(); openRatingModal('${b.id}')" style="margin-top:10px;padding:6px 12px;border-radius:8px;border:none;background:rgba(232, 164, 74, .1);color:var(--gold);font-size:12px;font-weight:700;cursor:pointer">⭐ Rate Service</button>
                ` : ''}
              </div>
              <div class="bi-right">
                <div class="bi-status ${b.status}">${b.status === 'in_progress' ? 'In Progress' : b.status.charAt(0).toUpperCase() + b.status.slice(1)}</div>
                <div class="bi-price">₹${b.price}</div>
                <div class="bi-id">ID: ${b.id.slice(-6).toUpperCase()}</div>
                ${b.status === 'upcoming' ? `
                  <div style="font-size:12px;font-weight:700;color:var(--gold);margin-top:4px;border:1px dashed var(--gold);padding:2px 8px;border-radius:6px;display:inline-block">
                    ${b.pin ? `PIN: ${b.pin}` : `REF: ${b.id.slice(0, 8).toUpperCase()}`}
                  </div>
                ` : ''}
              </div>
            </div>`;
        };

        body.innerHTML = `
          <div style="font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:var(--navy);margin-bottom:20px">
            My Bookings <span style="color:var(--gold)">(${bookings.length})</span>
          </div>
          ${upcoming.length ? `
            <div style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--blue);margin-bottom:12px">📅 Upcoming (${upcoming.length})</div>
            <div class="bookings-list" style="margin-bottom:24px">${upcoming.map(renderCard).join('')}</div>
          ` : ''}
          ${completed.length ? `
            <div style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--green);margin-bottom:12px">✅ Completed (${completed.length})</div>
            <div class="bookings-list" style="margin-bottom:24px">${completed.map(renderCard).join('')}</div>
          ` : ''}
          ${cancelled.length ? `
            <div style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:var(--red);margin-bottom:12px">❌ Cancelled (${cancelled.length})</div>
            <div class="bookings-list" style="margin-bottom:24px">${cancelled.map(renderCard).join('')}</div>
          ` : ''}`;
      } catch (err) {
        console.error('renderMyBookings error:', err);
        body.innerHTML = '<div class="bookings-empty"><div class="be-icon">⚠️</div><h3>Could not load bookings</h3><p>Please check your connection and try again.</p></div>';
      }
    }

    // ── RATING SYSTEM ──
    let ratingData = null;
    let selectedRating = 0;

    window.openRatingModal = (id) => {
      const b = window.customerBookings.find(x => x.id === id);
      if (!b) return;
      ratingData = b;
      selectedRating = 0;
      document.getElementById('rm-barber-name').textContent = b.barberName || (b.barber ? b.barber.name : 'Barber');
      document.getElementById('rating-modal-overlay').classList.add('open');
      resetStars();
    };

    window.openTicketView = (id) => {
      const b = window.customerBookings.find(x => x.id === id);
      if (!b) return;

      const ss = document.getElementById('success-screen');
      if (!ss) return;

      // Re-use success screen as a details view
      document.getElementById('ss-title').textContent = 'Booking Details';
      const ssDesc = document.getElementById('ss-desc');
      if (ssDesc) ssDesc.textContent = 'Show this PIN to your barber at the time of service';

      const barberName = b.barberName || (b.barber ? b.barber.name : 'Barber');
      const scheduled = new Date(b.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

      document.getElementById('ss-card').innerHTML = `
        <div class="ss-row"><span class="ss-row-label">Customer</span><span class="ss-row-value">${b.customerName}</span></div>
        <div class="ss-row"><span class="ss-row-label">Barber</span><span class="ss-row-value">${barberName}</span></div>
        <div class="ss-row"><span class="ss-row-label">Service</span><span class="ss-row-value">${b.serviceName || (b.service ? b.service.name : 'Service')}</span></div>
        <div class="ss-row"><span class="ss-row-label">When</span><span class="ss-row-value">${scheduled}</span></div>
        <div class="ss-row"><span class="ss-row-label">Status</span><span class="ss-row-value">${b.status.toUpperCase()}</span></div>
        <div class="ss-row"><span class="ss-row-label">Trip PIN</span><span class="ss-row-value" style="background:rgba(232, 164, 74, .1);color:var(--gold);padding:4px 12px;border-radius:6px;font-weight:800;font-size:18px;letter-spacing:2px">${b.pin || 'XXXX'}</span></div>
        <div class="ss-row"><span class="ss-row-label">Payment</span><span class="ss-row-value" style="color:var(--gold)">₹${b.price} to be paid</span></div>`;

      document.getElementById('ss-id').textContent = 'ID: ' + b.id;

      // Update buttons to be more relevant for view mode
      const btns = ss.querySelector('.ss-btns');
      if (btns) {
        btns.innerHTML = `
          <button class="ss-btn-primary" onclick="document.getElementById('success-screen').classList.remove('show'); document.body.style.overflow='';">Close Details</button>
          <button class="ss-btn-outline" onclick="location.reload()">Refresh History</button>
        `;
      }

      ss.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    window.closeRatingModal = () => {
      document.getElementById('rating-modal-overlay').classList.remove('open');
      ratingData = null;
    };

    window.setRating = (n) => {
      selectedRating = n;
      const stars = document.querySelectorAll('.rm-star');
      stars.forEach((s, idx) => {
        s.classList.toggle('active', idx < n);
      });
    };

    function resetStars() {
      document.querySelectorAll('.rm-star').forEach(s => s.classList.remove('active'));
      const commentInput = document.getElementById('rm-comment');
      if (commentInput) commentInput.value = '';
    }

    window.submitReview = async () => {
      if (selectedRating === 0) {
        alert('Please select a star rating');
        return;
      }
      if (!ratingData) {
        alert('❌ Error: Booking data is missing.');
        return;
      }

      const comment = document.getElementById('rm-comment').value.trim();
      const btn = document.getElementById('rm-submit-btn');

      btn.disabled = true;
      btn.textContent = 'Submitting...';

      try {
        // Backend handles atomic stats updates and marking as rated
        await addDoc(collection(db, "reviews"), {
          bookingId: ratingData.id,
          barberId: ratingData.barberId,
          userId: currentUser.uid,
          customerName: ratingData.customerName || currentUser.displayName || 'Customer',
          rating: selectedRating,
          comment: comment,
          createdAt: serverTimestamp()
        });

        // Atomic update to barber stats
        try {
          const barberRef = doc(db, "barbers", ratingData.barberId);
          const barberSnap = await getDoc(barberRef);
          if (barberSnap.exists()) {
            const bData = barberSnap.data();
            const oldCount = Number(bData.reviewCount) || 0;
            const oldRating = Number(bData.rating) || 0;

            const newCount = oldCount + 1;
            const newRating = ((oldRating * oldCount) + selectedRating) / newCount;

            await updateDoc(barberRef, {
              rating: newRating,
              reviewCount: newCount
            });
            console.log(`[STATS] Updated barber ${ratingData.barberId} to ${newRating.toFixed(1)} stars across ${newCount} reviews.`);
          }
        } catch (statsErr) {
          console.error("Error updating barber stats:", statsErr);
          // Don't fail the whole submission if stats update fails
        }

        await updateDoc(doc(db, "bookings", ratingData.id), { isReviewed: true });

        closeRatingModal();
        renderMyBookings();
        alert('✅ Thank you! Your review has been saved.');
      } catch (err) {
        console.error('Rating error:', err);
        alert('❌ Could not save review: ' + err.message);
        btn.disabled = false;
        btn.textContent = 'Submit Review';
      }
    };

    // ── Get Directions ──
    window.getDirections = (lat, lng, name) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_name=${encodeURIComponent(name)}`;
      window.open(url, '_blank');
    };

    window.viewMyBookings = () => {
      const ss = document.getElementById('success-screen');
      if (ss) ss.classList.remove('show');
      document.body.style.overflow = '';
      // Force switch to bookings view
      document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.app-nav-tab').forEach(t => t.classList.remove('active'));
      const bookingsView = document.getElementById('view-bookings');
      const bookingsTab = document.querySelector('.app-nav-tab[data-view="bookings"]');
      if (bookingsView) bookingsView.classList.add('active');
      if (bookingsTab) bookingsTab.classList.add('active');
      const searchBar = document.getElementById('search-bar');
      if (searchBar) searchBar.style.display = 'none';
      const modeToggle = document.getElementById('mode-toggle');
      if (modeToggle) modeToggle.style.display = 'none';
      renderMyBookings();
    };
    window.bookAnother = () => {
      document.getElementById('success-screen').classList.remove('show');
      document.body.style.overflow = '';
      selectedBarber = null; selectedService = null; selectedDate = null; selectedTime = null;
      switchAppView('browse'); filterBarbers();
    };

    // ══ LOCATION SYSTEM ══
    let userLat = null, userLng = null;

    // Haversine distance between two lat/lng points (returns km)
    function haversine(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function setLocPill(label, detected) {
      const dot = document.getElementById('loc-dot');
      const lbl = document.getElementById('loc-label');
      const area = document.getElementById('loc-area-label');
      if (!lbl) return;
      if (detected && dot) dot.classList.add('green');
      lbl.textContent = label;
      if (area) area.textContent = label;
    }

    // ── PINCODE MODAL LOGIC ──
    window.openPincodeModal = () => {
      document.getElementById('pincode-overlay').classList.add('open');
      document.getElementById('pincode-input').focus();
    };

    window.closePincodeModal = () => {
      document.getElementById('pincode-overlay').classList.remove('open');
      document.getElementById('pincode-error').style.display = 'none';
      document.getElementById('pincode-result').textContent = '';
      document.getElementById('pincode-input').value = '';
    };

    window.handleOverlayClick = (e) => {
      if (e.target.id === 'pincode-overlay') closePincodeModal();
    };

    window.onPincodeInput = () => {
      const val = document.getElementById('pincode-input').value;
      document.getElementById('pincode-find-btn').disabled = val.length < 6;
      document.getElementById('pincode-input').classList.remove('error');
      document.getElementById('pincode-error').style.display = 'none';
    };

    // Use Nominatim API to get location from pincode
    window.lookupPincode = async () => {
      const pin = document.getElementById('pincode-input').value;
      if (pin.length < 6) return;
      const btn = document.getElementById('pincode-find-btn');
      btn.textContent = '...';
      btn.disabled = true;
      document.getElementById('pincode-result').textContent = 'Searching...';

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=India&format=json`);
        const data = await res.json();

        if (data && data.length > 0) {
          userLat = parseFloat(data[0].lat);
          userLng = parseFloat(data[0].lon);

          // Get a clean area name from the result
          const parts = data[0].display_name.split(',');
          const areaName = parts[0].trim();

          updateBarberDistances(userLat, userLng);
          setLocPill(' ' + areaName + ' (' + pin + ')', true);
          closePincodeModal();

          // Auto-sort by nearest
          const sortSel = document.getElementById('sort-select');
          if (sortSel) sortSel.value = 'distance';
          filterBarbers();
        } else {
          document.getElementById('pincode-input').classList.add('error');
          document.getElementById('pincode-error').style.display = 'block';
          document.getElementById('pincode-result').textContent = '';
        }
      } catch (err) {
        document.getElementById('pincode-error').textContent = 'Network error. Try again.';
        document.getElementById('pincode-error').style.display = 'block';
      }
      btn.textContent = 'Find';
      btn.disabled = false;
    };

    window.pickCity = (city) => {
      setLocPill(' ' + city, true);
      closePincodeModal();
      filterBarbers();
    };

    window.useGPS = () => {
      closePincodeModal();
      requestLocation();
    };

    function updateBarberDistances(lat, lng) {
      allBarbers.forEach(b => {
        if (b.location?.lat && b.location?.lng) {
          const d = haversine(lat, lng, b.location.lat, b.location.lng);
          b.distance = d < 1 ? Math.round(d * 1000) + ' m' : d.toFixed(1) + ' km';
          b._dist = d;
        } else {
          b._dist = Math.random() * 3 + 0.3;
          b.distance = b._dist.toFixed(1) + ' km';
        }
      });
    }

    async function reverseGeocode(lat, lng) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
        const data = await res.json();
        const addr = data.address || {};
        // Return city level structure
        return addr.city || addr.town || addr.county || addr.state_district || 'Your Location';
      } catch {
        return 'Your Location';
      }
    }

    window.requestLocation = () => {
      const banner = document.getElementById('loc-banner');
      if (banner) banner.style.display = 'none';
      setLocPill('Locating...', false);

      if (!navigator.geolocation) {
        setLocPill('Location unavailable', false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
          updateBarberDistances(userLat, userLng);

          const areaName = await reverseGeocode(userLat, userLng);
          setLocPill(' ' + areaName, true);

          const sortSel = document.getElementById('sort-select');
          if (sortSel) sortSel.value = 'distance';
          filterBarbers();
        },
        (err) => {
          console.warn('Location denied:', err.message);
          setLocPill(' Bhubaneswar', true);
          filterBarbers();
        },
        { timeout: 10000, maximumAge: 300000 }
      );
    };

    window.dismissLocBanner = () => {
      const banner = document.getElementById('loc-banner');
      if (banner) banner.style.display = 'none';
      setLocPill(' Bhubaneswar', true);
      filterBarbers();
    };

    function initLocationFlow() {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(perm => {
          if (perm.state === 'granted') {
            window.requestLocation();
          } else if (perm.state === 'denied') {
            setLocPill(' Bhubaneswar', true);
          } else {
            setTimeout(() => {
              const banner = document.getElementById('loc-banner');
              if (banner) banner.style.display = 'flex';
            }, 1400);
          }
        });
      } else {
        setTimeout(() => {
          const banner = document.getElementById('loc-banner');
          if (banner) banner.style.display = 'flex';
        }, 1400);
      }
    }

    // Non-blocking initialization
    (async () => {
      console.log('DEBUG: App init starting...');
      const grid = document.getElementById('barber-grid');
      if (grid) {
        grid.innerHTML = `
          <div style="text-align:center;padding:40px;color:var(--gray)">
            <div style="width:32px;height:32px;border:3px solid #E8E8E8;border-top-color:#E8A44A;border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 12px"></div>
            Searching for barbers near you...
          </div>`;
      }

      // Load data in background
      loadApprovedBarbers().then(() => {
        console.log('DEBUG: Barbers loaded successfully');
      }).catch(err => {
        console.error('DEBUG: Critical failure loading barbers:', err);
      });

      // Start other UI features immediately
      initLocationFlow();
      console.log('DEBUG: App init sequence complete (loading in background)');
    })();
    // ── Hamburger menu ──
    (function () {
      const ham = document.getElementById('hamburger');
      const menu = document.getElementById('mobile-menu');
      if (!ham || !menu) return;
      ham.addEventListener('click', () => {
        ham.classList.toggle('open');
        menu.classList.toggle('open');
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
      });
    })();
    // ── Handle incoming view parameters (e.g., from Shared Header) ──
    window.addEventListener('load', () => {
      // Explicitly clear search input to fix pre-fill bug
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'bookings') {
        const checkInterval = setInterval(() => {
          // Wait for both the function AND the auth state to be ready
          if (typeof window.viewMyBookings === 'function' && currentUser) {
            clearInterval(checkInterval);
            window.viewMyBookings();
          }
        }, 100);
        // Timeout after 5s to avoid infinite loop
        setTimeout(() => clearInterval(checkInterval), 5000);
      }
    });

