import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/auth.css';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.style.display = 'none', 600); }
    // Dynamically import the auth.js script so it runs after the component mounts
    import('../../js/auth.js').then((module) => {
      // module loaded
    }).catch(err => console.error(err));
  }, []);

  return (
    <>
      
  {/*  GLOBAL LOADER  */}
  <div id="global-loader" className="global-loader">
    <div className="gl-logo">Trim<span>zy</span></div>
    <div className="gl-blueprint"></div>
  </div><div className="auth-page">

  {/*  LEFT  */}
  <div className="auth-left">
    <div className="al-bg1"></div><div className="al-bg2"></div>
    <Link to="/" className="al-logo">Trim<span>zy</span></Link>
    <div>
      <h1 className="al-headline">Your next great<br/><span className="accent">haircut</span> starts here.</h1>
      <p className="al-sub">Join Trimzy and never wait at a barbershop again. Book in 60 seconds, walk in on time.</p>
      <div className="al-perks">
        <div className="al-perk"><div className="al-perk-icon">🗓️</div><div className="al-perk-text">Book any barber in Bhubaneswar instantly</div></div>
        <div className="al-perk"><div className="al-perk-icon">🏠</div><div className="al-perk-text">Home visits from verified barbers</div></div>
        <div className="al-perk"><div className="al-perk-icon">💳</div><div className="al-perk-text">Pay directly via UPI — no platform fees</div></div>
        <div className="al-perk"><div className="al-perk-icon">📋</div><div className="al-perk-text">Track all your bookings in one place</div></div>
      </div>
      <div className="al-stats">
        <div><div className="al-stat-num">50<span>+</span></div><div className="al-stat-label">Barbers</div></div>
        <div><div className="al-stat-num">2K<span>+</span></div><div className="al-stat-label">Bookings</div></div>
        <div><div className="al-stat-num">4.9<span>★</span></div><div className="al-stat-label">Rating</div></div>
      </div>
    </div>
  </div>

  {/*  RIGHT  */}
  <div className="auth-right">
    <div className="auth-card">
      <div className="auth-tabs">
        <button className="auth-tab active" id="tab-login" onClick={(e) => { window.switchTab('login') }}>Log In</button>
        <button className="auth-tab" id="tab-signup" onClick={(e) => { window.switchTab('signup') }}>Create Account</button>
      </div>
      <div className="auth-alert" id="auth-alert"></div>

      {/*  LOGIN  */}
      <div id="login-section">
        <div className="auth-title">Welcome back 👋</div>
        <div className="auth-subtitle">Log in to manage your bookings.</div>
        <form id="login-form" onSubmit={(e) => window.submitLogin(e)} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" id="login-email" type="email" placeholder="you@example.com" autoComplete="email"/>
            <div className="form-error" id="login-email-err">Please enter a valid email.</div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <input className="form-input" id="login-password" type="password" placeholder="Your password" autoComplete="current-password"/>
              <button type="button" className="pw-toggle" onClick={(e) => { window.togglePw('login-password', e.currentTarget) }}>👁</button>
            </div>
            <div className="form-error" id="login-pw-err">Please enter your password.</div>
          </div>
          <span className="forgot-link"><a href="#" onClick={(e) => { e.preventDefault(); window.showForgot(); }}>Forgot password?</a></span>
          <button type="submit" className="btn-auth-primary" id="login-btn">
            <span className="btn-text">Log In</span><div className="btn-loader"></div>
          </button>
        </form>
        <div className="auth-divider"><span>or</span></div>
        <button className="btn-auth-google" onClick={(e) => { window.googleLogin() }}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>
        <button className="btn-auth-google" style={{marginTop: '12px', color: 'var(--navy)'}} onClick={(e) => { window.switchTab('phone') }}>
          📱 Continue with Phone
        </button>
        <div className="auth-footer-text">Don't have an account? <button onClick={(e) => { window.switchTab('signup') }}>Sign up free →</button></div>
      </div>

      {/*  SIGNUP  */}
      <div id="signup-section" style={{display: 'none'}}>
        <div className="step-indicator">
          <div className="step-dot done" id="sdot-1"></div>
          <div className="step-dot" id="sdot-2"></div>
        </div>

        {/*  Step 1  */}
        <div className="auth-step active" id="su-step-1">
          <div className="auth-title">Create account</div>
          <div className="auth-subtitle">Step 1 of 2 — Your details</div>
          <form id="su-form-1" onSubmit={(e) => window.suStep1(e)} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" id="su-name" type="text" placeholder="Arjun Mohanty" autoComplete="name"/>
              <div className="form-error" id="su-name-err">Please enter your full name.</div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <div className="phone-wrap">
                <div className="phone-prefix">🇮🇳 +91</div>
                <input className="form-input" id="su-phone" type="tel" placeholder="98765 43210" maxLength={10}/>
              </div>
              <div className="form-error" id="su-phone-err">Please enter a valid 10-digit number.</div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input className="form-input" id="su-email" type="email" placeholder="arjun@example.com" autoComplete="email"/>
              <div className="form-error" id="su-email-err">Please enter a valid email.</div>
            </div>
            <div className="form-group">
              <label className="form-label">Your Area</label>
              <select className="form-input" id="su-area" style={{appearance: 'none'}}>
                <option value="">Select area</option>
                <option>Saheed Nagar</option><option>Bapuji Nagar</option>
                <option>IRC Village</option><option>Patia</option>
                <option>Nayapalli</option><option>Kharvel Nagar</option>
                <option>Janpath</option><option>Other</option>
              </select>
            </div>
            <button type="submit" className="btn-auth-primary" id="su-btn-1">
              <span className="btn-text">Continue →</span><div className="btn-loader"></div>
            </button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <button className="btn-auth-google" onClick={(e) => { window.googleLogin() }}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign up with Google
          </button>
          <div className="auth-footer-text">Already have an account? <button onClick={(e) => { window.switchTab('login') }}>Log in</button></div>
        </div>

        {/*  Step 2  */}
        <div className="auth-step" id="su-step-2">
          <div className="auth-title">Set your password 🔒</div>
          <div className="auth-subtitle">Step 2 of 2 — Almost done!</div>
          <form id="su-form-2" onSubmit={(e) => window.suFinish(e)} noValidate>
            <div className="form-group">
              <label className="form-label">Create Password *</label>
              <div className="input-wrap">
                <input className="form-input" id="su-password" type="password" placeholder="At least 8 characters" autoComplete="new-password" onInput={(e) => { window.checkPwStrength(e.target.value) }}/>
                <button type="button" className="pw-toggle" onClick={(e) => { window.togglePw('su-password', e.currentTarget) }}>👁</button>
              </div>
              <div className="pw-strength">
                <div className="pw-strength-bar"><div className="pw-strength-fill" id="pw-fill"></div></div>
                <div className="pw-strength-text" id="pw-strength-text">Enter a password</div>
              </div>
              <div className="form-error" id="su-pw-err">Password must be at least 8 characters.</div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="input-wrap">
                <input className="form-input" id="su-password2" type="password" placeholder="Repeat password" autoComplete="new-password"/>
                <button type="button" className="pw-toggle" onClick={(e) => { window.togglePw('su-password2', e.currentTarget) }}>👁</button>
              </div>
              <div className="form-error" id="su-pw2-err">Passwords do not match.</div>
            </div>
            <div className="form-check">
              <input type="checkbox" id="su-terms"/>
              <label htmlFor="su-terms">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
            </div>
            <div className="form-error" id="su-terms-err">Please accept the terms.</div>
            <button type="submit" className="btn-auth-primary" id="su-btn-2">
              <span className="btn-text">Create My Account →</span><div className="btn-loader"></div>
            </button>
          </form>
          <div className="auth-footer-text"><button onClick={(e) => { window.suGoTo(1) }}>← Back</button></div>
        </div>
      </div>

      {/*  FORGOT PASSWORD  */}
      <div id="forgot-section" style={{display: 'none'}}>
        <div className="auth-title">Reset password</div>
        <div className="auth-subtitle">Enter your email and we'll send a reset link.</div>
        <form id="forgot-form" onSubmit={(e) => window.submitForgot(e)} noValidate>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" id="forgot-email" type="email" placeholder="you@example.com"/>
            <div className="form-error" id="forgot-err">Please enter a valid email.</div>
          </div>
          <button type="submit" className="btn-auth-primary" id="forgot-btn">
            <span className="btn-text">Send Reset Link</span><div className="btn-loader"></div>
          </button>
        </form>
        <div className="auth-footer-text" style={{marginTop: '20px'}}><button onClick={(e) => { window.showLogin() }}>← Back to login</button></div>
      </div>

      {/*  PHONE LOGIN  */}
      <div id="phone-section" style={{display: 'none'}}>
        <div className="auth-title">Phone Login 📱</div>
        <div className="auth-subtitle">Enter your phone number to get an OTP.</div>
        <form id="phone-form" onSubmit={(e) => window.submitPhoneAuth(e)} noValidate>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="phone-wrap">
              <div className="phone-prefix">🇮🇳 +91</div>
              <input className="form-input" id="login-phone" type="tel" placeholder="98765 43210" maxLength={10}/>
            </div>
            <div className="form-error" id="login-phone-err">Please enter a valid 10-digit number.</div>
          </div>
          <button type="submit" className="btn-auth-primary" id="phone-btn">
            <span className="btn-text">Send OTP</span><div className="btn-loader"></div>
          </button>
        </form>
        <div id="recaptcha-container"></div>
        <div className="auth-footer-text" style={{marginTop: '20px'}}><button onClick={(e) => { window.switchTab('login') }}>← Back to login options</button></div>
      </div>

      {/*  OTP SECTION  */}
      <div id="otp-section" style={{display: 'none'}}>
        <div className="auth-title">Verify OTP 🔒</div>
        <div className="auth-subtitle" id="otp-subtitle">We sent a 6-digit code to your phone.</div>
        <form id="otp-form" onSubmit={(e) => window.verifyOTP(e)} noValidate>
          <div className="form-group">
            <label className="form-label">Enter OTP Code</label>
            <input className="form-input" id="otp-code" type="text" placeholder="123456" maxLength={6} style={{textAlign: 'center', fontSize: '24px', letterSpacing: '4px', fontWeight: '700'}}/>
            <div className="form-error" id="otp-code-err">Invalid code. Please try again.</div>
          </div>
          <button type="submit" className="btn-auth-primary" id="otp-btn">
            <span className="btn-text">Verify & Log In →</span><div className="btn-loader"></div>
          </button>
        </form>
        <div className="auth-footer-text" style={{marginTop: '20px'}}><button onClick={(e) => { window.switchTab('phone') }}>← Change phone number</button></div>
      </div>

    </div>
  </div>
</div>



    </>
  );
};

export default Auth;
