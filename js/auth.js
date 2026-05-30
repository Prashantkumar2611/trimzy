import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ── Redirect if already logged in ──
onAuthStateChanged(auth, user => {
  // Only auto-redirect if user came here with a specific redirect param
  // AND they are already logged in — don't redirect if they explicitly visited auth.html
  if (user) {
    const redirect = new URLSearchParams(location.search).get('redirect');
    if (redirect) {
      location.href = redirect;
    }
    // If no redirect param, stay on auth page (user may want to see their account)
  }
});

// ── Tab param ──
if (new URLSearchParams(location.search).get('tab') === 'signup') { setTimeout(() => window.switchTab('signup'), 100); }

// ══ HELPERS ══
window.switchTab = (tab) => {
  clearAlert();
  document.getElementById('login-section').style.display   = tab==='login'  ? 'block':'none';
  document.getElementById('signup-section').style.display  = tab==='signup' ? 'block':'none';
  document.getElementById('forgot-section').style.display  = tab==='forgot' ? 'block':'none';
  if(document.getElementById('phone-section')) {
    document.getElementById('phone-section').style.display = tab==='phone' ? 'block':'none';
    document.getElementById('otp-section').style.display   = tab==='otp' ? 'block':'none';
  }
  document.getElementById('tab-login').classList.toggle('active',  tab==='login' || tab==='phone' || tab==='otp');
  document.getElementById('tab-signup').classList.toggle('active', tab==='signup');
  if (tab==='signup') suGoTo(1);
};
window.showForgot = () => {
  ['login-section','signup-section','phone-section','otp-section'].forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display='none'; });
  document.getElementById('forgot-section').style.display='block';
};
window.showLogin  = () => switchTab('login');

function showAlert(msg, type='error') {
  const el = document.getElementById('auth-alert');
  el.textContent = (type==='error'?'⚠️ ':'✅ ') + msg;
  el.className = `auth-alert show ${type}`;
}
function clearAlert() { document.getElementById('auth-alert').className='auth-alert'; }
function setLoading(id, on) {
  const b = document.getElementById(id);
  b.disabled = on; b.classList.toggle('loading', on);
}
function showErr(inputId, errId) {
  document.getElementById(inputId)?.classList.add('error');
  document.getElementById(errId).style.display='block';
}
function clearErr(inputId, errId) {
  document.getElementById(inputId)?.classList.remove('error');
  document.getElementById(errId).style.display='none';
}
window.togglePw = (id, btn) => {
  const inp = document.getElementById(id);
  inp.type = inp.type==='password' ? 'text' : 'password';
  btn.textContent = inp.type==='password' ? '👁' : '🙈';
};
window.checkPwStrength = (val) => {
  let score=0;
  if(val.length>=8) score++;
  if(/[A-Z]/.test(val)) score++;
  if(/[0-9]/.test(val)) score++;
  if(/[^A-Za-z0-9]/.test(val)) score++;
  const widths=['0%','25%','50%','75%','100%'];
  const colors=['','#E85555','#F5A623','#4AAFE8','#2ECC8E'];
  const labels=['Enter a password','Weak','Fair','Good','Strong 💪'];
  document.getElementById('pw-fill').style.width=widths[score];
  document.getElementById('pw-fill').style.background=colors[score];
  document.getElementById('pw-strength-text').textContent=labels[score];
};

