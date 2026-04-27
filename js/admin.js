    import { auth, db, doc, getDoc, getDocs, collection, query, where, updateDoc, deleteDoc, addDoc, setDoc, serverTimestamp, orderBy } from './firebase.js';
    import { onAuthStateChanged, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    const BREVO_API_KEY = (window.TRIMZY_CONFIG && window.TRIMZY_CONFIG.BREVO_API_KEY) || 'YOUR_BREVO_API_KEY_HERE';

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
      const q = query(collection(db, "barber_applications"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      allApplications = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateStats();
      renderApplications();
    };

    window.loadBookings = async function () {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      allBookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateStats(); // Update stats after loading bookings
      renderBookings();
    };

    window.loadUsers = async function () {
      const snap = await getDocs(collection(db, "users"));
      allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderUsers();
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
        // 1. Create Firebase Auth User for the Barber
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Sign out immediately so admin page doesn't remain authenticated as the barber
        await signOut(auth);

        // 2. Update Application status
        await updateDoc(doc(db, "barber_applications", selectedApp.id), { status: 'approved' });

        // 3. Create Barber Profile
        // Standardize: The Document ID is ALWAYS the Auth UID. Simple & clean.
        const barberData = {
          ...selectedApp,
          status: 'approved',
          uid: uid,
          tempPassword: password,
          approvedAt: serverTimestamp()
        };

        await setDoc(doc(db, "barbers", uid), barberData, { merge: true });
        console.log("Created barber profile with UID as ID:", uid);

        // 4. Send Approval Email via Brevo
        await sendApprovalEmail(selectedApp, email, password);

        showToast("Barber approved and account synced!");
        closeApproveModal();
        loadApplications();
      } catch (err) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          // If user already exists, try to find their profile and just link it
          try {
            // Robust Recovery: If account exists in Auth but profile is missing/broken
            const q = query(collection(db, "barbers"), where("email", "==", email));
            const qSnap = await getDocs(q);

            // Mark application as approved regardless
            await updateDoc(doc(db, "barber_applications", selectedApp.id), { status: 'approved' });

            if (!qSnap.empty) {
              const existingId = qSnap.docs[0].id;
              await updateDoc(doc(db, "barbers", existingId), { status: 'approved', uid: existingId });
              showToast("Profile already existed, linked successfully!");
            } else {
              // Profile missing but Auth exists? Create it now.
              // Note: We can't get the UID of an existing user via Client SDK without signing in,
              // so we use the email as a temporary ID or wait for the barber to login.
              // BEST ACTION: Tell user to delete the Auth User and try again for a clean UID link.
              errEl.innerHTML = "⚠️ <strong>Email exists in Auth but profile is missing!</strong><br><br>Please go to Firebase Console -> Authentication, delete user <strong>" + email + "</strong>, then click Approve again.";
              errEl.style.display = 'block';
              return;
            }

            closeApproveModal();
            loadApplications();
            return;
          } catch (linkErr) {
            console.error("Linking failed:", linkErr);
          }

          errEl.innerHTML = "⚠️ <strong>Email already exists!</strong> To set a **new** password, you must delete the user from Firebase Console first. <br><br>Otherwise, if they have already logged in once, the account should be linked.";
        } else {
          errEl.textContent = "Error: " + err.message;
        }
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = "✓ Approve & Create Account";
      }
    };

    async function sendApprovalEmail(app, loginEmail, password) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: "Trimzy Admin", email: "official@trimzy.co.in" },
            to: [{ email: loginEmail, name: app.name }],
            subject: "Congratulations! Your Trimzy Barber Profile is Approved ✅",
            htmlContent: `
            <div style="font-family:sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #eee; border-radius:10px;">
              <h2 style="color:#0E0E1A;">Welcome to the Trimzy Family, ${app.name}! ✂️</h2>
              <p>We are thrilled to inform you that your application to join Trimzy as a professional barber has been <strong>Approved</strong>.</p>
              
              <div style="background:#F4F3F0; padding:20px; border-radius:12px; margin:24px 0;">
                <h3 style="margin-top:0; color:#E8A44A;">Your Dashboard Credentials</h3>
                <p style="margin-bottom:8px;"><strong>Login Email:</strong> ${loginEmail}</p>
                <p style="margin-bottom:0;"><strong>Temporary Password:</strong> ${password}</p>
                <p style="font-size:12px; color:#8A8A9A; margin-top:12px;">Please change your password after your first login for security.</p>
              </div>

              <p>You can now log in to your dashboard to manage your shop status, bookings, and profile:</p>
              <a href="https://trimzy.co.in/barber-auth.html" style="display:inline-block; padding:14px 24px; background:#E8A44A; color:#0E0E1A; text-decoration:none; border-radius:8px; font-weight:bold; margin:16px 0;">Go to Dashboard →</a>

              <p style="margin-top:32px;">If you have any questions, feel free to reply to this email or contact us on WhatsApp.</p>
              <p>Best regards,<br><strong>Team Trimzy</strong></p>
            </div>
          `
          })
        });
      } catch (e) {
        console.error("Email delivery failed:", e);
        // We don't throw here to avoid failing the whole approval if just the email fails
      }
    }

    window.rejectBarber = async (id) => {
      if (!confirm("⚠️ Reject and permanently delete this barber's data? This will remove their application, profile, bookings, and reviews. This cannot be undone.")) return;

      try {
        const appData = allApplications.find(a => a.id === id);

        // 1. Delete the application document
        await deleteDoc(doc(db, "barber_applications", id));

        // 2. Find and delete barber profile (could be stored by UID or email match)
        if (appData) {
          // Try direct UID lookup first
          if (appData.uid) {
            try {
              const barberSnap = await getDoc(doc(db, "barbers", appData.uid));
              if (barberSnap.exists()) {
                await deleteDoc(doc(db, "barbers", appData.uid));
                console.log("[ADMIN] Deleted barber profile by UID:", appData.uid);
              }
            } catch (e) { console.warn("UID lookup skip:", e); }
          }

          // Also search by email in barbers collection
          if (appData.email) {
            const bQuery = query(collection(db, "barbers"), where("email", "==", appData.email));
            const bSnap = await getDocs(bQuery);
            for (const barberDoc of bSnap.docs) {
              // Delete all bookings for this barber
              const bookQ = query(collection(db, "bookings"), where("barberId", "==", barberDoc.id));
              const bookSnap = await getDocs(bookQ);
              for (const b of bookSnap.docs) {
                await deleteDoc(doc(db, "bookings", b.id));
              }
              console.log("[ADMIN] Deleted", bookSnap.size, "bookings for barber:", barberDoc.id);

              // Delete all reviews for this barber
              const revQ = query(collection(db, "reviews"), where("barberId", "==", barberDoc.id));
              const revSnap = await getDocs(revQ);
              for (const r of revSnap.docs) {
                await deleteDoc(doc(db, "reviews", r.id));
              }
              console.log("[ADMIN] Deleted", revSnap.size, "reviews for barber:", barberDoc.id);

              // Delete the barber profile doc
              await deleteDoc(doc(db, "barbers", barberDoc.id));
              console.log("[ADMIN] Deleted barber profile:", barberDoc.id);
            }
          }
        }

        // 3. Remove from local array and re-render immediately
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
