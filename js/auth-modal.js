// ── INITIALIZATION (Immediate Global Exposure) ──
window.openAuthModal = () => {
    const modal = document.getElementById('auth-modal-backdrop');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showStep('am-phone-step'); // Default step
    }
};
window.openAuthModal.isReal = true;

window.closeAuthModal = () => {
    const modal = document.getElementById('auth-modal-backdrop');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.firebaseLogout = async () => {
    try {
        await signOut(auth);
        sessionStorage.removeItem('ss_user');
        window.location.href = 'index.html';
    } catch (e) {
        console.error("Logout Error:", e);
        sessionStorage.removeItem('ss_user');
        window.location.href = 'index.html';
    }
};

window.showStep = (stepId) => {
    const steps = ['am-phone-step', 'am-otp-step', 'am-email-login-step', 'am-signup-step1', 'am-signup-step2', 'am-forgot-step'];
    steps.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(stepId);
    if (target) target.classList.remove('hidden');
    // Clear errors
    document.querySelectorAll('.am-error').forEach(el => el.style.display = 'none');
};

import { auth } from './firebase.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ── MODAL HTML TEMPLATE ──
const modalTemplate = `
<div class="auth-modal-backdrop" id="auth-modal-backdrop">
  <div class="auth-modal-card">
    <button class="am-close" onclick="closeAuthModal()">✕</button>
    <div class="am-header">
      <div class="am-logo">Trim<span>zy</span></div>
      <p>Experience the best in Barbering, Grooming, and Stylists.</p>
    </div>
    <div class="am-body">
      
      <!-- STEP 1: PHONE -->
      <div id="am-phone-step" class="am-center">
        <h2 class="am-title">Enter your mobile number</h2>
        <p class="am-subtitle">If you don't have an account yet, we'll create one for you</p>
        <div class="am-form-group">
          <div class="am-input-wrap am-center-wrap">
            <div class="am-prefix">🇮🇳 +91</div>
            <input type="tel" class="am-input" id="am-phone-input" placeholder="Enter mobile number" maxlength="10">
          </div>
          <div id="am-phone-error" class="am-error">Please enter a valid 10-digit number.</div>
        </div>
        <button class="am-btn-primary" id="am-phone-continue">Continue</button>
        <div class="am-divider"><span>or</span></div>
        <button class="am-btn-google" id="am-btn-google-1">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>
        <button class="am-btn-outline" onclick="showStep('am-email-login-step')" style="margin-top:12px">✉️ Continue with Email</button>
      </div>

      <!-- STEP 2: OTP -->
      <div id="am-otp-step" class="hidden">
        <h2 class="am-title">Verify OTP</h2>
        <p class="am-subtitle" id="am-otp-subtitle">Sent to +91 00000 00000</p>
        <div class="am-otp-inputs" id="otp-input-container">
          <input type="text" class="am-otp-input" maxlength="1" data-index="0">
          <input type="text" class="am-otp-input" maxlength="1" data-index="1">
          <input type="text" class="am-otp-input" maxlength="1" data-index="2">
          <input type="text" class="am-otp-input" maxlength="1" data-index="3">
          <input type="text" class="am-otp-input" maxlength="1" data-index="4">
          <input type="text" class="am-otp-input" maxlength="1" data-index="5">
        </div>
        <div id="am-otp-error" class="am-error" style="text-align:center">Invalid code. Please try again.</div>
        <button class="am-btn-primary" id="am-otp-verify">Verify & Log In</button>
        <div style="text-align:center; margin-top:16px;">
          <button onclick="showStep('am-phone-step')" class="am-link-btn">← Change number</button>
        </div>
      </div>

      <!-- STEP 3: EMAIL LOGIN -->
      <div id="am-email-login-step" class="hidden am-center">
        <h2 class="am-title">Welcome back</h2>
        <p class="am-subtitle">Log in to your Trimzy account</p>
        <div class="am-form-group">
          <label class="am-label">Email Address</label>
          <input type="email" class="am-input" id="am-login-email" placeholder="you@example.com">
          <div id="am-login-email-error" class="am-error">Invalid email address.</div>
        </div>
        <div class="am-form-group">
          <label class="am-label">Password</label>
          <input type="password" class="am-input" id="am-login-password" placeholder="Your password">
          <div id="am-login-password-error" class="am-error">Please enter your password.</div>
        </div>
        <div style="text-align:right; margin-bottom:16px">
          <button onclick="showStep('am-forgot-step')" class="am-link-btn" style="font-size:12px">Forgot password?</button>
        </div>
        <button class="am-btn-primary" id="am-email-login-btn">Log In</button>
        <div class="am-footer">
          Don't have an account? <button onclick="showStep('am-signup-step1')" class="am-link-btn">Sign up →</button>
        </div>
        <div style="text-align:center; margin-top:16px;">
          <button onclick="showStep('am-phone-step')" class="am-link-btn">← Use Phone instead</button>
        </div>
      </div>

      <!-- STEP 4: SIGNUP 1 -->
      <div id="am-signup-step1" class="hidden am-center">
        <h2 class="am-title">Create Account</h2>
        <p class="am-subtitle">Step 1 of 2 — Your details</p>
        <div class="am-form-group">
          <label class="am-label">Full Name</label>
          <input type="text" class="am-input" id="am-signup-name" placeholder="Arjun Mohanty">
        </div>
        <div class="am-form-group">
          <label class="am-label">Phone Number</label>
          <div class="am-input-wrap">
            <div class="am-prefix">🇮🇳 +91</div>
            <input type="tel" class="am-input" id="am-signup-phone" placeholder="98765 43210" maxlength="10">
          </div>
        </div>
        <div class="am-form-group">
          <label class="am-label">Email Address</label>
          <input type="email" class="am-input" id="am-signup-email" placeholder="arjun@example.com">
        </div>
        <div class="am-form-group">
          <label class="am-label">Your Area</label>
          <select class="am-input" id="am-signup-area">
            <option value="">Select area</option>
            <option>Saheed Nagar</option><option>Bapuji Nagar</option>
            <option>IRC Village</option><option>Patia</option>
            <option>Nayapalli</option><option>Kharvel Nagar</option>
            <option>Janpath</option><option>Other</option>
          </select>
        </div>
        <button class="am-btn-primary" id="am-signup-next">Continue →</button>
        <div class="am-footer">
          Already have an account? <button onclick="showStep('am-email-login-step')" class="am-link-btn">Log in</button>
        </div>
      </div>

      <!-- STEP 5: SIGNUP 2 -->
      <div id="am-signup-step2" class="hidden am-center">
        <h2 class="am-title">Set Password</h2>
        <p class="am-subtitle">Step 2 of 2 — Secure your account</p>
        <div class="am-form-group">
          <label class="am-label">Create Password</label>
          <input type="password" class="am-input" id="am-signup-password" placeholder="At least 8 characters">
        </div>
        <div class="am-form-group">
          <label class="am-label">Confirm Password</label>
          <input type="password" class="am-input" id="am-signup-password-confirm" placeholder="Repeat password">
        </div>
        <button class="am-btn-primary" id="am-signup-finish">Create My Account</button>
        <div style="text-align:center; margin-top:16px;">
          <button onclick="showStep('am-signup-step1')" class="am-link-btn">← Back</button>
        </div>
      </div>

      <!-- STEP 6: FORGOT -->
      <div id="am-forgot-step" class="hidden am-center">
        <h2 class="am-title">Reset Password</h2>
        <p class="am-subtitle">We'll send a reset link to your email</p>
        <div class="am-form-group">
          <label class="am-label">Email Address</label>
          <input type="email" class="am-input" id="am-forgot-email" placeholder="you@example.com">
        </div>
        <button class="am-btn-primary" id="am-forgot-send">Send Reset Link</button>
        <div style="text-align:center; margin-top:16px;">
          <button onclick="showStep('am-email-login-step')" class="am-link-btn">← Back to login</button>
        </div>
      </div>

      <div class="am-footer am-center">
        By continuing, you agree to our<br/>
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  </div>
  <div id="am-recaptcha"></div>
</div>
<style>
.am-center { text-align: center; }
.am-center-wrap { margin: 0 auto; display: flex; max-width: 100%; justify-content: center; }
.am-label { font-size: 13px; font-weight: 600; color: var(--navy); margin-bottom: 6px; display: block; text-align: center; }
.am-error { color: #E55555; font-size: 12px; margin-top: 6px; display: none; text-align: center; }
.am-link-btn { background: none; border: none; color: var(--navy); font-weight: 700; font-size: 13px; cursor: pointer; text-decoration: underline; padding: 0; }
</style>
`;

// ── INITIALIZATION IIFE ──
(function initAuthModal() {
    if (document.getElementById('auth-modal-backdrop')) return;
    const div = document.createElement('div');
    div.innerHTML = modalTemplate;
    document.body.appendChild(div);

    // Bind Event Listeners
    document.getElementById('am-btn-google-1').onclick = googleLogin;
    document.getElementById('am-phone-continue').onclick = submitPhoneAuth;
    document.getElementById('am-otp-verify').onclick = verifyOTP;
    document.getElementById('am-email-login-btn').onclick = submitEmailLogin;
    document.getElementById('am-signup-next').onclick = submitSignup1;
    document.getElementById('am-signup-finish').onclick = submitSignupFinish;
    document.getElementById('am-forgot-send').onclick = submitForgot;

    // OTP Input Auto-focus & Numeric logic
    const otpInputs = document.querySelectorAll('.am-otp-input');
    otpInputs.forEach((input, idx) => {
        input.oninput = (e) => {
            if (e.target.value && idx < otpInputs.length - 1) {
                otpInputs[idx + 1].focus();
            }
        };
        input.onkeydown = (e) => {
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                otpInputs[idx - 1].focus();
            }
        };
    });
})();

