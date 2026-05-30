import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/app.css';

const AppPage = () => {
  const navigate = useNavigate();
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 600); }
    // Dynamically import the app.js script so it runs after the component mounts
    import('../../js/app.js').then((module) => {
      setScriptReady(true);
    }).catch(err => console.error(err));
  }, []);

  const safeCall = (fnName, ...args) => {
    if (scriptReady && typeof window[fnName] === 'function') {
      window[fnName](...args);
    } else {
      console.warn(`Attempted to call ${fnName} before scripts were loaded.`);
    }
  };

  return (
    <>
      
  {/*  GLOBAL LOADER  */}
  <div id="global-loader" className="global-loader">
    <div className="gl-logo">Trim<span>zy</span></div>
    <div className="gl-blueprint"></div>
  </div>
  {/*  Pincode Location Modal  */}
  <div className="pincode-overlay" id="pincode-overlay" onClick={(e) => { safeCall('handleOverlayClick', e) }}>
    <div className="pincode-modal">
      <button className="pm-close" onClick={(e) => { safeCall('closePincodeModal') }}>✕</button>
      <div className="pm-icon">📍</div>
      <div className="pm-title">Change Location</div>
      <div className="pm-sub">Search for your city, area, or pincode</div>
      <div className="pm-search-container" style={{position: 'relative'}}>
        <div className="pm-input-row">
          <input className="pm-input" id="pincode-input" type="text" placeholder="e.g. Bhopal, 751001"
            onInput={(e) => { safeCall('onPincodeInput') }} onKeyDown={(e) => { if(e.key==='Enter') safeCall('lookupPincode') }} autocomplete="off" />
          <button className="pm-find-btn" id="pincode-find-btn" onClick={(e) => { safeCall('lookupPincode') }} disabled>Find</button>
        </div>
        <div className="pm-autocomplete" id="pm-autocomplete"></div>
      </div>
      <div className="pm-error" id="pincode-error">Location not found. Please try another.</div>
      <div className="pm-result" id="pincode-result"></div>
      <div className="pm-divider"><span>OR CHOOSE CITY</span></div>
      <div className="pm-cities">
        <button className="pm-city-chip" onClick={(e) => { safeCall('pickCity', 'Bhubaneswar') }}>Bhubaneswar</button>
        <button className="pm-city-chip" onClick={(e) => { safeCall('pickCity', 'Cuttack') }}>Cuttack</button>
        <button className="pm-city-chip" onClick={(e) => { safeCall('pickCity', 'Puri') }}>Puri</button>
        <button className="pm-city-chip" onClick={(e) => { safeCall('pickCity', 'Rourkela') }}>Rourkela</button>
        <button className="pm-city-chip" onClick={(e) => { safeCall('pickCity', 'Sambalpur') }}>Sambalpur</button>
        <button className="pm-city-chip" onClick={(e) => { safeCall('pickCity', 'Berhampur') }}>Berhampur</button>
      </div>
      <button className="pm-gps-btn" onClick={(e) => { safeCall('useGPS') }}>📶 Use my current GPS location</button>
    </div>
  </div>

  {/*  Location Permission Banner  */}
  <div className="loc-banner" id="loc-banner" style={{display: 'none'}}>
    <div className="loc-banner-inner">
      <div className="loc-banner-icon">📍</div>
      <div className="loc-banner-title">Find barbers near you</div>
      <div className="loc-banner-sub">Allow Trimzy to use your location to show the nearest available barbers — just like
        Uber, but for haircuts.</div>
      <button className="loc-allow-btn" onClick={(e) => { safeCall('requestLocation') }}> Allow Location Access</button>
      <button className="loc-skip-btn" onClick={(e) => { safeCall('dismissLocBanner') }}>Maybe later</button>
    </div>
  </div>

  <nav>
    <Link to="/" className="nav-logo">Trim<span>zy</span></Link>
    <div className="nav-links">
      <Link to="/">Home</Link>
      <Link to="/how-it-works">How It Works</Link>
      <Link to="/for-barbers">For Barbers</Link>

      <Link to="/about">About</Link>
    </div>
    <div className="nav-right" style={{display: 'flex', gap: '12px', alignItems: 'center', flex: '1', justifyContent: 'flex-end'}}>
      <div className="city-btn-wrap">
        <button className="city-btn" id="city-btn" onClick={(e) => { safeCall('openPincodeModal') }}>
          <div className="city-icon" id="loc-dot">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <span className="city-name" id="loc-label">Detecting...</span>
          <div className="city-chevron">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
      </div>
      <div className="nav-cta" id="nav-cta" style={{display: 'flex', gap: '12px', alignItems: 'center', flex: 'none'}}>
        <div className="nav-auth-wrapper" id="nav-auth-wrapper" style={{display: 'flex', alignItems: 'center'}}>
          <div className="profile-corner" id="profile-corner" style={{display: 'none'}}>
            <div style={{position: 'relative', width: 'fit-content'}}>
              <div className="profile-btn" id="profile-btn" onClick={(e) => { safeCall('toggleProfileDropdown', e) }}>?</div>
              <span
                style={{position: 'absolute', right: '-2px', bottom: '-2px', display: 'flex', width: '16px', height: '16px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'white', pointerEvents: 'none'}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" stroke="white"
                  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{width: '100%', height: '100%'}}>
                  <path
                    d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
            </div>
            <div className="profile-dropdown" id="profile-dropdown">
              <div className="pd-header">
                <div className="pd-name" id="pd-name">—</div>
                <div className="pd-email" id="pd-email">—</div>
              </div>
              <hr className="pd-divider" />
              <button className="pd-item" onClick={(e) => { safeCall('requireAuthThen', 'bookings'); safeCall('toggleProfileDropdown') }}> My
                Bookings</button>
              <button className="pd-item" onClick={(e) => { safeCall('switchAppView', 'browse'); safeCall('toggleProfileDropdown') }}> Browse Barbers</button>
              <hr className="pd-divider" />
              <button className="pd-item pd-logout" onClick={(e) => { safeCall('doLogout') }}> Log Out</button>
            </div>
          </div>
          <button id="login-corner-btn"
            onClick={() => window.openAuthModal ? window.openAuthModal() : navigate('/auth?redirect=app')}
            style={{padding: '8px 16px', borderRadius: '10px', border: 'none', fontFamily: "'Sora',sans-serif'", fontSize: '12px', fontWeight: '700', color: 'var(--navy)', background: 'var(--gold)', cursor: 'pointer', display: 'none'}}>Log
            In</button>
        </div>
      </div>
    </div>
    <button className="hamburger" id="hamburger"><span></span><span></span><span></span></button>
  </nav>
  <div className="mobile-menu" id="mobile-menu">
    <Link to="/">Home</Link>
    <Link to="/how-it-works">How It Works</Link>
    <Link to="/for-barbers">For Barbers</Link>
    <Link to="/about">About</Link>
    <div className="mobile-menu-btns"></div>
  </div>

  {/*  Login Gate  */}
  <div className="login-gate" id="login-gate">
    <div className="lg-box">
      <div className="lg-icon"></div>
      <div className="lg-title">Log in to book</div>
      <div className="lg-sub">Create a free account or log in to confirm your booking and track all your appointments.</div>
      <div className="lg-btns">
        <button className="lg-btn-primary" onClick={(e) => { safeCall('openAuthModal') }}>Create Account / Log In →</button>
        <button className="lg-btn-outline" onClick={(e) => { document.getElementById('login-gate').classList.remove('show') }}>Maybe
          later</button>
      </div>
    </div>
  </div>

  <div className="app-shell">
    <div className="app-header">

      <div className="app-search-row" id="search-bar">
        <div className="app-search-wrap">
          <input className="app-search" id="search-input" type="text" placeholder="Search barber or area..."
            onInput={(e) => { safeCall('filterBarbers') }} autocomplete="off" />
        </div>
        <select className="app-filter-select" id="sort-select" onChange={(e) => { safeCall('filterBarbers') }}>
          <option value="rating">Top Rated</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="distance">Nearest First</option>
        </select>
        <select className="app-filter-select" id="area-select" onChange={(e) => { safeCall('filterBarbers') }}>
          <option value="">All Areas</option>
          <option>Saheed Nagar</option>
          <option>Bapuji Nagar</option>
          <option>IRC Village</option>
          <option>Patia</option>
          <option>Nayapalli</option>
          <option>Kharvel Nagar</option>
        </select>
      </div>
    </div>

    <div className="app-view active" id="view-browse">
      <div className="app-body">
        <div className="app-results-meta">
          <div className="arm-count"><span id="result-count">8</span> barbers near you</div>
        </div>
        <div className="barber-grid" id="barber-grid"></div>
      </div>
    </div>

    <div className="app-view" id="view-bookings">
      <div className="app-body" id="bookings-body">
        <div className="bookings-loading">
          <div className="spin"></div>Loading your bookings...
        </div>
      </div>
    </div> {/*  End view-bookings  */}

    <div className="app-view" id="view-ticket">
      <div id="ticket-body" style={{width: '100%'}}></div>
    </div>
  </div> {/*  End main-wrap or whatever encloses all app-views  */}

  {/*  Rating Modal  */}
  <div className="rating-overlay" id="rating-modal-overlay">
    <div className="rating-modal">
      <div className="rm-icon">✨</div>
      <div className="rm-title">How was your cut?</div>
      <div className="rm-sub">Rate your experience with <strong id="rm-barber-name">...</strong></div>
      <div className="rm-stars">
        <span className="rm-star" onClick={(e) => { safeCall('setRating', 1) }}>★</span>
        <span className="rm-star" onClick={(e) => { safeCall('setRating', 2) }}>★</span>
        <span className="rm-star" onClick={(e) => { safeCall('setRating', 3) }}>★</span>
        <span className="rm-star" onClick={(e) => { safeCall('setRating', 4) }}>★</span>
        <span className="rm-star" onClick={(e) => { safeCall('setRating', 5) }}>★</span>
      </div>
      <textarea className="rm-comment" id="rm-comment" placeholder="Leave a short review (optional)..." rows="3"></textarea>
      <div style={{display: 'flex', gap: '10px'}}>
        <button className="rm-submit" id="rm-submit-btn" onClick={(e) => { safeCall('submitReview') }}>Submit Review</button>
        <button className="pm-close" onClick={(e) => { safeCall('closeRatingModal') }}
          style={{position: 'static', width: 'auto', height: '48px', padding: '0 20px', borderRadius: '14px'}}>Cancel</button>
      </div>
    </div>
  </div>

  <div className="panel-overlay" id="panel-overlay" onClick={(e) => { safeCall('closePanel') }}></div>
  <div className="booking-panel" id="booking-panel">
    <div className="bp-handle"></div>
    <div className="bp-header">
      <div className="bp-barber-info">
        <div className="bp-avatar" id="bp-avatar"></div>
        <div>
          <div className="bp-name" id="bp-barber-name"></div>
          <div className="bp-detail" id="bp-barber-detail"></div>
        </div>
      </div>
      <button className="bp-close" onClick={(e) => { safeCall('closePanel') }}>✕</button>
    </div>
    <div className="bp-steps">
      <div className="bp-step active" id="step-tab-1" onClick={(e) => { safeCall('goToStep', 1) }}>1. Service</div>
      <div className="bp-step" id="step-tab-2" onClick={(e) => { safeCall('goToStep', 2) }}>2. Date & Time</div>
      <div className="bp-step" id="step-tab-3" onClick={(e) => { safeCall('goToStep', 3) }}>3. Confirm</div>
    </div>
    <div className="bp-content-step active" id="step-1">
      <div className="service-list" id="service-list"></div>
      <div className="bp-action">
        <button className="bp-next-btn" id="next-1" onClick={(e) => { safeCall('goToStep', 2) }} disabled>Choose Date & Time →</button>
      </div>
    </div>
    <div className="bp-content-step" id="step-2">
      <div style={{fontFamily: "'Sora',sans-serif'", fontSize: '13px', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px'}}>
        Select a date</div>
      <div className="date-strip" id="date-strip"></div>
      <div style={{fontFamily: "'Sora',sans-serif'", fontSize: '13px', fontWeight: '700', color: 'var(--navy)', marginBottom: '10px'}}>
        Available time slots</div>
      <div className="time-grid" id="time-grid"></div>
      <div className="bp-action">
        <button className="bp-back-btn" onClick={(e) => { safeCall('goToStep', 1) }}>← Back</button>
        <button className="bp-next-btn" id="next-2" onClick={(e) => { safeCall('goToStep', 3) }} disabled>Review Booking →</button>
      </div>
    </div>
    <div className="bp-content-step" id="step-3">
      <div className="booking-summary" id="booking-summary"></div>

      {/*  Customer details  */}
      <div className="cf-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
        <div className="cf-field"><label className="cf-field-label"
            style={{fontSize: '12px', fontWeight: '600', color: 'var(--navy)', display: 'block', marginBottom: '5px'}}>Your Name
            *</label><input className="cf-field-input"
            style={{padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontFamily: "'DM Sans',sans-serif'", fontSize: '14px', color: 'var(--navy)', outline: 'none', transition: 'all .2s', background: '#fff', width: '100%'}}
            type="text" id="cust-name" required placeholder="Full name" /></div>
        <div className="cf-field"><label
            style={{fontSize: '12px', fontWeight: '600', color: 'var(--navy)', display: 'block', marginBottom: '5px'}}>Phone
            *</label><input
            style={{padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontFamily: "'DM Sans',sans-serif'", fontSize: '14px', color: 'var(--navy)', outline: 'none', transition: 'all .2s', background: '#fff', width: '100%'}}
            type="tel" id="cust-phone" required placeholder="+91 98765..." /></div>
        <div style={{gridColumn: '1/-1'}}><label
            style={{fontSize: '12px', fontWeight: '600', color: 'var(--navy)', display: 'block', marginBottom: '5px'}}>Email (for
            receipt)</label><input
            style={{padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontFamily: "'DM Sans',sans-serif'", fontSize: '14px', color: 'var(--navy)', outline: 'none', transition: 'all .2s', background: '#fff', width: '100%'}}
            type="email" id="cust-email" placeholder="you@example.com" /></div>
        <div id="home-address-wrap" style={{display: 'none', gridColumn: '1/-1'}}><label
            style={{fontSize: '12px', fontWeight: '600', color: 'var(--navy)', display: 'block', marginBottom: '5px'}}>Your Address
            *</label><input
            style={{padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontFamily: "'DM Sans',sans-serif'", fontSize: '14px', color: 'var(--navy)', outline: 'none', transition: 'all .2s', background: '#fff', width: '100%'}}
            type="text" id="cust-address" placeholder="Flat no., Street, Area, Bhubaneswar" /></div>
        <div style={{gridColumn: '1/-1'}}><label
            style={{fontSize: '12px', fontWeight: '600', color: 'var(--navy)', display: 'block', marginBottom: '5px'}}>Notes for
            barber</label><input
            style={{padding: '11px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontFamily: "'DM Sans',sans-serif'", fontSize: '14px', color: 'var(--navy)', outline: 'none', transition: 'all .2s', background: '#fff', width: '100%'}}
            type="text" id="cust-notes" placeholder="e.g. side fade, keep beard short..." /></div>
      </div>

      {/*  Payment section  */}
      <div className="payment-divider"><span>Choose Payment Method</span></div>

      <div className="pay-total-row">
        <span className="pay-total-label">Amount to pay</span>
        <span className="pay-total-amount" id="pay-total-display">₹0</span>
      </div>

      <div className="payment-options">
        {/*  Option 1: UPI  */}
        <button type="button" className="payment-option selected" id="po-upi" onClick={(e) => { safeCall('selectPayment', 'upi') }}>
          <div className="po-radio" id="radio-upi" style={{background: 'var(--gold)', borderColor: 'var(--gold)'}}>
            <div
              style={{display: 'block', width: '10px', height: '10px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
            </div>
          </div>
          <span className="po-icon">📱</span>
          <div>
            <div className="po-title">Pay with UPI</div>
            <div className="po-sub">PhonePe · GPay · Paytm · Any UPI app</div>
          </div>
          <span className="po-badge">Instant</span>
        </button> 

        {/*  Option 2: Card  */}
        <button type="button" className="payment-option" id="po-card" onClick={(e) => { safeCall('selectPayment', 'card') }}>
          <div className="po-radio" id="radio-card"></div>
          <span className="po-icon"></span>
          <div>
            <div className="po-title">Pay with Card / Net Banking</div>
            <div className="po-sub">Credit card · Debit card · Net banking</div>
          </div>
        </button>

        {/*  Option 3: Pay Barber  */}
        <button type="button" className="payment-option" id="po-cash" onClick={(e) => { safeCall('selectPayment', 'cash') }}>
          <div className="po-radio" id="radio-cash"></div>
          <span className="po-icon"></span>
          <div>
            <div className="po-title">Pay Barber in Person</div>
            <div className="po-sub">Pay via UPI or cash after your cut</div>
          </div>
          <span className="po-badge" style={{background: 'rgba(232,164,74,.1)', color: 'var(--gold)'}}>Free</span>
        </button>
      </div>

      <div className="pay-secure"> Secured by Razorpay · 256-bit SSL encryption</div>

      <div className="bp-action">
        <button type="button" className="bp-back-btn" onClick={(e) => { safeCall('goToStep', 2) }}>← Back</button>
        <button type="button" className="bp-next-btn" id="confirm-btn" onClick={(e) => { safeCall('handlePayment') }}>
          Proceed to Pay →
        </button>
      </div>
    </div>
  </div>

  <div className="success-screen" id="success-screen">
    <div className="ss-circle">✓</div>
    <div className="ss-title" id="ss-title">Booked! See you <span>soon.</span></div>
    <div className="ss-sub" id="ss-desc">Your booking is saved The barber has been notified</div>
    <div className="ss-card" id="ss-card"></div>
    <div className="ss-id" id="ss-id"></div>
    <div className="ss-btns">
      <button className="ss-btn-primary" onClick={(e) => { safeCall('bookAnother') }}>Book Another</button>
      <button className="ss-btn-outline" onClick={(e) => { safeCall('viewMyBookings') }}>My Bookings</button>
      <button className="ss-btn-outline" onClick={(e) => { navigate('/') }}>Home</button>
    </div>
  </div>

  

    </>
  );
};

export default AppPage;
