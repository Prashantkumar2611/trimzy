import { auth } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
async function syncUserProfile(user, additionalData = {}) {
  const token = await user.getIdToken(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(additionalData)
  });
  if (!response.ok) throw new Error('Failed to sync profile');
  return await response.json();
}

async function fetchUserProfile(user) {
  const token = await user.getIdToken(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Profile not found');
  const data = await response.json();
  return data.user;
}

// Redirect if already logged in as barber
onAuthStateChanged(auth, async user => {
  if (user) {
    try {
      const userData = await fetchUserProfile(user);
      if (userData && userData.role === 'barber') {
        location.href = '/barber-dashboard';
      }
    } catch(e) {
      // Ignore if not found
    }
  }
});

window.doLogin = async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const pw    = document.getElementById('password').value;
  if (!email || !pw) { showAlert('Please enter your email and password.', 'error'); return; }

  setLoading(true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pw);
    
    // Check if this user is a barber on the backend
    let profile = null;
    try {
      profile = await fetchUserProfile(cred.user);
    } catch(e) {
      // Sync just in case they were approved via admin but not synced yet
      const syncRes = await syncUserProfile(cred.user);
      profile = syncRes.user;
    }

    if (!profile || profile.role !== 'barber') {
      await auth.signOut();
      showAlert('This account is not registered as a barber. Please contact Trimzy support.', 'error');
      setLoading(false);
      return;
    }
    
    if (profile.status === 'pending') {
      await auth.signOut();
      showAlert('Your account has not been approved yet. Please wait a little longer, or Contact Us if there is an issue.', 'error');
      setLoading(false);
      return;
    }
    
    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(() => location.href = '/barber-dashboard', 800);
  } catch(err) {
    console.error("Login failed:", err);
    setLoading(false);
    const msgs = {
      'auth/user-not-found':     'No barber account found with this email.',
      'auth/wrong-password':     'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/too-many-requests':  'Too many attempts. Please try again later.'
    };
    const detailedMsg = msgs[err.code] || `Login Error: ${err.message}`;
    showAlert(detailedMsg, 'error');
  }
};

window.showForgot = async () => {
  const email = document.getElementById('email').value.trim();
  if (!email) { 
    showAlert('⚠️ Please enter your email address first, then click Forgot Password.', 'info'); 
    return; 
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    showAlert('✅ Password reset link sent! Please check your email inbox.', 'success');
  } catch(err) {
    console.error("Forgot PW Error:", err);
    const msgs = {
      'auth/user-not-found': 'No barber account found with this email.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.'
    };
    showAlert('⚠️ ' + (msgs[err.code] || 'Could not send reset email. Please try again.'), 'error');
  }
};

window.togglePw = () => {
  const inp = document.getElementById('password');
  inp.type = inp.type === 'password' ? 'text' : 'password';
};

function showAlert(msg, type) {
  const el = document.getElementById('auth-alert');
  el.textContent = (type==='error'?'⚠️ ':'✅ ') + msg;
  el.className = `auth-alert show ${type}`;
}

function setLoading(on) {
  const btn = document.getElementById('login-btn');
  btn.disabled = on;
  btn.classList.toggle('loading', on);
}
