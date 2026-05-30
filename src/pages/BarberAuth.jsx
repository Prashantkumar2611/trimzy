import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/auth.css';

const BarberAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 600); }
    import('../../js/barber-auth.js').catch(err => console.error(err));
  }, []);

  return (
    <>
      
  {/*  GLOBAL LOADER  */}
  <div id="global-loader" className="global-loader">
    <div className="gl-logo">Trim<span>zy</span></div>
    <div className="gl-blueprint"></div>
  </div>  <div className="auth-page">

    {/*  LEFT  */}
    <div className="auth-left">
      <div className="al-bg1"></div>
      <div className="al-bg2"></div>
      <Link to="/" className="al-logo">Trim<span>zy</span> <small>FOR BARBERS</small></Link>
      <h1 className="al-headline">Grow your income<br /><span>Your way</span></h1>
      <p className="al-sub">Join 50+ barbers already earning more with Trimzy Zero commission Direct UPI payments Your
        schedule</p>
      <div className="al-perks">
        <div className="al-perk">
          <div className="al-perk-icon">💰</div>
          <div className="al-perk-text">Direct UPI payments — zero commission</div>
        </div>
        <div className="al-perk">
          <div className="al-perk-icon">📅</div>
          <div className="al-perk-text">Manage bookings from your dashboard</div>
        </div>
        <div className="al-perk">
          <div className="al-perk-icon">🏠</div>
          <div className="al-perk-text">Enable home visits and earn more</div>
        </div>
        <div className="al-perk">
          <div className="al-perk-icon">📊</div>
          <div className="al-perk-text">Track earnings & grow your customer base</div>
        </div>
      </div>
      <div className="al-stats">
        <div>
          <div className="al-stat-num">₹<span>42K</span>+</div>
          <div className="al-stat-label">Avg monthly earnings</div>
        </div>
        <div>
          <div className="al-stat-num"><span>50</span>+</div>
          <div className="al-stat-label">Active barbers</div>
        </div>
        <div>
          <div className="al-stat-num"><span>48h</span></div>
          <div className="al-stat-label">Approval time</div>
        </div>
      </div>
    </div>

    {/*  RIGHT  */}
    <div className="auth-right">
      <div className="auth-card">

        {/*  TABS  */}
        <div className="auth-tabs" id="main-tabs">
          <button className="auth-tab active" id="tab-signup" onClick={(e) => { switchTab('signup') }}>Create Account</button>
          <button className="auth-tab" id="tab-login" onClick={(e) => { switchTab('login') }}>Log In</button>
        </div>

        {/*  ALERT  */}
        <div className="auth-alert" id="auth-alert"></div>

        {/*  ══ SIGNUP FLOW ══  */}
        <div id="signup-section">
          <div className="step-indicator">
            <div className="step-dot done" id="sdot-1"></div>
            <div className="step-dot" id="sdot-2"></div>
            <div className="step-dot" id="sdot-3"></div>
          </div>

          {/*  STEP 1: Account details  */}
          <div className="auth-step active" id="su-step-1">
            <div className="auth-title">Create your account</div>
            <div className="auth-subtitle">Step 1 of 3 — Basic details</div>
            <form onsubmit="suStep1(event)" novalidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" id="su-name" type="text" placeholder="Rajan Sharma" />
                  <div className="form-error" id="su-name-err">Enter your full name</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <div className="phone-wrap">
                    <div className="phone-prefix">🇮🇳 +91</div>
                    <input className="form-input" id="su-phone" type="tel" placeholder="98765 43210" maxlength="10" />
                  </div>
                  <div className="form-error" id="su-phone-err">Enter valid 10-digit number</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" id="su-email" type="email" placeholder="rajan@example.com" />
                <div className="form-error" id="su-email-err">Enter a valid email</div>
              </div>
              <div className="form-group">
                <label className="form-label">Create Password *</label>
                <div className="input-wrap">
                  <input className="form-input" id="su-password" type="password" placeholder="At least 8 characters"
                    onInput={(e) => { checkPwStrength(this.value) }} />
                  <button type="button" className="pw-toggle" onClick={(e) => { togglePw('su-password',this) }}>👁</button>
                </div>
                <div className="pw-strength">
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill" id="pw-fill"></div>
                  </div>
                  <div className="pw-strength-text" id="pw-text">Enter a password</div>
                </div>
                <div className="form-error" id="su-pw-err">Password must be at least 8 characters</div>
              </div>
              <button type="submit" className="btn-primary" id="su-btn-1">
                <span className="btn-text">Continue →</span>
                <div className="btn-loader"></div>
              </button>
            </form>
            <div className="auth-footer-text">Already have an account? <button onClick={(e) => { switchTab('login') }}>Log in</button>
            </div>
          </div>

          {/*  STEP 2: Shop details  */}
          <div className="auth-step" id="su-step-2">
            <div className="auth-title">Your shop details</div>
            <div className="auth-subtitle">Step 2 of 3 — Tell us about your work</div>
            <form onsubmit="suStep2(event)" novalidate>
              <div className="form-group">
                <label className="form-label">Shop Name *</label>
                <input className="form-input" id="su-shop" type="text" placeholder="Rajan's Cuts (or 'Home Visit Only')" />
                <div className="form-error" id="su-shop-err">Enter your shop name</div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Area *</label>
                  <select className="form-input" id="su-area" style={{appearance: 'none'}}>
                    <option value="">Select area</option>
                    <option>Saheed Nagar</option>
                    <option>Bapuji Nagar</option>
                    <option>IRC Village</option>
                    <option>Patia</option>
                    <option>Nayapalli</option>
                    <option>Kharvel Nagar</option>
                    <option>Janpath</option>
                    <option>Bomikhal</option>
                    <option>Other</option>
                  </select>
                  <div className="form-error" id="su-area-err">Select your area</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <select className="form-input" id="su-exp" style={{appearance: 'none'}}>
                    <option>Less than 1 year</option>
                    <option>1–3 years</option>
                    <option>3–5 years</option>
                    <option>5–10 years</option>
                    <option>10+ years</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">UPI ID *</label>
                <input className="form-input" id="su-upi" type="text" placeholder="yourname@paytm or @gpay" />
                <div className="form-error" id="su-upi-err">Enter your UPI ID</div>
              </div>
              <div className="form-group">
                <label className="form-label">Services Offered</label>
                <select className="form-input" id="su-services" style={{appearance: 'none'}}>
                  <option>Haircut only</option>
                  <option>Haircut + Beard</option>
                  <option>Full grooming</option>
                  <option>Hair + Beard + Skin care</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Do you offer home visits?</label>
                <select className="form-input" id="su-homevisit" style={{appearance: 'none'}}>
                  <option>Yes I can visit customers at home</option>
                  <option>No Shop visits only</option>
                  <option>Maybe I'd like to discuss this</option>
                </select>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="button" className="btn-secondary" style={{marginTop: '4px'}} onClick={(e) => { suGoTo(1) }}>← Back</button>
                <button type="submit" className="btn-primary" id="su-btn-2">
                  <span className="btn-text">Continue →</span>
                  <div className="btn-loader"></div>
                </button>
              </div>
            </form>
          </div>

          {/*  STEP 3: Terms + Submit  */}
          <div className="auth-step" id="su-step-3">
            <div className="auth-title">Almost done! 🎉</div>
            <div className="auth-subtitle">Step 3 of 3 — Review and submit</div>
            <div className="status-card" id="review-card" style={{marginBottom: '20px'}}></div>
            <div className="form-group">
              <label className="form-label">Anything else? (optional)</label>
              <textarea className="form-input" id="su-about" rows="3"
                placeholder="Specialties, certifications, years of experience with specific styles..."
                style={{resize: 'vertical'}}></textarea>
            </div>
            <div className="form-check">
              <input type="checkbox" id="su-terms" />
              <label for="su-terms">I agree to Trimzy's <a href="#">Terms of Service</a> and <a href="#">Privacy
                  Policy</a></label>
            </div>
            <div className="form-error" id="su-terms-err">Please accept the terms to continue</div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button type="button" className="btn-secondary" style={{marginTop: '4px'}} onClick={(e) => { suGoTo(2) }}>← Back</button>
              <button type="button" className="btn-primary" id="su-btn-3" onClick={(e) => { suFinish() }}>
                <span className="btn-text">Submit Application →</span>
                <div className="btn-loader"></div>
              </button>
            </div>
          </div>
        </div>

        {/*  ══ PENDING SCREEN ══  */}
        <div className="status-screen" id="pending-screen">
          <div className="status-icon">⏳</div>
          <div className="status-title">Application submitted!</div>
          <div className="status-desc">We're reviewing your profile This usually takes 24–48 hours We'll notify you once
            approved</div>
          <div className="status-card" id="pending-card"></div>
          <p style={{fontSize: '13px', color: 'var(--gray)', marginBottom: '16px'}}>Your dashboard is ready it will show your
            bookings once approved</p>
          <button className="btn-dashboard" onClick={(e) => { navigate('/barber-dashboard') }}>Go to My Dashboard →</button>
          <button className="btn-secondary" onClick={(e) => { navigate('/') }}>Back to Home</button>
        </div>

        {/*  ══ APPROVED SCREEN ══  */}
        <div className="status-screen" id="approved-screen">
          <div className="status-icon">🎉</div>
          <div className="status-title">You're live on Trimzy!</div>
          <div className="status-desc">Your profile is approved and visible to customers Start managing your bookings from
            your dashboard</div>
          <button className="btn-dashboard" onClick={(e) => { navigate('/barber-dashboard') }}>Open My Dashboard →</button>
          <button className="btn-secondary" onClick={(e) => { navigate('/') }}>Back to Home</button>
        </div>

        {/*  ══ LOGIN FORM ══  */}
        <div id="login-section" style={{display: 'none'}}>
          <div className="auth-title">Welcome back</div>
          <div className="auth-subtitle">Log in to your barber dashboard</div>
          <form onsubmit="doLogin(event)" novalidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" id="login-email" type="email" placeholder="your@email.com"
                autocomplete="email" />
              <div className="form-error" id="login-email-err">Enter a valid email</div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input className="form-input" id="login-password" type="password" placeholder="Your password"
                  autocomplete="current-password" />
                <button type="button" className="pw-toggle" onClick={(e) => { togglePw('login-password',this) }}>👁</button>
              </div>
              <div className="form-error" id="login-pw-err">Enter your password</div>
            </div>
            <span className="forgot-link"><a href="#" onClick={(e) => { showForgot();return false }}>Forgot password?</a></span>
            <button type="submit" className="btn-primary" id="login-btn">
              <span className="btn-text">Log In to Dashboard</span>
              <div className="btn-loader"></div>
            </button>
          </form>
          <div className="auth-footer-text">New barber? <button onClick={(e) => { switchTab('signup') }}>Create account →</button>
          </div>
          <div className="auth-footer-text" style={{marginTop: '8px'}}><Link to="/">← Back to main site</Link></div>
        </div>

        {/*  ══ FORGOT PASSWORD ══  */}
        <div id="forgot-section" style={{display: 'none'}}>
          <div className="auth-title">Reset password</div>
          <div className="auth-subtitle">Enter your email and we'll send a reset link.</div>
          <form onsubmit="submitForgot(event)" novalidate>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" id="forgot-email" type="email" placeholder="you@example.com" />
              <div className="form-error" id="forgot-email-err">Please enter a valid email.</div>
            </div>
            <button type="submit" className="btn-primary" id="forgot-btn">
              <span className="btn-text">Send Reset Link</span>
              <div className="btn-loader"></div>
            </button>
          </form>
          <div className="auth-footer-text" style={{marginTop: '20px'}}><button onClick={(e) => { showLogin() }}>← Back to login</button></div>
        </div>

        {/*  ══ SET NEW PASSWORD (FROM EMAIL LINK) ══  */}
        <div id="reset-password-section" style={{display: 'none'}}>
          <div className="auth-title">Set New Password</div>
          <div className="auth-subtitle">Secure your Trimzy barber account</div>
          <form onsubmit="submitNewPassword(event)" novalidate>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-wrap">
                <input className="form-input" id="reset-password" type="password" placeholder="At least 8 characters"
                  onInput={(e) => { checkPwStrength(this.value) }} />
                <button type="button" className="pw-toggle" onClick={(e) => { togglePw('reset-password',this) }}>👁</button>
              </div>
              <div className="pw-strength">
                <div className="pw-strength-bar">
                  <div className="pw-strength-fill" id="pw-fill"></div>
                </div>
                <div className="pw-strength-text" id="pw-text">Enter a password</div>
              </div>
              <div className="form-error" id="reset-pw-err">Password must be at least 8 characters</div>
            </div>
            <button type="submit" className="btn-primary" id="reset-btn">
              <span className="btn-text">Save Password & Log In</span>
              <div className="btn-loader"></div>
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>

  

    </>
  );
};

export default BarberAuth;