// ── AUTH LOGIC ──

async function syncUserProfile(user, additionalData = {}) {
    const token = await user.getIdToken(true);
    const response = await fetch(`${window.TRIMZY_CONFIG.API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(additionalData)
    });
    if (!response.ok) throw new Error('Failed to sync profile');
    return await response.json();
}

async function fetchUserProfile(user) {
    const token = await user.getIdToken(true);
    const response = await fetch(`${window.TRIMZY_CONFIG.API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Profile not found');
    const data = await response.json();
    return data.user;
}

async function sendWelcomeEmail(email, name) {
    if (!email) return;
    const BREVO_API_KEY = (window.TRIMZY_CONFIG && window.TRIMZY_CONFIG.BREVO_API_KEY) || '';
    if (!BREVO_API_KEY) return;

    try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { 
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Trimzy", email: "official@trimzy.co.in" },
                to: [{ email: email, name: name || "Customer" }],
                subject: "Welcome to Trimzy! ✂️",
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A2E; line-height: 1.6;">
                        <h2 style="color: #1A1A2E; margin-bottom: 20px;">Dear ${name || "Customer"},</h2>
                        <p style="font-size: 15px;">You've just joined something that's changing the way India gets its haircut.</p>
                        <p style="font-size: 15px;">At Trimzy, we believe your time is too valuable to spend standing in a queue. So we built something better.</p>
                        
                        <h3 style="color: #E8A44A; margin-top: 30px; margin-bottom: 15px; font-size: 18px;">Here's what you now have access to:</h3>
                        
                        <ul style="list-style-type: none; padding: 0; margin: 0;">
                            <li style="margin-bottom: 15px;">
                                <strong style="font-size: 15px; color: #1A1A2E;">⏱️ Real Time Queue Tracking</strong><br>
                                <span style="color: #555; font-size: 14px;">See exactly how many people are ahead of you before you even leave home.</span>
                            </li>
                            <li style="margin-bottom: 15px;">
                                <strong style="font-size: 15px; color: #1A1A2E;">⭐ Premium Booking &mdash; Zero Wait</strong><br>
                                <span style="color: #555; font-size: 14px;">Skip the queue entirely. Book a premium slot and walk straight to the chair.</span>
                            </li>
                            <li style="margin-bottom: 15px;">
                                <strong style="font-size: 15px; color: #1A1A2E;">🏠 Home Service</strong><br>
                                <span style="color: #555; font-size: 14px;">Can't come to the shop? No problem. Book a professional barber to come to you.</span>
                            </li>
                        </ul>

                        <p style="margin-top: 25px; font-size: 15px;">This is not just an app. This is your personal barbershop &mdash; on your terms, on your schedule, wherever you are.</p>
                        
                        <p style="font-size: 15px;">Thousands of customers across India are already experiencing the Trimzy difference. Now it's your turn.</p>
                        
                        <p style="font-weight: bold; font-size: 16px; margin-top: 30px; color: #1A1A2E;">Welcome aboard. Your chair is waiting.</p>

                        <div style="margin: 35px 0;">
                            <a href="https://trimzy.co.in/app.html" style="background: #E8A44A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Book Your First Appointment →</a>
                        </div>

                        <p style="margin-top: 30px; color: #555; font-size: 14px;">
                            Warm regards,<br>
                            <strong style="color: #1A1A2E;">Team Trimzy</strong>
                        </p>
                    </div>
                `
            })
        });
        console.log("Welcome email sent to " + email);
    } catch (e) {
        console.error("Failed to send welcome email:", e);
    }
}

async function sendWelcomeBackEmail(email, name) {
    if (!email) return;
    const BREVO_API_KEY = (window.TRIMZY_CONFIG && window.TRIMZY_CONFIG.BREVO_API_KEY) || '';
    if (!BREVO_API_KEY) return;

    try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: { 
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Trimzy", email: "official@trimzy.co.in" },
                to: [{ email: email, name: name || "Customer" }],
                subject: "Welcome Back to Trimzy! ✂️",
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A2E; line-height: 1.6;">
                        <h2 style="color: #1A1A2E; margin-bottom: 20px;">Welcome back, ${name || "Customer"}!</h2>
                        <p style="font-size: 15px;">We noticed you just logged into your Trimzy account.</p>
                        <p style="font-size: 15px;">Ready for your next fresh cut? Your favorite barbers are just a few clicks away. Skip the queue and book a premium slot directly from the app.</p>
                        
                        <div style="margin: 35px 0;">
                            <a href="https://trimzy.co.in/app.html" style="background: #E8A44A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Book Your Next Appointment →</a>
                        </div>

                        <p style="margin-top: 30px; color: #555; font-size: 14px;">
                            Warm regards,<br>
                            <strong style="color: #1A1A2E;">Team Trimzy</strong>
                        </p>
                    </div>
                `
            })
        });
        console.log("Welcome back email sent to " + email);
    } catch (e) {
        console.error("Failed to send welcome back email:", e);
    }
}

