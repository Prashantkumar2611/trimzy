import { auth } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, query, where, getDocs, setDoc, deleteDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from './firebase.js';

// Redirect if already logged in as barber
onAuthStateChanged(auth, async user => {
  if (user) {
    const snap = await getDoc(doc(db, 'barbers', user.uid));
    if (snap.exists()) location.href = 'barber-dashboard.html';
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
    // Check if this user is a barber
    let snap = await getDoc(doc(db, 'barbers', cred.user.uid));
    
    // Fallback: If not found by UID, try searching by email
    if (!snap.exists()) {
      console.log("Barber not found by UID, trying email fallback...");
      const q = query(collection(db, "barbers"), where("email", "==", email));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        snap = qSnap.docs[0];
        // Auto-fix: Link this UID to the document for next time
        await setDoc(doc(db, "barbers", cred.user.uid), { ...snap.data(), uid: cred.user.uid });
        // Optional: delete the old random ID document if you want to be extra clean
        if (snap.id !== cred.user.uid) {
          await deleteDoc(doc(db, "barbers", snap.id));
        }
        // Re-get the snap from the new location to be safe
        snap = await getDoc(doc(db, "barbers", cred.user.uid));
      }
    }

    if (!snap.exists()) {
      await auth.signOut();
      showAlert('This account is not registered as a barber. Please contact Trimzy support.', 'error');
      setLoading(false);
      return;
    }
    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(() => location.href = 'barber-dashboard.html', 800);
  } catch(err) {
    console.error("Login failed:", err);
    setLoading(false);
    const msgs = {
      'auth/user-not-found':     'No barber account found with this email.',
      'auth/wrong-password':     'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/too-many-requests':  'Too many attempts. Please try again later.',
      'auth/unauthorized-domain': 'This domain (trimzy.co.in) is not authorized in Firebase Console.',
      'auth/operation-not-allowed': 'Email/Password login is not enabled in Firebase Console.'
    };
    const detailedMsg = msgs[err.code] || `Login Error (${err.code}): ${err.message}`;
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