// ── Synchronize User Profile with backend ──
async function syncUserProfile(user, additionalData = {}) {
  const token = await user.getIdToken(true);
  const response = await fetch(`${(window.TRIMZY_CONFIG?.API_URL || 'https://trimzy-backend.onrender.com/api')}/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(additionalData)
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to sync user profile with backend');
  }

  const result = await response.json();
  return result.user;
}

// ══ LOGIN ══
window.submitLogin = async (e) => {
  e.preventDefault(); clearAlert();
  let valid = true;
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-password').value;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showErr('login-email','login-email-err'); valid=false; }
  else clearErr('login-email','login-email-err');
  if(!pw){ showErr('login-password','login-pw-err'); valid=false; }
  else clearErr('login-password','login-pw-err');
  if(!valid) return;

  setLoading('login-btn', true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pw);
    // Sync profile with backend
    const profile = await syncUserProfile(cred.user);
    sessionStorage.setItem('ss_user', JSON.stringify({
      uid: cred.user.uid,
      mongoId: profile._id,
      name: profile.name || cred.user.displayName || 'User',
      email: cred.user.email,
      phone: profile.phone || '',
      area:  profile.area  || '',
      initials: profile.initials || 'U'
    }));
    showAlert('Login successful! Redirecting...','success');
    setTimeout(()=>{
      location.href = new URLSearchParams(location.search).get('redirect')||'/app';
    }, 800);
  } catch(err) {
    console.error("Email Login Error Details:", err);
    setLoading('login-btn', false);
    const msgs = {
      'auth/user-not-found': 'No account found with this email. Please sign up.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/invalid-email': 'Please enter a valid email address.'
    };
    showAlert(msgs[err.code] || 'Login failed. Please try again.', 'error');
  }
};

// ══ GOOGLE ══
window.googleLogin = async () => {
  clearAlert();
  try {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;
    // Sync/update profile in Backend
    const profile = await syncUserProfile(user, {
      name:  user.displayName || 'Google User',
      phone: user.phoneNumber || '',
      role: 'customer'
    });
    sessionStorage.setItem('ss_user', JSON.stringify({
      uid:  user.uid,
      mongoId: profile._id,
      name: profile.name,
      email:profile.email,
      phone:profile.phone || '',
      area: profile.area || '',
      initials:profile.initials
    }));
    location.href = new URLSearchParams(location.search).get('redirect')||'/app';
  } catch(err) {
    console.error("Google Sign-In Error Details:", err);
    const msgs = {
      'auth/popup-closed-by-user': 'Sign-in window was closed.',
      'auth/cancelled-popup-request': 'Sign-in cancelled.'
    };
    showAlert(msgs[err.code]||'Google sign-in failed. Please try again.','error');
  }
};

// ══ SIGNUP STEPS ══
let suData = {};
window.suGoTo = (n) => {
  [1,2].forEach(i=>{
    document.getElementById(`su-step-${i}`).classList.toggle('active',i===n);
    document.getElementById(`sdot-${i}`).classList.toggle('done',i<=n);
  });
};

window.suStep1 = (e) => {
  e.preventDefault(); clearAlert();
  let valid = true;
  const name  = document.getElementById('su-name').value.trim();
  const phone = document.getElementById('su-phone').value.trim().replace(/\s/g,'');
  const email = document.getElementById('su-email').value.trim();
  if(name.length<2){ showErr('su-name','su-name-err'); valid=false; } else clearErr('su-name','su-name-err');
  if(!/^\d{10}$/.test(phone)){ showErr('su-phone','su-phone-err'); valid=false; } else clearErr('su-phone','su-phone-err');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showErr('su-email','su-email-err'); valid=false; } else clearErr('su-email','su-email-err');
  if(!valid) return;
  suData = { name, phone, email, area: document.getElementById('su-area').value };
  suGoTo(2);
};

window.suFinish = async (e) => {
  e.preventDefault(); clearAlert();
  let valid = true;
  const pw  = document.getElementById('su-password').value;
  const pw2 = document.getElementById('su-password2').value;
  const terms = document.getElementById('su-terms').checked;
  if(pw.length<8){ showErr('su-password','su-pw-err'); valid=false; } else clearErr('su-password','su-pw-err');
  if(pw!==pw2){ showErr('su-password2','su-pw2-err'); valid=false; } else clearErr('su-password2','su-pw2-err');
  if(!terms){ document.getElementById('su-terms-err').style.display='block'; valid=false; } else document.getElementById('su-terms-err').style.display='none';
  if(!valid) return;

  setLoading('su-btn-2', true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, suData.email, pw);
    // Update display name
    await updateProfile(cred.user, { displayName: suData.name });
    // Sync full profile with Backend
    const profile = await syncUserProfile(cred.user, {
      name:     suData.name,
      phone:    suData.phone,
      area:     suData.area,
      role:     'customer'
    });
    sessionStorage.setItem('ss_user', JSON.stringify({
      uid:      cred.user.uid,
      mongoId:  profile._id,
      name:     profile.name,
      email:    profile.email,
      phone:    profile.phone,
      area:     profile.area,
      initials: profile.initials
    }));
    showAlert('Account created! Welcome to Trimzy 🎉','success');
    setTimeout(()=>{
      location.href = new URLSearchParams(location.search).get('redirect')||'/app';
    }, 900);
  } catch(err) {
    setLoading('su-btn-2', false);
    const msgs = {
      'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
      'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
      'auth/invalid-email': 'Please enter a valid email address.'
    };
    showAlert(msgs[err.code]||'Sign up failed. Please try again.','error');
  }
};

// ══ FORGOT PASSWORD ══
window.submitForgot = async (e) => {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    document.getElementById('forgot-err').style.display='block'; return;
  }
  document.getElementById('forgot-err').style.display='none';
  setLoading('forgot-btn', true);
  try {
    await sendPasswordResetEmail(auth, email);
    showAlert('Reset link sent! Check your email inbox.','success');
    setTimeout(showLogin, 3000);
  } catch(err) {
    setLoading('forgot-btn', false);
    showAlert('Could not send reset email. Check the address and try again.','error');
  }
};

// ══ PHONE AUTH ══
let confirmationResult = null;

function setupRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'phone-btn', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
      }
    });
  }
}

window.submitPhoneAuth = async (e) => {
  e.preventDefault(); clearAlert();
  const phone = document.getElementById('login-phone').value.trim().replace(/\s/g,'');
  if(!/^\d{10}$/.test(phone)) {
    showErr('login-phone','login-phone-err'); return;
  } else { clearErr('login-phone','login-phone-err'); }
  
  setLoading('phone-btn', true);
  setupRecaptcha();
  const phoneNumber = '+91' + phone;
  const appVerifier = window.recaptchaVerifier;

  try {
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    setLoading('phone-btn', false);
    document.getElementById('otp-subtitle').textContent = `Code sent to +91 ${phone}`;
    switchTab('otp');
  } catch (error) {
    setLoading('phone-btn', false);
    showAlert(`Error: ${error.code || error.message}`, 'error');
    console.error(error);
    if(window.recaptchaVerifier) {
      window.recaptchaVerifier.render().then(t => window.recaptchaVerifier.reset(t)).catch(()=>{});
    }
  }
};

window.verifyOTP = async (e) => {
  e.preventDefault(); clearAlert();
  const code = document.getElementById('otp-code').value.trim();
  if(!/^\d{6}$/.test(code)) {
    showErr('otp-code','otp-code-err'); return;
  } else { clearErr('otp-code','otp-code-err'); }

  setLoading('otp-btn', true);
  try {
    const cred = await confirmationResult.confirm(code);
    const user = cred.user;
    
    // Sync profile with Backend
    const syncRes = await syncUserProfile(user, {
      name: user.displayName || 'Trimzy User',
      email: user.email || '',
      phone: user.phoneNumber || '',
      area: '',
      role: 'customer'
    });
    const profile = syncRes.user;

    sessionStorage.setItem('ss_user', JSON.stringify({
      uid:  user.uid,
      mongoId: profile._id,
      name: profile.name,
      email:profile.email,
      phone:profile.phone,
      area: profile.area,
      initials: profile.initials
    }));
    
    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(()=>{
      location.href = new URLSearchParams(location.search).get('redirect')||'/app';
    }, 800);
  } catch (error) {
    setLoading('otp-btn', false);
    showAlert('Invalid OTP. Please check the code and try again.', 'error');
    console.error(error);
  }
};
