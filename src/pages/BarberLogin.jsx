import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/auth.css';

const BarberLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    import('../../js/auth.js').catch(err => console.error(err));
  }, []);

  return (
    <>
      
<div className="login-page">
  {/*  LEFT  */}
  <div className="login-left">
    <div className="ll-bg1"></div><div className="ll-bg2"></div>
    <Link to="/" className="ll-logo">Trim<span>zy</span> <small>FOR BARBERS</small></Link>
    <h1 className="ll-headline">Welcome back,<br/><span>barber.</span></h1>
    <p className="ll-sub">Log in to your Trimzy dashboard and manage all your bookings in one place.</p>
    <div className="ll-perks">
      <div className="ll-perk"><div className="ll-perk-icon">📅</div><div className="ll-perk-text">See all your upcoming bookings</div></div>
      <div className="ll-perk"><div className="ll-perk-icon">💰</div><div className="ll-perk-text">Track your daily & monthly earnings</div></div>
      <div className="ll-perk"><div className="ll-perk-icon">✅</div><div className="ll-perk-text">Mark bookings as completed</div></div>
      <div className="ll-perk"><div className="ll-perk-icon">🕐</div><div className="ll-perk-text">Set your working hours & availability</div></div>
    </div>
  </div>

  {/*  RIGHT  */}
  <div className="login-right">
    <div className="login-card">
      <div className="login-title">Barber Login ✂️</div>
      <div className="login-sub">Enter the email and password given to you by Trimzy after your approval.</div>
      <div className="auth-alert" id="auth-alert"></div>
      <form onSubmit={(e) => window.doLogin(e)} noValidate>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" id="email" type="email" placeholder="your@email.com" autoComplete="email"/>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrap">
            <input className="form-input" id="password" type="password" placeholder="Your password" autoComplete="current-password"/>
            <button type="button" className="pw-toggle" onClick={(e) => { window.togglePw('password', e.currentTarget) }}>👁</button>
          </div>
        </div>
        <span className="forgot-link"><a href="#" onClick={(e) => { e.preventDefault(); window.showForgot(); }}>Forgot password?</a></span>
        <button type="submit" className="btn-login" id="login-btn">
          <span className="btn-text">Log In to Dashboard</span>
          <div className="btn-loader"></div>
        </button>
      </form>
      <div className="login-footer">
        Not a barber yet? <Link to="/for-barbers">Apply to join Trimzy →</Link>
      </div>
      <div className="login-footer" style={{borderTop: 'none', marginTop: '8px'}}>
        <Link to="/">← Back to main site</Link>
      </div>
    </div>
  </div>
</div>



    </>
  );
};

export default BarberLogin;