async function googleLogin() {
    try {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        const user = cred.user;

        const initials = (user.displayName || 'GU').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const profileData = {
            name: user.displayName || 'Google User',
            phone: user.phoneNumber || '',
            area: '',
            role: 'customer'
        };

        const syncResult = await syncUserProfile(user, profileData);
        const profile = syncResult.user;
        const isNewUser = syncResult.isNew;
        
        if (isNewUser && user.email) {
            await sendWelcomeEmail(user.email, profile.name);
        } else if (!isNewUser && user.email) {
            await sendWelcomeBackEmail(user.email, profile.name);
        }

        sessionStorage.setItem('ss_user', JSON.stringify({ 
            uid: user.uid,
            mongoId: profile._id,
            name: profile.name,
            email: user.email,
            phone: profile.phone || '',
            area: profile.area || '',
            initials: profile.initials || initials
        }));
        location.reload();
    } catch (err) {
        console.error(err);
        alert('Google login failed.');
    }
}

// PHONE/OTP
let confirmationResult = null;
async function submitPhoneAuth() {
    const phone = document.getElementById('am-phone-input').value.trim().replace(/\s/g, '');
    if (!/^\d{10}$/.test(phone)) {
        document.getElementById('am-phone-error').style.display = 'block';
        return;
    }
    const btn = document.getElementById('am-phone-continue');
    btn.disabled = true; btn.textContent = 'Sending...';

    try {
        if (!window.amRecaptchaVerifier) {
            window.amRecaptchaVerifier = new RecaptchaVerifier(auth, 'am-recaptcha', { 'size': 'invisible' });
        }
        confirmationResult = await signInWithPhoneNumber(auth, '+91' + phone, window.amRecaptchaVerifier);
        document.getElementById('am-otp-subtitle').textContent = `Sent to +91 ${phone}`;
        showStep('am-otp-step');
    } catch (error) {
        btn.disabled = false; btn.textContent = 'Continue';
        console.error(error);
        alert('Error sending SMS.');
    }
}

