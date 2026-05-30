import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/barber-dashboard.css';

const BarberDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }
    import('../../js/barber-dashboard.js').catch(err => console.error(err));
  }, []);

  return (
    <>
      
  {/*  GLOBAL LOADER  */}
  <div id="global-loader" className="global-loader">
    <div className="gl-logo">Trim<span>zy</span></div>
    <div className="gl-blueprint"></div>
  </div>

  {/*  ONBOARDING WIZARD OVERLAY  */}
  <div id="onboarding-wizard" style={{display: 'none'}} className="fixed inset-0 bg-[#0B0B18] z-50 flex-col overflow-y-auto">
    <div id="wizard-top-bar" className="sticky top-0 bg-[#0B0B18] z-10 p-4 border-b border-border/20 flex flex-col gap-2 shadow-sm">
      <div className="flex justify-between text-sm font-bold text-white">
        <span>Profile Setup</span>
        <span className="text-gold"><span id="wizard-percent">10</span>%</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div id="wizard-progress-bar" className="h-full bg-gold transition-all duration-500 ease-out" style={{width: '10%'}}></div>
      </div>
    </div>
    
    {/*  STEP 0: Welcome (Full Screen)  */}
    <div className="wizard-step active h-full w-full max-w-none items-center justify-center" id="wizard-step-0" style={{padding: '0', minHeight: '100vh', overflow: 'hidden', background: '#0B0B18', zIndex: '9999', maxWidth: '100% !important'}}>
      
      <div className="z-20 flex flex-col items-center text-center px-4 max-w-3xl mx-auto relative top-[-5vh]">
          <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold backdrop-blur-sm animate-fade-in-up">
            Join over 50+ happy barbers
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6 animate-fade-in-up" style={{animationDelay: '0.1s', lineHeight: '1.1'}}>
            Grow your income <br /> <span className="text-gold">Your way</span>
          </h1>
          <p className="text-lg md:text-xl text-gray max-w-xl mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Boost your business with direct UPI payments and zero commission. Setup your profile in 2 minutes and start accepting bookings today.
          </p>
          <button onClick={(e) => { nextWizardStep() }} className="animate-fade-in-up px-8 py-4 rounded-full bg-gold text-navy font-bold shadow-[0_0_20px_rgba(240,165,0,0.4)] transition-all hover:scale-105 hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-75 text-lg flex items-center gap-2" style={{animationDelay: '0.3s'}}>
            Get Started <i data-lucide="arrow-right" className="w-5 h-5"></i>
          </button>
        </div>

        {/*  Animated Image Marquee  */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 md:h-2/5 z-10 pointer-events-none" style={{WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'}}>
          <div className="flex gap-4 marquee-track" style={{width: 'max-content'}}>
            {/*  Images will be injected by JS or just hardcoded here  */}
            
          </div>
        </div>
      </div>

    {/*  MAIN WIZARD CONTAINER for Steps 1-3  */}
    <div className="flex-1 w-full max-w-2xl mx-auto p-6 md:p-12 flex flex-col relative pb-24">
      
      {/*  STEP 1: Basic Details  */}
      <div className="wizard-step" id="wizard-step-1">
        <h2 className="text-2xl font-bold text-white mb-2">Basic Details</h2>
        <p className="text-gray mb-8">What should customers call your shop?</p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/80">Shop Name *</label>
            <input type="text" id="wiz-shopname" className="w-full bg-navy border border-border rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="E.g. Rajan's Scissors" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/80">About You / Your Shop (Optional)</label>
            <textarea id="wiz-bio" rows="3" className="w-full bg-navy border border-border rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="Specialties, experience..."></textarea>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
           <button className="px-6 py-3 text-gray hover:text-white transition-colors invisible">Back</button>
           <button onClick={(e) => { nextWizardStep() }} className="px-8 py-3 bg-gold text-navy font-bold rounded-xl hover:bg-gold/90 transition-transform active:scale-95">Next →</button>
        </div>
      </div>

      {/*  STEP 2: Pictures & Services  */}
      <div className="wizard-step" id="wizard-step-2">
        <h2 className="text-2xl font-bold text-white mb-2">Shop Setup</h2>
        <p className="text-gray mb-8">Add a photo and your primary service.</p>
        
        <div className="space-y-6">
          <div className="space-y-2 flex flex-col items-center sm:items-start">
            <label className="text-sm font-semibold text-white/80 w-full text-center sm:text-left">Profile / Shop Photo</label>
            <div className="flex items-center gap-4">
              <div id="wiz-avatar-preview" className="w-20 h-20 bg-navy rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                <i data-lucide="camera" className="w-6 h-6 text-gray"></i>
              </div>
              <div>
                <input type="file" id="wiz-avatar-upload" accept="image/*" className="hidden" onChange={(e) => { handleWizAvatarUpload(event) }} />
                <label htmlFor="wiz-avatar-upload" className="px-4 py-2 bg-white/5 border border-border rounded-lg text-sm text-white cursor-pointer hover:bg-white/10 transition-colors">Choose Image</label>
                <p className="text-xs text-gray mt-2">Optional. You can change this later.</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-navy rounded-xl border border-border space-y-4">
             <h3 className="font-bold text-white text-sm">Add your first service</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Service Name *</label>
                  <input type="text" id="wiz-service-name" className="w-full bg-black/20 border border-border rounded-lg p-3 text-white focus:outline-none focus:border-gold" placeholder="Standard Haircut" value="Standard Haircut" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">Price (₹) *</label>
                  <input type="number" id="wiz-service-price" className="w-full bg-black/20 border border-border rounded-lg p-3 text-white focus:outline-none focus:border-gold" placeholder="150" value="150" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Opens at</label>
                <input type="time" id="wiz-time-open" className="w-full bg-navy border border-border rounded-xl p-3 text-white focus:outline-none focus:border-gold" value="09:00" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">Closes at</label>
                <input type="time" id="wiz-time-close" className="w-full bg-navy border border-border rounded-xl p-3 text-white focus:outline-none focus:border-gold" value="21:00" />
             </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
           <button onClick={(e) => { prevWizardStep() }} className="px-6 py-3 text-gray hover:text-white transition-colors">← Back</button>
           <button onClick={(e) => { nextWizardStep() }} className="px-8 py-3 bg-gold text-navy font-bold rounded-xl hover:bg-gold/90 transition-transform active:scale-95">Next →</button>
        </div>
      </div>

      {/*  STEP 3: Address & Payment  */}
      <div className="wizard-step" id="wizard-step-3">
        <h2 className="text-2xl font-bold text-white mb-2">Location & Payment</h2>
        <p className="text-gray mb-8">Almost done! We need these to get you paid and booked.</p>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80">Street / Area / Landmark *</label>
              <input type="text" id="wiz-street" className="w-full bg-navy border border-border rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="Plot No, Street, Landmark..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">City *</label>
                <input type="text" id="wiz-city" className="w-full bg-navy border border-border rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Bhubaneswar" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">State *</label>
                <input type="text" id="wiz-state" className="w-full bg-navy border border-border rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. Odisha" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80">Pincode *</label>
              <input type="text" id="wiz-pincode" className="w-full bg-navy border border-border rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="e.g. 751024" />
            </div>
          </div>
          
          <div className="space-y-4 relative">
            <div className="p-6 bg-navy rounded-2xl border border-border mt-4 group focus-within:border-gold transition-colors">
              <div className="absolute -top-3 left-6 px-2 bg-[#0B0B18]">
                <label className="text-xs font-bold text-gold flex items-center gap-2">
                  <i data-lucide="indian-rupee" className="w-3 h-3"></i> UPI ID for Earnings *
                </label>
              </div>
              <input type="text" id="wiz-upi" className="w-full bg-black/20 border border-border rounded-xl p-4 text-white focus:outline-none focus:border-gold" placeholder="8514806487@upi" />
              <p className="text-xs text-gray mt-3">100% of your earnings go directly to this UPI ID.</p>
            </div>
          </div>
        </div>

        <div id="wiz-error" className="hidden mt-4 text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20"></div>

        <div className="mt-8 flex justify-between">
           <button onClick={(e) => { prevWizardStep() }} className="px-6 py-3 text-gray hover:text-white transition-colors">← Back</button>
           <button onClick={(e) => { finishWizard() }} id="btn-finish-wizard" className="px-8 py-3 bg-gold text-navy font-bold rounded-xl hover:bg-gold/90 transition-transform active:scale-95 flex items-center gap-2">
              Finish Setup 🎉
           </button>
        </div>
      </div>
    </div>

    </div>
  <div className="flex h-screen overflow-hidden">
    {/*  SIDEBAR (Desktop Only)  */}
    <aside className="hidden md:flex w-64 flex-shrink-0 bg-white border-r border-border flex flex-col h-full z-20">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-gold/20 overflow-hidden">
            <img src="favicon.jpg" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-navy text-xl font-black tracking-tighter">trimzy</span>
            <p className="text-gray text-[10px] font-bold uppercase tracking-widest">Partner Portal</p>
          </div>
        </div>
      </div>

      {/*  Profile Section  */}
      <div className="px-4 py-4 border-b border-border">
        <div className="bg-bg/50 border border-border p-4 rounded-2xl space-y-3 hover:border-gold/30 transition-all group">
          <div className="flex items-center gap-3">
            <div id="side-pwa-avatar"
              className="w-14 h-14 rounded-full bg-gold/10 border-2 border-white shadow-sm flex items-center justify-center text-gold font-black text-xl uppercase overflow-hidden">
              ?
            </div>
            <div className="flex-1 min-w-0">
              <p id="side-pwa-name" className="text-navy text-sm font-black truncate leading-tight">...</p>
              <p id="side-pwa-shop" className="text-gray text-[10px] font-bold truncate mt-0.5">...</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-xl border border-border">
              <i data-lucide="star" className="w-3 h-3 text-gold fill-current"></i>
              <span id="side-pwa-rating" className="text-navy text-[10px] font-extrabold uppercase mt-0.5">4.9</span>
              <span id="side-pwa-count" className="text-gray text-[9px] font-bold">(284)</span>
            </div>
            <div id="side-pwa-status-badge"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray/5 border border-border rounded-xl transition-all">
              <span id="side-pwa-status-dot" className="w-1.5 h-1.5 rounded-full bg-gray"></span>
              <span id="side-pwa-status-text"
                className="text-[9px] font-black uppercase tracking-widest text-gray">Offline</span>
            </div>
          </div>
        </div>
      </div>


      {/*  Nav  */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto hide-scrollbar">
        <button onClick={(e) => { setScreen('dashboard') }} id="nav-dashboard"
          className="sidebar-active w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group">
          <i data-lucide="layout-dashboard" className="w-4 h-4"></i>
          <span className="text-sm font-bold">Dashboard</span>
        </button>
        <button onClick={(e) => { setScreen('appointments') }} id="nav-appointments"
          className="text-gray hover:bg-gold/5 hover:text-gold w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group">
          <i data-lucide="calendar" className="w-4 h-4"></i>
          <span className="text-sm font-bold">Appointments</span>
          <span id="pending-badge"
            className="hidden ml-auto bg-gold text-white text-[10px] px-2 py-0.5 rounded-full font-bold">0</span>
        </button>
        <button onClick={(e) => { setScreen('earnings') }} id="nav-earnings"
          className="text-gray hover:bg-gold/5 hover:text-gold w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group">
          <i data-lucide="bar-chart-3" className="w-4 h-4"></i>
          <span className="text-sm font-bold">Earnings</span>
        </button>
        <button onClick={(e) => { setScreen('profile') }} id="nav-profile"
          className="text-gray hover:bg-gold/5 hover:text-gold w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group">
          <i data-lucide="user" className="w-4 h-4"></i>
          <span className="text-sm font-bold">My Shop</span>
        </button>
        <button onClick={(e) => { setScreen('reviews') }} id="nav-reviews"
          className="text-gray hover:bg-gold/5 hover:text-gold w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group">
          <i data-lucide="star" className="w-4 h-4"></i>
          <span className="text-sm font-bold">Reviews</span>
        </button>
        <div className="pt-3 pb-1 px-4">
          <p className="text-[9px] font-bold text-gray uppercase tracking-widest">System</p>
        </div>
        <button onClick={(e) => { setScreen('settings') }} id="nav-settings"
          className="text-gray hover:bg-gold/5 hover:text-gold w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group">
          <i data-lucide="settings" className="w-4 h-4"></i>
          <span className="text-sm font-bold">Settings</span>
        </button>

        {/*  Status Card  */}
        <div className="mt-4 p-4 mx-0 rounded-2xl bg-bg border border-border shadow-sm transition-all duration-300"
          id="status-card-sidebar">
          <div className="flex items-center justify-between">
            <div>
              <p id="status-card-title" className="text-xs font-black uppercase tracking-tight">Accepting Bookings</p>
              <p id="status-card-sub" className="text-[10px] text-gray font-medium mt-0.5">Customers can find you</p>
            </div>
            <label className="switch">
              <input type="checkbox" id="sidebar-status-checkbox" onClick={(e) => { window.toggleShopStatus(this.checked) }} />
              <span id="sidebar-slider" className="slider"></span>
            </label>
          </div>
        </div>
      </nav>

      {/*  Bottom Profile  */}
      <div className="p-4 border-t border-border">
        <div className="bg-bg rounded-2xl p-3 flex items-center gap-3">
          <div id="barber-avatar-side"
            className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold">
            ?</div>
          <div className="flex-1 min-w-0">
            <p id="barber-name-side" className="text-navy text-xs font-bold truncate">...</p>
            <p className="text-gray text-[10px] truncate">Verified Partner</p>
          </div>
          <button id="logout-btn-side" className="p-2 text-gray hover:text-red-500 transition-colors">
            <i data-lucide="log-out" className="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </aside>

    {/*  MAIN CONTENT AREA  */}
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

      {/*  MOBILE HEADER (Mobile Only)  */}
      <header
        className="md:hidden h-16 flex-shrink-0 bg-white border-b border-border flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src="favicon.jpg" className="w-full h-full object-cover" />
          </div>
          <span className="text-navy text-lg font-black tracking-tighter">trimzy</span>
        </div>
        <div className="flex items-center gap-3">
          <button id="status-toggle-mobile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg border border-border transition-all">
            <span id="status-dot-mobile" className="w-2 h-2 rounded-full bg-gray"></span>
            <span id="status-text-mobile"
              className="text-[10px] font-black uppercase tracking-widest text-navy">OFFLINE</span>
          </button>
        </div>
      </header>

      {/*  TOPBAR (Desktop Only)  */}
      <header
        className="hidden md:flex h-20 flex-shrink-0 bg-white border-b border-border items-center justify-between px-8 z-10">
        <div>
          <h1 id="screen-title" className="text-navy text-2xl font-black tracking-tighter">Dashboard</h1>
          <p id="topbar-date" className="text-gray text-xs font-medium">...</p>
        </div>
        <div className="flex items-center gap-4">
          <button id="status-toggle-new"
            className="flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl transition-all group">
            <span id="status-dot-new" className="w-2.5 h-2.5 rounded-full bg-gray"></span>
            <span id="status-text-new" className="text-navy text-xs font-bold uppercase tracking-wider">OFFLINE</span>
          </button>

          <button onClick={(e) => { previewShop() }}
            className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-navy2 transition-all shadow-lg shadow-navy/10">
            <i data-lucide="plus" className="w-4 h-4 text-gold"></i>
            <span>Preview Shop</span>
          </button>
        </div>
      </header>

      {/*  CONTENT  */}
      <main id="main-content"
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 bg-[#F6F5F2] pb-32 md:pb-8">
        {/*  Dashboard Content will be injected here  */}
      </main>

      {/*  BOTTOM NAVIGATION (Mobile Only)  */}
      <nav
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-navy/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center justify-around px-2 z-[50]">
        <button onClick={(e) => { setScreen('dashboard') }} id="m-nav-dashboard"
          className="flex flex-col items-center gap-1 group text-gold">
          <i data-lucide="layout-dashboard" className="w-5 h-5"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest">Dash</span>
        </button>
        <button onClick={(e) => { setScreen('appointments') }} id="m-nav-appointments"
          className="flex flex-col items-center gap-1 group text-white/50">
          <i data-lucide="calendar" className="w-5 h-5"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest">Bookings</span>
        </button>
        <button onClick={(e) => { setScreen('earnings') }} id="m-nav-earnings"
          className="flex flex-col items-center gap-1 group text-white/50">
          <i data-lucide="bar-chart-3" className="w-5 h-5"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest">Earn</span>
        </button>
        <button onClick={(e) => { setScreen('profile') }} id="m-nav-profile"
          className="flex flex-col items-center gap-1 group text-white/50">
          <i data-lucide="user" className="w-5 h-5"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest">Shop</span>
        </button>
        <button onClick={(e) => { setScreen('reviews') }} id="m-nav-reviews"
          className="flex flex-col items-center gap-1 group text-white/50">
          <i data-lucide="award" className="w-5 h-5"></i>
          <span className="text-[9px] font-bold uppercase tracking-widest">Reviews</span>
        </button>
      </nav>
    </div>
  </div>

  <div id="toast"
    className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] flex items-center gap-3 px-6 py-4 bg-white border border-border rounded-2xl shadow-2xl translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
    <div id="toast-icon" className="w-6 h-6 rounded-full flex items-center justify-center"></div>
    <p id="toast-text" className="text-navy text-sm font-bold"></p>
  </div>


  {/*  =====================================================
     FIREBASE — inlined directly, no ./firebase.js import
     =====================================================  */}
  
  {/*  Hidden Inputs for photos (Moved here so they remain in DOM always)  */}
  <input type="file" id="profile-pic-input" accept="image/*" className="hidden" />
  <input type="file" id="salon-photo-input" accept="image/*" className="hidden" multiple />
  <div id="pic-progress"
    style={{display: 'none', position: 'fixed', top: '0', left: '0', width: '100%', height: '4px', zIndex: '9999', background: 'rgba(255,255,255,0.2)'}}>
    <div id="pic-progress-fill" style={{width: '0', height: '100%', background: 'var(--gold)', transition: 'width 0.3s'}}></div>
  </div>
  <div id="salon-progress"
    style={{display: 'none', position: 'fixed', top: '0', left: '0', width: '100%', height: '4px', zIndex: '9999', background: 'rgba(255,255,255,0.2)'}}>
    <div id="salon-progress-fill" style={{width: '0', height: '100%', background: 'var(--gold)', transition: 'width 0.3s'}}></div>
  </div>
  {/*  Google Maps for location picker  */}
  
  

  {/*  PIN VERIFICATION MODAL (V9.0 PREMIER)  */}
  <div id="pin-modal" className="hidden fixed inset-0 bg-navy/60 backdrop-blur-md z-[500] items-center justify-center p-6">
    <div
      className="bg-white w-full max-w-[340px] aspect-square rounded-[40px] shadow-2xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden ring-1 ring-white/20">
      {/*  Decorative Backdrop  */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>

      <div
        className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6 border border-gold/20 shadow-inner">
        <i data-lucide="key-round" className="w-8 h-8"></i>
      </div>

      <h3 className="text-navy text-xl font-black uppercase tracking-tight mb-2">Customer PIN</h3>
      <p className="text-gray text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">Verify identity to start
        session</p>

      <div className="w-full space-y-6">
        <input type="text" id="pin-input"
          className="w-full bg-bg border-2 border-border focus:border-gold rounded-2xl py-4 text-center text-2xl font-black tracking-[1em] text-navy outline-none transition-all placeholder:text-gray/20"
          maxlength="4" placeholder="••••" autocomplete="off" pattern="[0-9]*" inputmode="numeric" />

        <div id="pin-error" className="text-red-500 text-[10px] font-black uppercase tracking-widest min-h-[14px]"></div>

        <div className="flex gap-3">
          <button onClick={(e) => { closePinModal() }}
            className="flex-1 py-4 bg-bg text-gray rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-border transition-colors">Cancel</button>
          <button id="btn-verify-pin" onClick={(e) => { verifyPin() }}
            className="flex-[2] py-4 bg-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-navy2 transition-all shadow-lg shadow-navy/20">Start
            Service</button>
        </div>
      </div>
    </div>
  </div>
  {/*  ONBOARDING WIZARD OVERLAY  */}
  <div id="onboarding-wizard" style={{display: 'none'}}>
    <div className="wizard-header">
      <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
        <div className="text-navy font-black text-xl tracking-tighter">trimzy <span className="text-gold">setup</span></div>
        <div className="text-sm font-bold text-gray"><span id="wizard-percent">0</span>% Completed</div>
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <div className="wizard-progress-track">
          <div className="wizard-progress-bar" id="wizard-progress-bar"></div>
        </div>
      </div>
    </div>

    <div className="wizard-content">
      
      {/*  STEP 0: Welcome  */}
      <div className="wizard-step active" id="wizard-step-0">
        <div className="bg-white p-10 rounded-[32px] shadow-2xl text-center border border-border relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
          <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center text-gold mx-auto mb-6">
            <i data-lucide="party-popper" className="w-10 h-10"></i>
          </div>
          <h2 className="text-3xl font-black text-navy mb-4">Welcome to Trimzy! 🎉</h2>
          <p className="text-gray mb-8 text-lg">Your application is approved. Let's set up your shop profile so customers can start booking appointments.</p>
          <button onClick={(e) => { nextWizardStep() }} className="w-full py-4 bg-navy text-white rounded-2xl font-black uppercase tracking-widest hover:bg-navy2 transition-all shadow-xl shadow-navy/20">Let's Get Started →</button>
        </div>
      </div>

      {/*  STEP 1: Basic Details  */}
      <div className="wizard-step" id="wizard-step-1">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-border">
          <h3 className="text-2xl font-black text-navy mb-2">Basic Details</h3>
          <p className="text-gray mb-6 text-sm">Tell customers about your shop.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">Shop Name <span className="text-red-500">*</span></label>
              <input type="text" id="wiz-shopname" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="e.g. Royal Cuts" onInput={(e) => { updateWizardProgress() }} />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">About / Bio <span className="text-gray font-medium">(Optional)</span></label>
              <textarea id="wiz-bio" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all h-24 resize-none" placeholder="Short description of your shop" onInput={(e) => { updateWizardProgress() }}></textarea>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button onClick={(e) => { prevWizardStep() }} className="px-6 py-4 bg-bg text-gray rounded-2xl font-black uppercase tracking-widest hover:bg-border transition-colors">Back</button>
            <button onClick={(e) => { nextWizardStep() }} className="flex-1 py-4 bg-gold text-navy rounded-2xl font-black uppercase tracking-widest hover:bg-[#d9973e] transition-colors shadow-lg shadow-gold/20">Next Step →</button>
          </div>
        </div>
      </div>

      {/*  STEP 2: Pictures & Services  */}
      <div className="wizard-step" id="wizard-step-2">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-border">
          <h3 className="text-2xl font-black text-navy mb-2">Shop Setup</h3>
          <p className="text-gray mb-6 text-sm">Upload pictures and add your services.</p>
          
          <div className="space-y-6">
            {/*  PWA Avatar Upload (Reuse logic if possible, or simplified)  */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">Profile Avatar <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4">
                <div id="wiz-avatar-preview" className="w-16 h-16 rounded-full bg-bg border-2 border-dashed border-gray flex items-center justify-center text-gray overflow-hidden">
                  <i data-lucide="camera" className="w-6 h-6"></i>
                </div>
                <input type="file" id="wiz-avatar-upload" accept="image/*" className="hidden" onChange={(e) => { handleWizAvatarUpload(event) }} />
                <button onClick={(e) => { document.getElementById('wiz-avatar-upload').click() }} className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy2">Upload Photo</button>
              </div>
            </div>

            {/*  Hint: Shop Photos will be handled in Dashboard for now to save complexity, or we can just ask for 1 main photo  */}
            
            {/*  Quick Service Setup  */}
            <div className="pt-4 border-t border-border">
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">Add Your First Service <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" id="wiz-service-name" className="bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="Service Name (e.g. Haircut)" onInput={(e) => { updateWizardProgress() }} />
                <input type="number" id="wiz-service-price" className="bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="Price (₹)" onInput={(e) => { updateWizardProgress() }} />
              </div>
            </div>
            
            {/*  Quick Hours  */}
            <div className="pt-4 border-t border-border">
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">Working Hours <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray mb-1 block">Opens At</span>
                  <input type="time" id="wiz-time-open" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" value="09:00" onInput={(e) => { updateWizardProgress() }} />
                </div>
                <div>
                  <span className="text-xs text-gray mb-1 block">Closes At</span>
                  <input type="time" id="wiz-time-close" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" value="21:00" onInput={(e) => { updateWizardProgress() }} />
                </div>
              </div>
            </div>

          </div>

          <div className="flex gap-4 mt-10">
            <button onClick={(e) => { prevWizardStep() }} className="px-6 py-4 bg-bg text-gray rounded-2xl font-black uppercase tracking-widest hover:bg-border transition-colors">Back</button>
            <button onClick={(e) => { nextWizardStep() }} className="flex-1 py-4 bg-gold text-navy rounded-2xl font-black uppercase tracking-widest hover:bg-[#d9973e] transition-colors shadow-lg shadow-gold/20">Next Step →</button>
          </div>
        </div>
      </div>

      {/*  STEP 3: Address & Payment  */}
      <div className="wizard-step" id="wizard-step-3">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-border">
          <h3 className="text-2xl font-black text-navy mb-2">Location & Payment</h3>
          <p className="text-gray mb-6 text-sm">Final step to get your shop online.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">Street / Area / Landmark <span className="text-red-500">*</span></label>
              <input type="text" id="wiz-street" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="Plot No, Street, Landmark..." onInput={(e) => { updateWizardProgress() }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">City <span className="text-red-500">*</span></label>
                <input type="text" id="wiz-city" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="Bhubaneswar" onInput={(e) => { updateWizardProgress() }} />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">State <span className="text-red-500">*</span></label>
                <input type="text" id="wiz-state" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="Odisha" onInput={(e) => { updateWizardProgress() }} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">PIN Code <span className="text-red-500">*</span></label>
              <input type="text" id="wiz-pincode" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="751024" onInput={(e) => { updateWizardProgress() }} />
            </div>
            
            <div className="pt-4 border-t border-border">
              <label className="block text-[11px] font-black uppercase tracking-widest text-navy mb-2">Payment UPI ID <span className="text-red-500">*</span></label>
              <input type="text" id="wiz-upi" className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-medium outline-none focus:border-gold transition-all" placeholder="e.g. 9876543210@ybl" onInput={(e) => { updateWizardProgress() }} />
            </div>
          </div>

          <div id="wiz-error" className="mt-4 text-red-500 text-sm font-bold hidden text-center"></div>

          <div className="flex gap-4 mt-10">
            <button onClick={(e) => { prevWizardStep() }} className="px-6 py-4 bg-bg text-gray rounded-2xl font-black uppercase tracking-widest hover:bg-border transition-colors">Back</button>
            <button onClick={(e) => { finishWizard() }} id="btn-finish-wizard" className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">Finish Setup 🎉</button>
          </div>
        </div>
      </div>

    </div>
  </div>

  

    </>
  );
};

export default BarberDashboard;
