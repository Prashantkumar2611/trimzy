import { auth } from './firebase.js';
    import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    window.firebaseAuth = auth;

    // ── Password Check ──
    const ADMIN_PASSWORD = (window.TRIMZY_CONFIG && window.TRIMZY_CONFIG.ADMIN_PASSWORD) || 'YOUR_ADMIN_PASSWORD_HERE';
    window.checkAdminPw = () => {
      const val = document.getElementById('admin-pw-input').value;
      if (val === ADMIN_PASSWORD) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-shell').classList.add('show');
        sessionStorage.setItem('ss_admin', '1');
        loadAll();
      } else {
        document.getElementById('login-error').classList.add('show');
      }
    };

    // Init moved to bottom

    window.adminLogout = () => {
      sessionStorage.removeItem('ss_admin');
      location.reload();
    };

    // ── Data Loading ──
    let allApplications = [];
    let allBookings = [];
    let allUsers = [];

    async function loadAll() {
      await Promise.all([window.loadApplications(), window.loadBookings(), window.loadUsers()]);
    }

    window.loadApplications = async function () {
      try {
        const res = await fetch(`${window.TRIMZY_CONFIG.API_URL}/admin/applications`, {
          headers: {
            'X-Admin-Password': ADMIN_PASSWORD
          }
        });
        if (!res.ok) throw new Error('Failed to load applications from backend');
        const data = await res.json();
        // Normalize _id to id for backwards compatibility
        allApplications = data.applications.map(a => ({ id: a._id, ...a }));
        updateStats();
        renderApplications();
      } catch (err) {
        console.error(err);
        showToast("Error loading applications: " + err.message, "error");
      }
    };

    window.loadBookings = async function () {
      try {
        const res = await fetch(`${window.TRIMZY_CONFIG.API_URL}/admin/bookings`, {
          headers: {
            'X-Admin-Password': ADMIN_PASSWORD
          }
        });
        if (!res.ok) throw new Error('Failed to load bookings from backend');
        const data = await res.json();
        allBookings = data.bookings.map(b => ({ id: b._id, ...b }));
        updateStats(); // Update stats after loading bookings
        renderBookings();
      } catch (err) {
        console.error(err);
        showToast("Error loading bookings: " + err.message, "error");
      }
    };

    window.loadUsers = async function () {
      try {
        const res = await fetch(`${window.TRIMZY_CONFIG.API_URL}/admin/users`, {
          headers: {
            'X-Admin-Password': ADMIN_PASSWORD
          }
        });
        if (!res.ok) throw new Error('Failed to load users from backend');
        const data = await res.json();
        allUsers = data.users.map(u => ({ id: u._id, ...u }));
        renderUsers();
      } catch (err) {
        console.error(err);
        showToast("Error loading users: " + err.message, "error");
      }
    };

    // ── Actions ──
    let selectedApp = null;
    window.approveBarber = (id) => {
      selectedApp = allApplications.find(a => a.id === id);
      if (!selectedApp) return;
      document.getElementById('modal-barber-name').textContent = selectedApp.name;
      document.getElementById('modal-email').value = selectedApp.email;
      document.getElementById('modal-password').value = `Trimzy@${Math.floor(1000 + Math.random() * 9000)}`;
      document.getElementById('approve-modal').style.display = 'flex';
    };

    window.closeApproveModal = () => {
      document.getElementById('approve-modal').style.display = 'none';
      selectedApp = null;
    };

    window.confirmApprove = async () => {
      const email = document.getElementById('modal-email').value.trim();
      const password = document.getElementById('modal-password').value.trim();
      const btn = document.getElementById('modal-confirm-btn');
      const errEl = document.getElementById('modal-error');

      if (!email || !password) {
        errEl.textContent = "Email and password are required.";
        errEl.style.display = 'block';
        return;
      }

      btn.disabled = true;
      btn.textContent = "Processing...";
      errEl.style.display = 'none';

      try {
        // Backend handles Firebase Auth user creation, barber profile syncing, and Brevo SMTP email dispatch natively!
        const response = await fetch(`${window.TRIMZY_CONFIG.API_URL}/admin/applications/${selectedApp.id}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Password': ADMIN_PASSWORD
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to approve application on server');
        }

        showToast("Barber approved and account synced!");
        closeApproveModal();
        loadApplications();
      } catch (err) {
        console.error(err);
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = "✓ Approve & Create Account";
      }
    };

    window.rejectBarber = async (id) => {
      if (!confirm("⚠️ Reject and permanently delete this barber's data? This will remove their application, profile, bookings, and reviews. This cannot be undone.")) return;

      try {
        // Backend handles Application status rejection, cascading booking purges, Mongoose profile deletes and Auth purges natively!
        const res = await fetch(`${window.TRIMZY_CONFIG.API_URL}/admin/applications/${id}/reject`, {
          method: 'POST',
          headers: {
            'X-Admin-Password': ADMIN_PASSWORD
          }
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to reject application on server');
        }

        // Remove from local array and re-render immediately
        allApplications = allApplications.filter(a => a.id !== id);
        updateStats();
        renderApplications();
        showToast("Barber rejected and all data permanently deleted.", "success");
      } catch (err) {
        console.error("[ADMIN] Reject error:", err);
        showToast("Error rejecting barber: " + err.message, "error");
      }
    };

    window.renderApplications = () => {
      const grid = document.getElementById('apps-grid');
      grid.innerHTML = allApplications.map(a => `
      <div class="app-card ${a.status || 'pending'}">
        <div class="app-name">${a.name}</div>
        <div class="app-meta">${a.shopName} · ${a.area}</div>
        <div class="app-actions">
          ${a.status !== 'approved' ? `<button class="btn-approve" onclick="approveBarber('${a.id}')">Approve</button>` : `<span class="status-badge approved">✅ Approved</span>`}
          <button class="btn-reject" onclick="rejectBarber('${a.id}')">Reject</button>
        </div>
      </div>
    `).join('');
    };

    window.renderBookings = () => {
      const wrap = document.getElementById('bookings-wrap');
      const search = document.getElementById('booking-search').value.toLowerCase();
      const status = document.getElementById('booking-status-filter').value;

      const filtered = allBookings.filter(b => {
        const matchSearch = (b.customerName || '').toLowerCase().includes(search) || (b.id || '').toLowerCase().includes(search);
        const matchStatus = !status || b.status === status;
        return matchSearch && matchStatus;
      });

      document.getElementById('booking-count').textContent = filtered.length;

      wrap.innerHTML = `<table class="bookings-table">
      <thead><tr><th>Ref</th><th>Customer</th><th>Price</th><th>Status</th></tr></thead>
      <tbody>
        ${filtered.map(b => `<tr>
          <td style="font-family:monospace;font-weight:700;color:var(--gray)">${b.id.slice(0, 8).toUpperCase()}</td>
          <td>${b.customerName}</td>
          <td>₹${b.price}</td>
          <td><span class="td-status ${b.status}">${b.status}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
    };

    window.renderUsers = () => {
      const wrap = document.getElementById('users-wrap');
      wrap.innerHTML = `<table class="bookings-table">
      <thead><tr><th>Name</th><th>Phone</th></tr></thead>
      <tbody>
        ${allUsers.map(u => `<tr><td>${u.name}</td><td>${u.phone}</td></tr>`).join('')}
      </tbody>
    </table>`;
    };

    function updateStats() {
      // Application stats
      document.getElementById('stat-total').textContent = allApplications.length;
      document.getElementById('stat-pending').textContent = allApplications.filter(a => a.status === 'pending').length;
      document.getElementById('stat-approved').textContent = allApplications.filter(a => a.status === 'approved').length;
      document.getElementById('stat-rejected').textContent = allApplications.filter(a => a.status === 'rejected').length;

      // Booking stats
      document.getElementById('stat-bookings').textContent = allBookings.length;

      // Revenue logic (completed bookings only)
      const rev = allBookings
        .filter(b => b.status === 'completed' || b.status === 'in_progress') // Revenue counts for active work
        .reduce((sum, b) => sum + (parseInt(b.price) || 0), 0);
      document.getElementById('stat-revenue').textContent = '₹' + rev;
    }

    function showToast(msg, type = 'success') {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = `toast show ${type}`;
      setTimeout(() => t.className = 'toast', 300);
    }

    window.switchTab = (tab) => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-' + tab).classList.add('active');
    };

    // ── Init Dashboard ──
    if (sessionStorage.getItem('ss_admin') === '1') {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('admin-shell').classList.add('show');
      loadAll();
    }