async function verifyOTP() {
    const code = Array.from(document.querySelectorAll('.am-otp-input')).map(i => i.value).join('');
    if (code.length !== 6) return;
    const btn = document.getElementById('am-otp-verify');
    btn.disabled = true; btn.textContent = 'Verifying...';

    try {
        const cred = await confirmationResult.confirm(code);
        const user = cred.user;
        const syncResult = await syncUserProfile(user, {
            name: 'Trimzy User',
            phone: user.phoneNumber,
            role: 'customer'
        });
        const profile = syncResult.user;

        sessionStorage.setItem('ss_user', JSON.stringify({
            uid: user.uid,
            mongoId: profile._id,
            name: profile.name,
            email: profile.email || '',
            phone: profile.phone || user.phoneNumber,
            area: profile.area || '',
            initials: profile.initials || 'TU'
        }));
        location.reload();
    } catch (error) {
        btn.disabled = false; btn.textContent = 'Verify & Log In';
        document.getElementById('am-otp-error').style.display = 'block';
    }
}

// EMAIL LOGIN
async function submitEmailLogin() {
    const email = document.getElementById('am-login-email').value.trim();
    const pw = document.getElementById('am-login-password').value;
    if (!email || !pw) return;

    const btn = document.getElementById('am-email-login-btn');
    btn.disabled = true; btn.textContent = 'Logging in...';

    try {
        const cred = await signInWithEmailAndPassword(auth, email, pw);
        let profile = {};
        try {
            profile = await fetchUserProfile(cred.user);
        } catch (e) {
            // Profile might not exist yet if created purely via Firebase Auth, so sync it
            const syncRes = await syncUserProfile(cred.user, { role: 'customer' });
            profile = syncRes.user;
        }
        
        sessionStorage.setItem('ss_user', JSON.stringify({
            uid: cred.user.uid,
            mongoId: profile._id,
            name: profile.name || 'User',
            email: cred.user.email,
            phone: profile.phone || '',
            area: profile.area || '',
            initials: profile.initials || 'U'
        }));
        location.reload();
    } catch (err) {
        btn.disabled = false; btn.textContent = 'Log In';
        alert('Invalid email or password.');
    }
}

