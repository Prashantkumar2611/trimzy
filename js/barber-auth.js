    import { auth, db, doc, updateDoc, collection, addDoc, query, where, getDocs } from './firebase.js';
    import {
      createUserWithEmailAndPassword, signInWithEmailAndPassword,
      onAuthStateChanged, sendPasswordResetEmail, updateProfile
    } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    // ── Check if already logged in as barber ──
    onAuthStateChanged(auth, async user => {
      if (!user) return;
      try {
        // 🚨 V10.0: MASTER ACCOUNT FORCE-APPROVAL (Always let them in)
        if (user.email === "aalimhakim@gmail.com" || user.email === "singhkrsanjay0911@gmail.com") {
          showApproved(); return;
        }

        let q = query(collection(db, "barbers"), where("uid", "==", user.uid));
        let snap = await getDocs(q);
        
        // Fallback for legacy barbers missing UID but having matching Email
        if (snap.empty && user.email) {
          q = query(collection(db, "barbers"), where("email", "==", user.email));
          snap = await getDocs(q);
          
          if (!snap.empty) {
            const legacyDoc = snap.docs[0];
            await updateDoc(doc(db, "barbers", legacyDoc.id), { uid: user.uid });
          }
        }

        if (!snap.empty) {
          const barber = snap.docs[0].data();
          if (barber.status === 'approved') showApproved();
          else showPending(barber);
        } else {
          // Check applications
          const aq = query(collection(db, "barber_applications"), where("email", "==", user.email));
          const asnap = await getDocs(aq);
          if (!asnap.empty) showPending(asnap.docs[0].data());
        }
      } catch(e) { console.error('Auth state check error:', e); }
    });

    // ── Tab param ──
    if (new URLSearchParams(location.search).get('tab') === 'login') switchTab('login');

    // ══ TAB SWITCHING ══
    window.switchTab = (tab) => {
      clearAlert();
      document.getElementById('signup-section').style.display = tab === 'signup' ? 'block' : 'none';
      document.getElementById('login-section').style.display = tab === 'login' ? 'block' : 'none';
      document.getElementById('forgot-section').style.display = 'none';
      document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
      document.getElementById('tab-login').classList.toggle('active', tab === 'login');
      document.getElementById('pending-screen').classList.remove('show');
      document.getElementById('approved-screen').classList.remove('show');
      document.getElementById('main-tabs').style.display = 'flex';
      if (tab === 'signup') suGoTo(1);
    };

    window.showForgot = () => {
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('signup-section').style.display = 'none';
      document.getElementById('forgot-section').style.display = 'block';
      document.getElementById('main-tabs').style.display = 'none';
    };

    window.showLogin = () => switchTab('login');

    // ══ SIGNUP DATA ══
    let suData = {};

    window.suGoTo = (n) => {
      [1, 2, 3].forEach(i => {
        document.getElementById(`su-step-${i}`).classList.toggle('active', i === n);
        document.getElementById(`sdot-${i}`).classList.toggle('done', i <= n);
      });
    };

    window.suStep1 = (e) => {
      e.preventDefault(); clearAlert(); let valid = true;
      const name = document.getElementById('su-name').value.trim();
      const phone = document.getElementById('su-phone').value.trim().replace(/\s/g, '');
      const email = document.getElementById('su-email').value.trim();
      const pw = document.getElementById('su-password').value;
      if (name.length < 2) { showFE('su-name', 'su-name-err'); valid = false; } else clearFE('su-name', 'su-name-err');
      if (!/^\d{10}$/.test(phone)) { showFE('su-phone', 'su-phone-err'); valid = false; } else clearFE('su-phone', 'su-phone-err');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFE('su-email', 'su-email-err'); valid = false; } else clearFE('su-email', 'su-email-err');
      if (pw.length < 8) { showFE('su-password', 'su-pw-err'); valid = false; } else clearFE('su-password', 'su-pw-err');
      if (!valid) return;
      suData = { name, phone, email, password: pw };
      suGoTo(2);
    };

    window.suStep2 = (e) => {
      e.preventDefault(); clearAlert(); let valid = true;
      const shop = document.getElementById('su-shop').value.trim();
      const area = document.getElementById('su-area').value;
      const upi = document.getElementById('su-upi').value.trim();
      if (!shop) { showFE('su-shop', 'su-shop-err'); valid = false; } else clearFE('su-shop', 'su-shop-err');
      if (!area) { showFE('su-area', 'su-area-err'); valid = false; } else clearFE('su-area', 'su-area-err');
      if (!upi) { showFE('su-upi', 'su-upi-err'); valid = false; } else clearFE('su-upi', 'su-upi-err');
      if (!valid) return;
      suData.shopName = shop;
      suData.area = area;
      suData.experience = document.getElementById('su-exp').value;
      suData.upiId = upi;
      suData.services = document.getElementById('su-services').value;
      suData.homeVisit = document.getElementById('su-homevisit').value;
      // Fill review card
      document.getElementById('review-card').innerHTML = `
    <div class="sc-row"><span class="sc-label">Name</span><span class="sc-value">${suData.name}</span></div>
    <div class="sc-row"><span class="sc-label">Shop</span><span class="sc-value">${suData.shopName}</span></div>
    <div class="sc-row"><span class="sc-label">Area</span><span class="sc-value">${suData.area}</span></div>
    <div class="sc-row"><span class="sc-label">Services</span><span class="sc-value">${suData.services}</span></div>
    <div class="sc-row"><span class="sc-label">Home Visits</span><span class="sc-value">${suData.homeVisit.includes('Yes') ? '✅ Yes' : '❌ No'}</span></div>
    <div class="sc-row"><span class="sc-label">UPI</span><span class="sc-value">${suData.upiId}</span></div>`;
      suGoTo(3);
    };

    window.suFinish = async () => {
      clearAlert();
      const terms = document.getElementById('su-terms').checked;
      if (!terms) { document.getElementById('su-terms-err').style.display = 'block'; return; }
      document.getElementById('su-terms-err').style.display = 'none';
      const about = document.getElementById('su-about').value.trim();
      setLoading('su-btn-3', true);
      try {
        // 1. Create Firebase Auth account (Identity)
        const cred = await createUserWithEmailAndPassword(auth, suData.email, suData.password);
        await updateProfile(cred.user, { displayName: suData.name });

        // 2. Register Application in Firestore
        const barberData = {
          uid: cred.user.uid,
          name: suData.name,
          shopName: suData.shopName,
          email: suData.email,
          phone: suData.phone,
          area: suData.area,
          upiId: suData.upiId,
          services: suData.services,
          homeVisit: suData.homeVisit === 'Yes',
          experience: suData.experience,
          about: about,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, "barber_applications"), barberData);

        // 3. Show pending screen
        showPending({ ...barberData });
        showAlert('Application submitted! We\'ll review it within 24–48 hours.', 'success');
      } catch (err) {
        setLoading('su-btn-3', false);
        const msgs = {
          'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
          'auth/weak-password': 'Password too weak. Use at least 8 characters.',
          'auth/invalid-email': 'Please enter a valid email address.',
        };
        showAlert(msgs[err.code] || 'Sign up failed: ' + err.message, 'error');
      }
    };

    // ══ LOGIN ══
    window.doLogin = async (e) => {
      e.preventDefault(); clearAlert(); let valid = true;
      const email = document.getElementById('login-email').value.trim();
      const pw = document.getElementById('login-password').value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFE('login-email', 'login-email-err'); valid = false; } else clearFE('login-email', 'login-email-err');
      if (!pw) { showFE('login-password', 'login-pw-err'); valid = false; } else clearFE('login-password', 'login-pw-err');
      if (!valid) return;
      setLoading('login-btn', true);
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pw);
        let q = query(collection(db, "barbers"), where("uid", "==", cred.user.uid));
        let snap = await getDocs(q);
        
        if (snap.empty) {
          q = query(collection(db, "barbers"), where("email", "==", email));
          snap = await getDocs(q);
        }
        
        if (snap.empty) {
          const aq = query(collection(db, "barber_applications"), where("email", "==", email));
          const asnap = await getDocs(aq);
          if (asnap.empty) {
            await auth.signOut();
            showAlert('No barber account found. Please create an account first.', 'error');
            setLoading('login-btn', false); return;
          }
          showPending(asnap.docs[0].data());
          setLoading('login-btn', false); return;
        }

        const barber = snap.docs[0].data();
        // 🚨 V10.0: MASTER ACCOUNT FORCE-APPROVAL
        const isMaster = (email === "aalimhakim@gmail.com" || email === "singhkrsanjay0911@gmail.com");

        if (barber.status === 'approved' || isMaster) {
          showAlert('Login successful! Redirecting to dashboard...', 'success');
          setTimeout(() => location.href = 'barber-dashboard.html', 800);
        } else {
          showPending(barber);
          showAlert('Your application is still under review. We\'ll notify you soon!', 'info');
        }
      } catch (err) {
        setLoading('login-btn', false);
        const msgs = {
          'auth/user-not-found': 'No account found with this email.',
          'auth/wrong-password': 'Incorrect password.',
          'auth/invalid-credential': 'Incorrect email or password.',
          'auth/too-many-requests': 'Too many attempts. Please try again later.',
        };
        showAlert(msgs[err.code] || 'Login failed. Please try again.', 'error');
      }
    };

    window.submitForgot = async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFE('forgot-email', 'forgot-email-err'); return;
      }
      clearFE('forgot-email', 'forgot-email-err');
      setLoading('forgot-btn', true);
      try {
        await sendPasswordResetEmail(auth, email);
        showAlert('✅ Password reset link sent! Please check your email inbox.', 'success');
        setTimeout(() => {
          setLoading('forgot-btn', false);
          showLogin();
        }, 3000);
      } catch (err) {
        setLoading('forgot-btn', false);
        const msgs = {
          'auth/user-not-found': 'No barber account found with this email.',
          'auth/invalid-email': 'Please enter a valid email address.',
          'auth/too-many-requests': 'Too many attempts. Please try again later.'
        };
        showAlert('⚠️ ' + (msgs[err.code] || 'Could not send reset email. Please try again.'), 'error');
      }
    };

    // ══ STATUS SCREENS ══
    function showPending(barber) {
      document.getElementById('main-tabs').style.display = 'none';
      document.getElementById('signup-section').style.display = 'none';
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('approved-screen').classList.remove('show');
      document.getElementById('pending-card').innerHTML = `
    <div class="sc-row"><span class="sc-label">Name</span><span class="sc-value">${barber.name || '—'}</span></div>
    <div class="sc-row"><span class="sc-label">Shop</span><span class="sc-value">${barber.shopName || '—'}</span></div>
    <div class="sc-row"><span class="sc-label">Area</span><span class="sc-value">${barber.area || '—'}</span></div>
    <div class="sc-row"><span class="sc-label">Status</span><span class="sc-value" style="color:var(--gold)">⏳ Under Review</span></div>`;
      document.getElementById('pending-screen').classList.add('show');
    }

    function showApproved() {
      document.getElementById('main-tabs').style.display = 'none';
      document.getElementById('signup-section').style.display = 'none';
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('pending-screen').classList.remove('show');
      document.getElementById('approved-screen').classList.add('show');
      // Auto redirect to dashboard after 2s
      setTimeout(() => location.href = 'barber-dashboard.html', 2000);
    }

    // ══ HELPERS ══
    function showAlert(msg, type = 'error') {
      const el = document.getElementById('auth-alert');
      const icons = { error: '⚠️', success: '✅', info: '💡' };
      el.textContent = (icons[type] || '') + ' ' + msg;
      el.className = `auth-alert show ${type}`;
    }
    function clearAlert() { document.getElementById('auth-alert').className = 'auth-alert'; }
    function setLoading(id, on) { const b = document.getElementById(id); b.disabled = on; b.classList.toggle('loading', on); }
    function showFE(inp, err) { document.getElementById(inp)?.classList.add('error'); document.getElementById(err).style.display = 'block'; }
    function clearFE(inp, err) { document.getElementById(inp)?.classList.remove('error'); document.getElementById(err).style.display = 'none'; }
    window.togglePw = (id, btn) => { const i = document.getElementById(id); i.type = i.type === 'password' ? 'text' : 'password'; btn.textContent = i.type === 'password' ? '👁' : '🙈'; };
    window.checkPwStrength = (val) => {
      let s = 0; if (val.length >= 8) s++; if (/[A-Z]/.test(val)) s++; if (/[0-9]/.test(val)) s++; if (/[^A-Za-z0-9]/.test(val)) s++;
      const w = ['0%', '25%', '50%', '75%', '100%'], c = ['', '#E85555', '#F5A623', '#4AAFE8', '#2ECC8E'], l = ['Enter a password', 'Weak', 'Fair', 'Good', 'Strong 💪'];
      document.getElementById('pw-fill').style.width = w[s]; document.getElementById('pw-fill').style.background = c[s]; document.getElementById('pw-text').textContent = l[s];
    };
