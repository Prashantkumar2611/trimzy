import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/for-barbers.css';

const ForBarbers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hide global loader since window.load doesn't re-fire on SPA nav
    const loader = document.getElementById('global-loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 600); }
    import('../../js/shared.js').catch(err => console.error(err));
    import('../../js/for-barbers.js').catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />

      {/*  HERO  */}
      <section className="barber-hero">
        <div className="bh-bg1"></div>
        <div className="bh-bg2"></div>
        <div className="bh-content">
          <h1>Run your barber business on <span className="accent">autopilot</span></h1>
          <p>Trimzy connects you with hundreds of clients in Bhubaneswar, manages your calendar, and handles payments directly to your UPI.</p>
          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
            <button className="btn-gold" style={{padding: '16px 36px', borderRadius: '12px'}}
              onClick={() => { document.getElementById('barber-signup').scrollIntoView({behavior:'smooth'}) }}>Apply to Join Now</button>
            <button className="btn-outline" style={{padding: '16px 36px', borderRadius: '12px'}}
              onClick={() => { document.getElementById('barber-benefits').scrollIntoView({behavior:'smooth'}) }}>See Benefits</button>
          </div>

          <div className="bh-stats">
            <div>
              <div className="bh-stat-num">3x<span>+</span></div>
              <div className="bh-stat-label">Income Growth</div>
            </div>
            <div>
              <div className="bh-stat-num">0<span>m</span></div>
              <div className="bh-stat-label">Queue & Wait Time</div>
            </div>
            <div>
              <div className="bh-stat-num">100%</div>
              <div className="bh-stat-label">Direct UPI Payments</div>
            </div>
          </div>
        </div>

        {/*  LIVE PREVIEW OF BARBER DASHBOARD  */}
        <div className="bh-dashboard" data-aos="fade-left">
          <div className="dash-row">
            <div className="dash-title">Shop Dashboard</div>
            <div className="dash-badge">● ONLINE</div>
          </div>
          <div className="dash-metric">
            <div className="dash-metric-label">TODAY'S EARNINGS</div>
            <div className="dash-metric-val">₹<span>3,450</span></div>
            <div className="dash-metric-change">↑ 24% from yesterday</div>
          </div>
          <div className="dash-metric">
            <div className="dash-metric-label">BOOKINGS COMPLETED</div>
            <div className="dash-metric-val">12<span> / 15</span></div>
            <div className="dash-bar-wrap">
              <div className="dash-bar-label">
                <span>Progress</span>
                <span>80%</span>
              </div>
              <div className="dash-bar">
                <div className="dash-bar-fill" style={{width: '80%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  BENEFITS  */}
      <section className="benefits" id="barber-benefits">
        <div className="section-label">Why Trimzy?</div>
        <h2 className="section-title">Designed by barbers, <span className="accent">for barbers</span></h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">📈</div>
            <div className="benefit-title">Boost Your Bookings</div>
            <div className="benefit-desc">Our smart client-matching algorithm fills your empty hours and brings new customers right to your chair.</div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⏰</div>
            <div className="benefit-title">No More Empty Slots</div>
            <div className="benefit-desc">Automated scheduling keeps your calendar structured and reduces no-shows with reminder notifications.</div>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💸</div>
            <div className="benefit-title">Keep 100% of UPI Payments</div>
            <div className="benefit-desc">We charge zero commission on direct UPI payments from customers. What you earn is fully yours.</div>
          </div>
        </div>
      </section>

      {/*  HOW TO JOIN  */}
      <section style={{background: 'var(--navy)', color: '#fff'}}>
        <div className="section-label" style={{color: 'var(--gold)'}}>Simple Process</div>
        <h2 className="section-title" style={{color: '#fff'}}>Three steps to get <span className="accent">started</span></h2>
        <div className="join-steps">
          <div className="join-step">
            <div className="join-step-num">1</div>
            <div className="join-step-title">Submit Application</div>
            <div className="join-step-desc">Fill out the quick form below with your shop location, services, and phone number.</div>
          </div>
          <div className="join-step">
            <div className="join-step-num">2</div>
            <div className="join-step-title">Profile Verification</div>
            <div className="join-step-desc">Our team will verify your details and set up your premium public profile page in 24 hours.</div>
          </div>
          <div className="join-step">
            <div className="join-step-num">3</div>
            <div className="join-step-title">Accept Bookings</div>
            <div className="join-step-desc">Go live, set your working hours, and start receiving bookings from local clients immediately.</div>
          </div>
        </div>
      </section>

      {/*  SIGNUP FORM  */}
      <section className="signup-section" id="barber-signup">
        <div className="section-label">Join the Elite</div>
        <h2 className="section-title">Apply to partner with <span className="accent">Trimzy</span></h2>
        <div className="signup-form-wrap">
          <form onSubmit={(e) => window.submitBarberForm(e)}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" type="text" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" type="tel" placeholder="9876543210" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="john@barber.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">City/Area *</label>
                <select className="form-input form-select" required>
                  <option value="">Select your area</option>
                  <option value="Saheed Nagar">Saheed Nagar</option>
                  <option value="Patia">Patia</option>
                  <option value="IRC Village">IRC Village</option>
                  <option value="Nayapalli">Nayapalli</option>
                  <option value="Bapuji Nagar">Bapuji Nagar</option>
                  <option value="Other">Other (Bhubaneswar)</option>
                </select>
              </div>
              <div className="form-group full">
                <label className="form-label">Shop Address (Optional for home-visit barbers)</label>
                <input className="form-input" type="text" placeholder="Plot No. 123, Saheed Nagar, Near Square" />
              </div>
            </div>
            <button className="form-submit" type="submit">Submit Application →</button>
            <div className="form-note">Already joined? <a href="/barber-login" style={{color: 'var(--gold)', fontWeight: '600', textDecoration: 'none'}}>Login to your dashboard</a></div>
          </form>
        </div>
      </section>

      {/*  CTA  */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <h2 className="cta-title">Questions before applying?</h2>
        <p className="cta-sub">Read our full barber FAQ or check out our pricing plans to understand what you get</p>
        <div className="cta-actions">
          <button className="btn-cta-dark" onClick={() => navigate('/how-it-works')}>Read How It Works</button>
        </div>
      </section>

      <Footer />

      {/*  SUCCESS OVERLAY  */}
      <div className="success-overlay" id="success-overlay">
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <div className="success-title">Application Submitted!</div>
          <div className="success-desc">Thanks for applying to Trimzy Our team will review your profile and get back to you
            within 24-48 hours Check your phone for updates</div>
          <button className="success-btn"
            onClick={(e) => { document.getElementById('success-overlay').classList.remove('show') }}>Done</button>
        </div>
      </div>
    </>
  );
};

export default ForBarbers;