// SIGNUP
let signupData = {};
function submitSignup1() {
    const name = document.getElementById('am-signup-name').value.trim();
    const phone = document.getElementById('am-signup-phone').value.trim();
    const email = document.getElementById('am-signup-email').value.trim();
    const area = document.getElementById('am-signup-area').value;

    if (!name || !phone || !email) { alert('Please fill all required fields.'); return; }
    signupData = { name, phone, email, area };
    showStep('am-signup-step2');
}

async function submitSignupFinish() {
    const pw = document.getElementById('am-signup-password').value;
    const pw2 = document.getElementById('am-signup-password-confirm').value;
    if (pw.length < 8) { alert('Password too short.'); return; }
    if (pw !== pw2) { alert('Passwords do not match.'); return; }

    const btn = document.getElementById('am-signup-finish');
    btn.disabled = true; btn.textContent = 'Creating account...';

    try {
        const cred = await createUserWithEmailAndPassword(auth, signupData.email, pw);
        await updateProfile(cred.user, { displayName: signupData.name });
        const syncRes = await syncUserProfile(cred.user, {
            name: signupData.name,
            phone: signupData.phone,
            area: signupData.area,
            role: 'customer'
        });
        const profile = syncRes.user;
        
        if (signupData.email) {
            await sendWelcomeEmail(signupData.email, signupData.name);
        }
        
        sessionStorage.setItem('ss_user', JSON.stringify({
            uid: cred.user.uid,
            mongoId: profile._id,
            name: profile.name,
            email: signupData.email,
            phone: profile.phone,
            area: profile.area,
            initials: profile.initials
        }));
        location.reload();
    } catch (err) {
        btn.disabled = false; btn.textContent = 'Create My Account';
        alert(err.message);
    }
}

