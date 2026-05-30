import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/barber-profile.css';

const BarberProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 600); }
    import('../../js/shared.js').catch(err => console.error(err));
    import('../../js/barber-profile.js').catch(err => console.error(err));
  }, []);

  return (
    <>
      
  {/*  GLOBAL LOADER  */}
  <div id="global-loader" className="global-loader">
    <div className="gl-logo">Trim<span>zy</span></div>
    <div className="gl-blueprint"></div>
  </div>
  {/*  NAV  */}
  <nav id="navbar">
    <Link to="/" className="nav-logo">Trim<span>zy</span></Link>
    
    <div className="nav-links" id="nav-pill">
      <Link to="/">Home</Link>
      <Link to="/how-it-works">How It Works</Link>
      <Link to="/for-barbers">For Barbers</Link>
      <Link to="/about">About</Link>
      <div className="nav-highlighter" id="nav-highlighter"></div>
    </div>

    <div className="nav-cta">
      <button className="btn-outline-nav" onClick={(e) => { openAuthModal() }} id="nav-auth-btn">Log In</button>
    </div>
  </nav>

  {/*  BREADCRUMB  */}
  <div className="breadcrumb" style={{marginTop: '80px'}}>
    <Link to="/">Home</Link>
    <span className="breadcrumb-sep">›</span>
    <Link to="/app">Browse Barbers</Link>
    <span className="breadcrumb-sep">›</span>
    <span id="bc-barber-name">...</span>
  </div>

  {/*  HERO  */}
  <div className="bp-hero fade-up">
    <div className="bp-hero-banner" id="hero-banner">
      <img id="hero-banner-img" className="bp-hero-banner-img" src="" alt="Background" />
      <div className="bp-hero-banner-fade"></div>
      <div className="bp-hero-banner-glow"></div>
    </div>
    <div className="bp-hero-inner">
      <div id="hero-avatar" className="bp-hero-avatar">...</div>
      <div className="bp-hero-info">
        <h1 id="hero-name" className="bp-hero-name">...</h1>
        <div id="hero-loc" className="bp-hero-loc">
          <span>📍</span> <span id="hero-loc-detail">Loading location...</span>
        </div>
      </div>
      <div className="bp-hero-stats">
        <div className="bp-hero-stat">
          <div id="hero-rating" className="bp-stat-val bp-stat-rating">... ★</div>
          <div className="bp-stat-lbl">Rating</div>
        </div>
        <div className="bp-hero-stat">
          <div id="hero-experience" className="bp-stat-val">...</div>
          <div className="bp-stat-lbl">Experience</div>
        </div>
      </div>
    </div>
    
    </div>

  {/*  MAIN  */}
  <div className="main">

    {/*  LEFT COLUMN  */}
    <div className="fade-up-3">

      {/*  GALLERY  */}
      <div className="bp-section">
        <div className="bp-section-title">

          Photos
        </div>
        <div className="gallery" id="barber-gallery">
          <div className="gallery-item" style={{gridColumn: 'span 2', gridRow: 'span 2'}}>
            <div className="gallery-placeholder gp1" style={{height: '100%', fontSize: '48px'}}>✂</div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder gp2" style={{fontSize: '32px'}}>💈</div>
          </div>
          <div className="gallery-item">
            <div className="gallery-placeholder gp3" style={{fontSize: '32px'}}>🧔</div>
          </div>
          <div className="gallery-item" style={{position: 'relative'}}>
            <div className="gallery-placeholder gp4" style={{fontSize: '32px'}}>👶</div>
          </div>
          <div className="gallery-item" style={{position: 'relative'}}>
            <div className="gallery-placeholder" style={{fontSize: '32px', background: 'linear-gradient(135deg,#2D2D4E,#1A1A2E)'}}>
              🪒</div>
            <div className="gallery-more">+8 more</div>
          </div>
        </div>
      </div>

      {/*  RATINGS & REVIEWS  */}
      <div className="bp-section bp-reviews-section">
        <div className="bp-reviews-header">
          <div className="bp-reviews-title">Ratings & Reviews</div>
          <div className="bp-reviews-score">
            <span id="review-avg" className="bp-reviews-avg">0</span>
            <div className="bp-reviews-score-meta">
              <span className="bp-reviews-stars">★★★★★</span>
              <span className="bp-reviews-count">(<span id="review-count">0</span> Reviews)</span>
            </div>
          </div>
        </div>
        
        <div id="no-reviews-overview" className="bp-no-reviews">
          <div>No ratings yet</div>
        </div>

        {/*  Reviews Container  */}
        <div id="reviews-container" className="reviews-masonry">
          <div className="bp-reviews-loading">Loading reviews...</div>
        </div>

        {/*  See All Button  */}
        <div id="see-all-container" className="see-all-container">
          <button className="btn-see-all" id="btn-see-all">
            See all reviews <span>→</span>
          </button>
        </div>
      </div>

      {/*  SERVICES  */}
      <div className="bp-section">
        <div className="bp-section-title">
          <div className="bp-section-title-icon" style={{background: '#FFF8ED'}}>✂</div>
          Services
        </div>
        <div id="services-list">
          {/*  filled by JS  */}
        </div>
        <div className="bp-service-hint">
          <span>💡</span> Select a service above, then scroll right to book your slot
        </div>
      </div>

      {/*  LOCATION  */}
      <div className="bp-section bp-location-section">
        <div className="bp-section-title">
          <div className="bp-section-title-icon" style={{background: '#EEF2FF'}}>📍</div>
          Location
        </div>
        <div className="bp-location-card">
          <div className="bp-map-container">
            <iframe id="gmap-iframe" width="100%" height="100%" frameborder="0" style={{border: '0'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Bhubaneswar&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>
          </div>
          <div className="bp-location-info">
            <div className="bp-location-name" id="loc-name">The Barber's Hub</div>
            <div className="bp-location-addr" id="loc-addr">Loading address...</div>
            <button className="bp-directions-btn" onClick={(e) => { openMaps() }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              Get Directions
            </button>
          </div>
        </div>
      </div>

    </div>{/*  end left column  */}

    {/*  RIGHT COLUMN — BOOKING CARD  */}
    <div className="sticky-book fade-up-2">
      <div className="book-card">
        <div className="bp-book-header">
          <div className="bp-book-title" id="book-card-title">Book Appointment</div>
        </div>
        <div className="book-card-body">

          {/*  Step tabs  */}
          <div className="step-tabs" style={{display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', fontSize: '13px', fontWeight: '600', fontFamily: "'Inter', sans-serif'"}}>

            <div className="s-tab active" id="tab-service"><div className="s-num">1</div> Service</div>
            <div className="s-divider"></div>
            <div className="s-tab" id="tab-datetime"><div className="s-num">2</div> Date & Time</div>
            <div id="tab-details" style={{display: 'none'}}></div>
            <div id="tab-payment" style={{display: 'none'}}></div>
          </div>

          {/*  STEP 1: SERVICE  */}
          <div id="step-service">
            <div className="date-label" style={{fontFamily: "'Inter', sans-serif'", fontWeight: '700', fontSize: '14px', color: '#000', marginBottom: '12px'}}>Choose a service</div>

            <div className="service-mini" id="footer-services-list">
              {/*  filled by JS  */}
            </div>
            <button className="book-btn" onClick={(e) => { window.goToStep(2) }} style={{width: '100%', padding: '16px', background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif'", fontSize: '14px', fontWeight: '500', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px'}}>
              <span>Schedule</span>
            </button>
          </div>

          {/*  STEP 2: DATE & TIME  */}
          <div id="step-datetime" style={{display: 'none'}}>
            <div className="date-label">Select Date</div>
            <div className="date-scroll" id="date-scroll">
              {/*  filled by JS  */}
            </div>

            <div className="date-label">Available Slots</div>
            <div className="slot-grid" id="slot-grid">
              {/*  filled by JS  */}
            </div>

            <div className="queue-box">
              <div className="queue-title">Or join the virtual queue</div>
              <div className="queue-sub">Show up when it's your turn. No fixed time needed.</div>
              <div className="queue-info">Est. wait today: ~22 min · 4 ahead</div>
              <button className="queue-join" onClick={(e) => { joinQueue() }}>Join Virtual Queue →</button>
            </div>

            <div style={{display: 'flex', gap: '8px', marginBottom: '14px'}}>
              <button onClick={(e) => { window.goToStep(1) }}
                style={{flex: '1', padding: '11px', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '13px', fontWeight: '500', color: 'var(--navy)', cursor: 'pointer'}}>←
                Back</button>
              <button className="book-btn" style={{flex: '2'}} id="btn-confirm" onClick={(e) => { attemptGoToStep3() }} disabled>
                <span>Confirm Slot →</span>
              </button>
            </div>
          </div>

          {/*  STEP 3: DETAILS  */}
          <div id="step-details" style={{display: 'none'}}>
            <div style={{marginBottom: '14px'}}>
              <div className="date-label" style={{marginBottom: '6px'}}>Your Name *</div>
              <input id="inp-name" type="text" placeholder="Enter your name"
                style={{width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--navy)', background: '#fff', marginBottom: '12px'}} />

              <div className="date-label" style={{marginBottom: '6px'}}>Phone *</div>
              <input id="inp-phone" type="tel" placeholder="+91 XXXXX XXXXX"
                style={{width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--navy)', background: '#fff', marginBottom: '12px'}} />

              <div className="date-label" style={{marginBottom: '6px'}}>Email (for receipt)</div>
              <input id="inp-email" type="email" placeholder="you@example.com"
                style={{width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--navy)', background: '#fff', marginBottom: '12px'}} />

              <div id="home-address-wrap" style={{display: 'none', marginBottom: '12px'}}>
                <div className="date-label" style={{marginBottom: '6px'}}>Your Address *</div>
                <input id="inp-address" type="text" placeholder="Flat no., Street, Area, Bhubaneswar"
                  style={{width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--navy)', background: '#fff'}} />
              </div>

              <div className="date-label" style={{marginBottom: '6px'}}>Notes for barber</div>
              <input id="inp-notes" type="text" placeholder="e.g. side fade, keep beard short..."
                style={{width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '13px', color: 'var(--navy)', background: '#fff'}} />
            </div>

            <div style={{background: '#F9FAFB', border: '1px solid var(--border)', borderRadius: '14px', padding: '14px', marginBottom: '20px'}}>
              <div style={{fontFamily: "'Inter',sans-serif'", fontSize: '14px', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px'}}>Booking Summary</div>
              <div id="summary-rows"></div>
            </div>

            <div style={{display: 'flex', gap: '8px', marginBottom: '14px'}}>
              <button onClick={(e) => { window.goToStep(2) }}
                style={{flex: '1', padding: '11px', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '13px', fontWeight: '500', color: 'var(--navy)', cursor: 'pointer'}}>←
                Back</button>
              <button className="book-btn" style={{flex: '2', background: 'var(--navy)', color: '#fff'}} onClick={(e) => { attemptGoToStep4() }}>
                <span>Proceed to Payment</span>
              </button>
            </div>
          </div>

          {/*  STEP 4: PAYMENT  */}
          <div id="step-payment" style={{display: 'none'}}>

            <div style={{fontFamily: "'Inter', sans-serif'", fontSize: '28px', fontWeight: '800', color: '#000', marginBottom: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px'}}>
              Total: <span id="pay-total-display">₹500</span>
            </div>

            <div className="payment-options">
              {/*  Option 1: UPI  */}
              <button type="button" className="po-btn payment-option selected" id="po-upi" onClick={(e) => { selectPayment('upi') }}>
                <div style={{width: '32px', height: '24px', background: '#F5F5F5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#000', border: '1px solid #E0E0E0', flexShrink: '0'}}>UPI</div>
                <div style={{fontFamily: "'Inter', sans-serif'", fontSize: '14px', fontWeight: '600', color: '#000'}}>UPI (GPay, PhonePe)</div>
              </button>

              {/*  Option 2: Card  */}
              <button type="button" className="po-btn payment-option" id="po-card" onClick={(e) => { selectPayment('card') }}>
                <div style={{width: '32px', height: '24px', background: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', flexShrink: '0'}}>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="15" height="11" rx="1.5" stroke="black"/><path d="M0 4H16" stroke="black"/></svg>
                </div>
                <div style={{fontFamily: "'Inter', sans-serif'", fontSize: '14px', fontWeight: '600', color: '#000'}}>Credit / Debit Card</div>
              </button>

              {/*  Option 3: Pay at Shop  */}
              <button type="button" className="po-btn payment-option" id="po-cash" onClick={(e) => { selectPayment('cash') }} style={{marginBottom: '24px'}}>
                <div style={{width: '32px', height: '24px', background: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', flexShrink: '0'}}>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="15" height="11" rx="1.5" stroke="black"/><circle cx="8" cy="6" r="2" fill="black"/></svg>
                </div>
                <div style={{flexGrow: '1'}}>
                  <div style={{display: 'flex', gap: '6px', marginBottom: '4px'}}>
                    <span style={{background: '#000', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '10px'}}>Popular</span>
                    <span style={{background: '#F0F0F0', color: '#000', fontSize: '9px', fontWeight: '600', padding: '2px 6px', borderRadius: '10px'}}>No Prepayment</span>
                  </div>
                  <div style={{fontFamily: "'Inter', sans-serif'", fontSize: '14px', fontWeight: '600', color: '#000'}}>Pay at Shop</div>
                </div>
              </button>
            </div>

            <button className="book-btn" style={{width: '100%', padding: '16px', background: '#000', color: '#fff', fontFamily: "'Inter', sans-serif'", fontSize: '14px', fontWeight: '500', border: 'none', borderRadius: '8px', cursor: 'pointer'}} id="btn-submit" onClick={(e) => { submitBooking() }}>
              <span className="btn-text">Complete Booking</span>
              <span className="btn-loader" style={{display: 'none'}}>Processing...</span>
            </button>
          </div>

        </div>
      </div>

      {/*  Quick stats under card  */}
      <div className="bp-quick-stats">
        <div className="bp-quick-stat">
          <div className="bp-quick-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <div className="bp-quick-stat-val">~22 min</div>
            <div className="bp-quick-stat-lbl">Queue Wait</div>
          </div>
        </div>
        <div className="bp-quick-stat">
          <div className="bp-quick-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </div>
          <div>
            <div className="bp-quick-stat-val" id="bp-hours-val">9:00 AM – 8:00 PM</div>
            <div className="bp-quick-stat-lbl" id="bp-hours-lbl">Open Today</div>
          </div>
        </div>
      </div>
    </div>

  </div>{/*  end .main  */}

  {/*  MOBILE BOTTOM FOOTER  */}
  <div className="mobile-book-footer">
    <div className="mf-info">
      <div className="mf-label" id="footer-min-label">Starting from</div>
      <div className="mf-amount" id="footer-min-amount">₹80</div>
    </div>
    <button className="mf-btn" onClick={(e) => { scrollToBook() }}>Book Slot →</button>
  </div>



  <div className="success-screen" id="success-screen">
    <div className="ss-circle">✓</div>
    <div className="ss-title">Booked! See you <span>soon</span></div>
    <div className="ss-sub">Your booking is saved The barber has been notified</div>
    <div className="ss-card" id="ss-card"></div>
    <div className="ss-id" id="ss-id"></div>
    <div className="ss-btns">
      <button className="ss-btn-primary" onClick={(e) => { location.reload() }}>Book Another</button>
      <button className="ss-btn-outline" onClick={(e) => { navigate('/app') }}>Browse Barbers</button>
    </div>
  </div>

  

  {/*  LIGHTBOX OVERLAY  */}
  <div id="lightbox-overlay" className="lightbox-overlay" onClick={(e) => { if(e.target === this) closeLightbox() }}>
    <div className="lightbox-content">
      <button className="lightbox-close" onClick={(e) => { closeLightbox() }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <button className="lightbox-nav lightbox-prev" onClick={(e) => { lightboxPrev() }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <img id="lightbox-img" className="lightbox-img" src="" alt="Gallery Image" />
      <div id="lightbox-caption" className="lightbox-caption"></div>
      <button className="lightbox-nav lightbox-next" onClick={(e) => { lightboxNext() }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  </div>

    </>
  );
};

export default BarberProfile;
