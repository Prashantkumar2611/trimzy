    import { db, collection, query, where, getDocs, doc, getDoc } from './firebase.js';

    async function init() {
      const urlParams = new URLSearchParams(window.location.search);
      const barberId = urlParams.get('id');

      if (!barberId) {
        window.location.href = 'index.html';
        return;
      }

      // Update back button
      document.getElementById('back-profile').href = `barber-profile.html?id=${barberId}`;

      try {
        // 1. Fetch Barber Name & collect all possible IDs
        const possibleIds = new Set([barberId]);
        const bSnap = await getDoc(doc(db, "barbers", barberId));
        if (bSnap.exists()) {
          const bData = bSnap.data();
          document.getElementById('barber-name-sub').innerText = `What people are saying about ${bData.name || 'this shop'}`;
          if (bData.uid) possibleIds.add(bData.uid);
          if (bSnap.id !== barberId) possibleIds.add(bSnap.id);
        }

        console.log('[REVIEWS] Querying reviews for all possible barberIds:', [...possibleIds]);

        // 2. Fetch Reviews using all possible barber IDs
        const reviewMap = new Map();
        for (const id of possibleIds) {
          const q = query(collection(db, "reviews"), where("barberId", "==", id));
          const snap = await getDocs(q);
          snap.docs.forEach(d => {
            if (!reviewMap.has(d.id)) reviewMap.set(d.id, { id: d.id, ...d.data() });
          });
        }

        const grid = document.getElementById('reviews-grid');

        if (reviewMap.size === 0) {
          grid.innerHTML = `
            <div class="empty-state">
              <p style="font-size: 24px; margin-bottom: 8px;">No reviews yet</p>
              <p>Be the first to share your experience after your appointment!</p>
              <p style="font-size: 11px; opacity: 0.5; margin-top: 20px;">(Debug: Searched IDs: ${[...possibleIds].join(', ')})</p>
            </div>`;
          return;
        }

        // Sort manually by createdAt (descending)
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
        console.error('Error:', err);
        document.getElementById('reviews-grid').innerHTML = '<p class="loading-state">Failed to load reviews. Please try again later.</p>';
      }
    }

    init();