// FORGOT
async function submitForgot() {
    const email = document.getElementById('am-forgot-email').value.trim();
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    
    const btn = document.getElementById('am-forgot-send');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        await sendPasswordResetEmail(auth, email);
        alert('✅ Password reset link sent! Check your email inbox.');
        showStep('am-email-login-step');
    } catch (err) {
        console.error("Forgot PW Error:", err);
        const msgs = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many attempts. Please try again later.'
        };
        alert('⚠️ ' + (msgs[err.code] || 'Could not send reset email. Please try again.'));
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

// ── REAL-TIME AUTH SYNC (Customer-Only) ──
onAuthStateChanged(auth, async (user) => {
    // Exclude dashboards to prevent logic cross-over
    const isDashboard = location.href.includes('barber-dashboard') || location.href.includes('admin') || location.href.includes('barber-auth') || location.href.includes('barber-login');
    if (isDashboard) return;

    if (user) {
        try {
            // Only sync if the user exists in the CUSTOMER collection
            const userData = await fetchUserProfile(user);
            
            if (userData && userData.role !== 'barber') {
                const sessionUser = {
                    uid: user.uid,
                    mongoId: userData._id,
                    name: userData.name || 'User',
                    email: user.email,
                    phone: user.phoneNumber || userData.phone || '',
                    initials: userData.initials || 'U'
                };
                sessionStorage.setItem('ss_user', JSON.stringify(sessionUser));
                if (window.injectAuthNav) window.injectAuthNav();
            } else {
                // Not a customer (likely a barber) — Treat as logged out on main site
                sessionStorage.removeItem('ss_user');
                if (window.injectAuthNav) window.injectAuthNav();
            }
        } catch (e) {
            // Profile not found in MongoDB. Attempt to sync/migrate them automatically.
            try {
                const syncRes = await syncUserProfile(user, { role: 'customer' });
                const newProfile = syncRes.user;
                const sessionUser = {
                    uid: user.uid,
                    mongoId: newProfile._id,
                    name: newProfile.name || 'User',
                    email: user.email,
                    phone: user.phoneNumber || newProfile.phone || '',
                    initials: newProfile.initials || 'U'
                };
                sessionStorage.setItem('ss_user', JSON.stringify(sessionUser));
                if (window.injectAuthNav) window.injectAuthNav();
            } catch (syncErr) {
                console.error("Auth Sync Error:", syncErr);
                sessionStorage.removeItem('ss_user');
                if (window.injectAuthNav) window.injectAuthNav();
            }
        }
    } else {
        // Logged out
        sessionStorage.removeItem('ss_user');
        if (window.injectAuthNav) window.injectAuthNav();
    }
});
