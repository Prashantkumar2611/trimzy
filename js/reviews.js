    import { db, auth, collection, query, where, getDocs, doc, getDoc } from './firebase.js';
    import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const barberId = urlParams.get('id');

      if (!barberId) {
        window.location.href = '/';
        return;
      }

      // Update back button
      document.getElementById('back-profile').href = `/barber-profile?id=${barberId}`;

      try {
        // 1. Collect ALL possible IDs for review lookup
        const possibleIds = new Set([barberId]);
        
        // CRITICAL: Also pick up the uid from the URL (passed by barber-profile)
        const uidParam = urlParams.get('uid');
        if (uidParam) {
          possibleIds.add(uidParam);
          void('[REVIEWS] uid from URL param:', uidParam);
        }

        // 2. Try to fetch barber doc for the name + any extra uid
        let barberName = 'this shop';
        try {
          const bSnap = await getDoc(doc(db, "barbers", barberId));
          if (bSnap.exists()) {
            const bData = bSnap.data();
            barberName = bData.shopName || bData.name || 'this shop';
            void('[REVIEWS] Barber doc found. Fields:', Object.keys(bData).join(', '));
            void('[REVIEWS] bData.uid =', bData.uid);
            if (bData.uid) possibleIds.add(bData.uid);
          } else {
            console.warn('[REVIEWS] Barber doc NOT found for:', barberId);
          }
        } catch (docErr) {
          console.warn('[REVIEWS] Could not read barber doc (may need auth):', docErr.message || docErr);
          // Continue anyway — we still have the URL params
        }

        document.getElementById('barber-name-sub').innerText = `What people are saying about ${barberName}`;

        void('[REVIEWS] Querying reviews for IDs:', [...possibleIds]);

        // 3. Fetch Reviews using ALL possible barber IDs
        const reviewMap = new Map();
        for (const id of possibleIds) {
          try {
            const q = query(collection(db, "reviews"), where("barberId", "==", id));
            const snap = await getDocs(q);
            void(`[REVIEWS] ID "${id}" → ${snap.docs.length} results`);
            snap.docs.forEach(d => {
              if (!reviewMap.has(d.id)) reviewMap.set(d.id, { id: d.id, ...d.data() });
            });
          } catch (qErr) {
            console.error(`[REVIEWS] Query error for "${id}":`, qErr.message || qErr);
          }
        }

        void('[REVIEWS] Total unique reviews:', reviewMap.size);

        const grid = document.getElementById('reviews-grid');

        if (reviewMap.size === 0) {
          grid.innerHTML = `
            <div class="empty-state">
              <p style="font-size: 24px; margin-bottom: 8px;">No reviews yet</p>
              <p>Be the first to share your experience after your appointment!</p>
              <p style="font-size: 11px; opacity: 0.5; margin-top: 20px;">(Searched: ${[...possibleIds].join(', ')})</p>
            </div>`;
          return;
        }

        // Sort by createdAt (descending)
        const allReviews = [...reviewMap.values()].sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
          return tB - tA;
        });

        grid.innerHTML = allReviews.map(r => {
          const rawName = (r.customerName && r.customerName !== 'Customer') ? r.customerName : 'Verified Guest';
          const initials = rawName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          
          let dateStr = 'Recently';
          if (r.createdAt) {
            const date = r.createdAt.toDate ? r.createdAt.toDate() : new Date(r.createdAt.seconds * 1000);
            dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
          }

          return `
            <div class="review-card">
              <div class="rc-header">
                <div class="rc-avatar">${initials}</div>
                <div class="rc-details">
                  <div class="rc-name">${rawName}</div>
                  <div class="rc-meta">Verified Customer</div>
                  <div class="rc-stars">${'★'.repeat(Math.min(5, Math.max(1, r.rating || 5)))}</div>
                </div>
              </div>
              <div class="rc-text">${r.comment || 'Outstanding service, highly recommended!'}</div>
              <div class="rc-date">${dateStr}</div>
            </div>`;
        }).join('');

      } catch (err) {
        console.error('[REVIEWS] Fatal error:', err);
        document.getElementById('reviews-grid').innerHTML = '<p class="loading-state">Failed to load reviews. Please try again later.</p>';
      }
    }

    // Run init after auth resolves (or on timeout)
    let started = false;
    function go() {
      if (started) return;
      started = true;
      init();
    }

    onAuthStateChanged(auth, (user) => {
      void('[REVIEWS] Auth:', user ? user.email : 'anonymous');
      go();
    });

    // Fallback if auth never resolves
    setTimeout(() => {
      if (!started) {
        void('[REVIEWS] Timeout — starting without auth');
        go();
      }
    }, 2000);
