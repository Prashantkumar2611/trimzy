import{t as e}from"./index-diwo1yAY.js";import{n as t,t as n}from"./firebase-CknZtHQX.js";import{onAuthStateChanged as r,signOut as i}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";var a=e((()=>{t();var e=null,a=[],o=[],s={avg:5,total:0,distribution:{5:0,4:0,3:0,2:0,1:0}},c=[],l=null,u=null;r(n,async t=>{if(sessionStorage.getItem(`trimzy_fresh_session`)!==`1`&&(console.warn(`[PERSISTENCE] Fresh session: Cleaning legacy storage...`),sessionStorage.clear(),sessionStorage.setItem(`trimzy_fresh_session`,`1`)),!t){location.href=`barber-auth.html`;return}try{console.log(`DEBUG [Clean]: Loading session for UID:`,t.uid);let n=await t.getIdToken(!0),r=window.TRIMZY_CONFIG?.API_URL||`https://trimzy-backend.onrender.com/api`,i=await fetch(`${r}/auth/profile`,{headers:{Authorization:`Bearer ${n}`}});if(i.ok){let t=(await i.json()).user;t&&t.role===`barber`&&(e={id:t._id,...t})}if(!e){console.warn(`[SECURITY] Unauthorized access attempt by non-barber UID:`,t.uid),document.body.innerHTML=`
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:#F6F5F2; font-family:'Inter',sans-serif; text-align:center; padding:24px;">
              <div style="background:white; padding:48px; border-radius:32px; box-shadow:0 4px 24px rgba(0,0,0,0.06); max-width:400px; width:100%; border:1px solid #E6E4E0;">
                <div style="width:72px; height:72px; background:rgba(232,164,74,0.1); border-radius:20px; display:flex; align-items:center; justify-content:center; margin:0 auto 24px; color:#E8A44A;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h1 style="color:#0B0B18; font-weight:900; font-size:24px; margin-bottom:12px; text-transform:uppercase; letter-spacing:-0.5px;">Restricted Access</h1>
                <p style="color:#7B7B8E; font-size:14px; line-height:1.6; margin-bottom:32px; font-weight:500;">This portal is reserved for Trimzy Partner Barbers only. Your account (${t.email}) does not have barber permissions.</p>
                <div style="display:flex; flex-direction:column; gap:12px;">
                   <a href="index.html" style="background:#0B0B18; color:white; padding:16px; border-radius:16px; font-weight:800; text-decoration:none; font-size:14px; transition:all 0.2s;">Go to Customer App</a>
                   <button onclick="window.firebaseLogout()" style="background:#F6F5F2; color:#7B7B8E; padding:14px; border-radius:16px; font-weight:700; border:none; cursor:pointer; font-size:13px;">Log Out & Switch Account</button>
                </div>
              </div>
            </div>
          `;return}e.isOpen===void 0&&(e.isOpen=!1),c=e.salonPhotos||[],Array.isArray(e.services)||(e.services=[{name:`Classic Haircut`,price:`25`,time:`30 min`}]),D(),S()}catch(e){console.error(`Auth Guard Error:`,e),H(`Login error. Please refresh.`,`error`)}});var d=document.getElementById(`logout-btn-side`);d&&d.addEventListener(`click`,async()=>{await i(n),location.href=`barber-auth.html`}),window.previewShop=()=>{let t=n.currentUser?n.currentUser.uid:e?e.id:null;t?window.open(`barber-profile.html?id=${t}&mode=preview`,`_blank`):H(`Session not found. Please refresh.`,`error`)},window.setScreen=e=>{window.currentScreen=e,document.querySelectorAll(`aside nav button`).forEach(e=>{e.classList.remove(`sidebar-active`,`text-white`),e.classList.add(`text-gray`)});let t=document.getElementById(`nav-`+e);t&&(t.classList.remove(`text-gray`),t.classList.add(`sidebar-active`)),[`dashboard`,`appointments`,`earnings`,`profile`,`reviews`,`settings`].forEach(t=>{let n=document.getElementById(`m-nav-`+t);n&&(t===e?(n.classList.remove(`text-white/50`),n.classList.add(`text-gold`)):(n.classList.remove(`text-gold`),n.classList.add(`text-white/50`)))});let n={dashboard:`Dashboard`,appointments:`Appointments`,earnings:`Earnings`,profile:`My Shop`,reviews:`Customer Feedback`,settings:`Settings`},r=document.getElementById(`screen-title`);r&&(r.textContent=n[e]||`Dashboard`),e===`dashboard`?x():e===`appointments`?f():e===`earnings`?p():e===`profile`?h():e===`reviews`?E():e===`settings`?y():(document.getElementById(`main-content`).innerHTML=`
          <div class="flex flex-col items-center justify-center h-64 space-y-4">
            <div class="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <i data-lucide="construction" class="w-6 h-6"></i>
            </div>
            <p class="text-gray font-bold uppercase tracking-widest text-xs">${e} is coming soon...</p>
          </div>
        `,lucide.createIcons())};function f(){let e=document.getElementById(`main-content`);new Date().toLocaleDateString(`en-US`,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`}),e.innerHTML=`
        <div class="space-y-8 pb-20">
          <div class="flex flex-col md:flex-row md:items-center justify-end gap-6 text-right">
            <div class="flex items-center gap-3">
               <p id="bookings-count-meta" class="text-gold text-[10px] font-black uppercase tracking-widest">0 total</p>
               <div class="flex bg-white p-1.5 rounded-2xl border border-border shadow-sm">
                 <button onclick="setBookingFilter('all')" id="filter-all" class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-gold text-white shadow-lg shadow-gold/20">All</button>
                 <button onclick="setBookingFilter('pending')" id="filter-pending" class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-gray hover:text-navy flex items-center gap-2">
                    Pending
                    <span id="pending-tab-badge" class="hidden w-4 h-4 bg-gold text-white rounded-full flex items-center justify-center text-[8px]">0</span>
                 </button>
                 <button onclick="setBookingFilter('upcoming')" id="filter-upcoming" class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-gray hover:text-navy">Upcoming</button>
                 <button onclick="setBookingFilter('completed')" id="filter-completed" class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-gray hover:text-navy">Completed</button>
               </div>
            </div>
          </div>

          <div id="bookings-list" class="flex flex-col gap-4">
             <div class="py-20 text-center"><p class="text-gray text-[10px] font-bold uppercase tracking-widest animate-pulse">Organizing your schedule...</p></div>
          </div>
        </div>
      `,lucide.createIcons(),z()}window.setBookingFilter=e=>{[`all`,`pending`,`upcoming`,`completed`].forEach(t=>{let n=document.getElementById(`filter-`+t);n&&(t===e?n.className=`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-gold text-white shadow-lg shadow-gold/20 flex items-center gap-2`:n.className=`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-gray hover:text-navy flex items-center gap-2`)});let t=document.getElementById(`bookings-list`);t&&(t.dataset.filter=e),z()};function p(){let e=document.getElementById(`main-content`);new Date().toLocaleDateString(`en-US`,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`}),e.innerHTML=`
        <div class="space-y-8 pb-20">
          <!-- KPI Cards -->

          <!-- KPI Cards -->
          <div class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            <div class="bg-white p-6 rounded-2xl border border-border shadow-sm hover:border-gold/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-bl-full flex items-center justify-center translate-x-4 -translate-y-4">
                  <i data-lucide="wallet" class="w-5 h-5 text-gold translate-x-1 -translate-y-1"></i>
               </div>
               <p class="text-gray text-[10px] font-black uppercase tracking-widest">Today's Earnings</p>
               <h3 id="earn-today-display" class="text-navy text-2xl font-black mt-2">₹0</h3>
               <p id="earn-today-count" class="text-gray text-[9px] font-bold uppercase mt-1">From 0 appointments</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-border shadow-sm hover:border-gold/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full flex items-center justify-center translate-x-4 -translate-y-4">
                  <i data-lucide="trending-up" class="w-5 h-5 text-blue-500 translate-x-1 -translate-y-1"></i>
               </div>
               <p class="text-gray text-[10px] font-black uppercase tracking-widest">This Week</p>
               <h3 id="earn-week-display" class="text-navy text-2xl font-black mt-2">₹0</h3>
               <div class="flex items-center gap-1 mt-1">
                  <span class="text-green-500 text-[9px] font-black uppercase">+22%</span>
                  <span class="text-gray text-[9px] font-bold uppercase">vs last week</span>
               </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-border shadow-sm hover:border-gold/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 w-16 h-16 bg-gold-light/5 rounded-bl-full flex items-center justify-center translate-x-4 -translate-y-4">
                  <i data-lucide="calendar" class="w-5 h-5 text-gold translate-x-1 -translate-y-1"></i>
               </div>
               <p class="text-gray text-[10px] font-black uppercase tracking-widest">This Month</p>
               <h3 id="earn-month-display" class="text-navy text-2xl font-black mt-2">₹0</h3>
               <p id="earn-month-count" class="text-gray text-[9px] font-bold uppercase mt-1">Total revenue history</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-border shadow-sm hover:border-gold/30 transition-all group relative overflow-hidden">
               <div class="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full flex items-center justify-center translate-x-4 -translate-y-4">
                  <i data-lucide="clock" class="w-5 h-5 text-red-500 translate-x-1 -translate-y-1"></i>
               </div>
               <p class="text-gray text-[10px] font-black uppercase tracking-widest">Pending Payouts</p>
               <h3 id="earn-pending-display" class="text-navy text-2xl font-black mt-2">₹0</h3>
               <p id="earn-pending-count" class="text-gray text-[9px] font-bold uppercase mt-1">In progress cycle</p>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <!-- Payout Card -->
             <div class="bg-green-500 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-green-500/20 group">
                <div class="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                <div class="flex items-center gap-3 mb-6">
                   <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
                      <i data-lucide="banknote" class="w-5 h-5 text-white"></i>
                   </div>
                   <div>
                      <h4 class="text-xs font-black uppercase tracking-wider">Next Payout</h4>
                      <p class="text-[10px] text-white/70 font-bold uppercase">Coming Friday, ${new Date(Date.now()+10080*60*1e3).toLocaleDateString([],{month:`short`,day:`numeric`})}</p>
                   </div>
                </div>
                
                <p id="payout-balance" class="text-4xl font-black mb-2">₹0</p>
                <p class="text-[10px] text-white/80 font-black uppercase tracking-widest mb-8">Available balance for settlement</p>
                
                <button onclick="showToast('Payout requested!', 'success')" class="w-full py-4 bg-white text-green-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-50 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                   Request Early Payout
                </button>
             </div>

             <!-- Chart Area -->
             <div class="xl:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-6 overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                   <div>
                      <h3 class="text-navy text-sm font-black uppercase tracking-tight">Weekly Revenue</h3>
                      <p class="text-gray text-[10px] font-bold uppercase tracking-widest mt-0.5">Last 7 days performance</p>
                   </div>
                   <div class="flex bg-bg p-1 rounded-xl border border-border">
                      <button class="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white text-navy shadow-sm">Week</button>
                      <button class="px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray hover:text-navy">Month</button>
                      <button class="px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray hover:text-navy">Year</button>
                   </div>
                </div>
                <div class="h-[250px] relative">
                   <canvas id="earnings-chart-new"></canvas>
                </div>
             </div>
          </div>

          <!-- Transaction History -->
          <div class="space-y-6">
             <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-navy text-sm font-black uppercase tracking-tight">Recent Transactions</h3>
                   <p class="text-gray text-[10px] font-bold uppercase tracking-widest mt-0.5">Your breakdown of successful sessions</p>
                </div>
                <button class="text-gold text-[10px] font-black uppercase tracking-widest border-b border-gold/30 hover:border-gold transition-all">View All</button>
             </div>

             <div id="transactions-list-new" class="flex flex-col gap-3">
                <!-- Transaction Items -->
             </div>
          </div>
        </div>
      `,lucide.createIcons(),L(),I()}function m(){let e=document.getElementById(`transactions-list-new`);if(!e)return;let t=a.filter(e=>e.status===`completed`).slice(0,10);if(!t.length){e.innerHTML=`<div class="p-12 text-center bg-white rounded-2xl border border-dashed border-border"><p class="text-gray text-[10px] font-bold uppercase tracking-widest">No settled transactions found</p></div>`;return}e.innerHTML=t.map(e=>{let t=F(e.scheduledAt),n=t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),r=t.toDateString()===new Date().toDateString()?`Today`:t.toLocaleDateString([],{month:`short`,day:`numeric`});return`
          <div class="bg-white border border-border/60 p-4 rounded-2xl flex items-center justify-between hover:border-gold/30 transition-all group overflow-hidden">
             <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center justify-center text-green-500">
                   <i data-lucide="indian-rupee" class="w-4 h-4"></i>
                </div>
                <div>
                   <h4 class="text-navy text-xs font-black tracking-tight leading-tight">${e.customerName||`Customer`}</h4>
                   <p class="text-gray text-[9px] font-bold uppercase tracking-widest mt-0.5">${e.serviceName||`Session Service`}</p>
                </div>
             </div>
             
             <div class="flex items-center gap-8">
                <div class="text-right">
                   <p class="text-navy text-sm font-black">+₹${e.price}</p>
                   <p class="text-gray text-[9px] font-bold uppercase mt-0.5">${r}, ${n}</p>
                </div>
                <div class="min-w-[80px] text-right">
                   <span class="px-2.5 py-1 bg-green-50 text-green-600 border border-green-100 rounded-lg text-[9px] font-black uppercase tracking-widest">Paid</span>
                 </div>
             </div>
          </div>
        `}).join(``)}function h(){let t=e,n=document.getElementById(`main-content`),r=a.filter(e=>e.status===`completed`).reduce((e,t)=>e+(Number(t.price)||0),0),i=a.length;n.innerHTML=`
        <div class="space-y-8 pb-20">
          <!-- ELITE PROFILE HEADER CARD -->
          <div class="bg-navy p-10 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden group">
             <!-- Background Accents -->
             <div class="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all duration-1000"></div>
             
             <div class="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                <!-- Avatar with + -->
                <div class="relative group cursor-pointer" onclick="editProfilePhotos()">
                   <div id="profile-pic-preview-large" class="w-36 h-36 rounded-3xl bg-gold shadow-2xl shadow-gold/20 flex items-center justify-center text-white text-4xl font-black transition-all duration-500 overflow-hidden border-4 border-white/10 ring-8 ring-gold/10">
                      ${t.profilePic?`<img src="${t.profilePic}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">`:g(t)}
                   </div>
                   <div class="absolute -bottom-2 -left-2 w-10 h-10 bg-gold border-4 border-navy rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <i data-lucide="plus" class="w-5 h-5 text-navy font-black"></i>
                   </div>
                </div>
                
                <div class="flex-1 text-center lg:text-left">
                   <h3 class="text-white text-3xl font-black tracking-tight mb-2">${t.name||t.shopName||`Marcus Johnson`}</h3>
                   <p class="text-gray text-[11px] font-extrabold uppercase tracking-[0.2em] mb-6 opacity-60">Master Barber • 8 years experience</p>
                   
                   <div class="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                      <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                         <i data-lucide="star" class="w-4 h-4 text-gold fill-current"></i>
                         <span class="text-white text-xs font-black">${t.rating||`4.9`}</span>
                         <span class="text-gray text-[10px] font-bold">(${t.reviewCount||`284`} reviews)</span>
                      </div>
                      <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                         <i data-lucide="map-pin" class="w-4 h-4 text-gold"></i>
                         <span class="text-white text-xs font-black">${t.area||`Saheed Nagar, BBSR`}</span>
                      </div>
                   </div>
                </div>

                <div class="flex flex-col gap-3 w-full lg:w-auto">
                   <button onclick="editProfileInfo()" class="w-full lg:w-auto px-8 py-4 bg-gold rounded-2xl text-navy font-black text-xs uppercase tracking-widest shadow-xl shadow-gold/20 hover:bg-gold-light transition-all flex items-center justify-center gap-2">
                       <i data-lucide="user-cog" class="w-4 h-4"></i>
                       Edit Profile
                   </button>
                </div>
             </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
             <div class="xl:col-span-2 space-y-8">
                <!-- About Me -->
                <div class="bg-white p-8 rounded-3xl border border-border shadow-sm">
                   <div class="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                      <h3 class="text-navy text-sm font-black uppercase tracking-tight">About Me</h3>
                      <button onclick="editProfileInfo()" class="text-gold text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">Edit <i data-lucide="chevron-right" class="w-3 h-3"></i></button>
                   </div>
                   <p class="text-gray text-[15px] leading-8 font-medium">
                      ${t.about||`Passionate barber with 8+ years of experience specializing in fades, lineups, and classic cuts. Trained at National Academy and certified in advanced clipper techniques. I take pride in making every client look and feel their best.`}
                   </p>
                </div>

                <!-- Services & Pricing -->
                <div class="bg-white p-8 rounded-3xl border border-border shadow-sm">
                   <div class="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                      <h3 class="text-navy text-sm font-black uppercase tracking-tight">Services & Pricing</h3>
                      <button onclick="openServiceModal()" class="text-gold text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">Edit <i data-lucide="chevron-right" class="w-3 h-3"></i></button>
                   </div>
                   
                   <div id="profile-services-list" class="space-y-4 mb-8">
                      ${_(t.services)}
                   </div>
                   
                   <button onclick="openServiceModal()" class="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-3 text-gray hover:border-gold hover:text-gold hover:bg-gold/5 transition-all group">
                      <i data-lucide="plus" class="w-5 h-5 text-gold group-hover:scale-110 transition-transform"></i>
                      <span class="text-[10px] font-black uppercase tracking-widest">Add New Service</span>
                   </button>
                </div>

                <!-- Portfolio Grid -->
                <div class="bg-white p-8 rounded-3xl border border-border shadow-sm">
                   <div class="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                      <h3 class="text-navy text-sm font-black uppercase tracking-tight">Portfolio</h3>
                      <button onclick="document.getElementById('salon-photo-input').click()" class="text-gold text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">Add Photos<i data-lucide="chevron-right" class="w-3 h-3"></i></button>
                   </div>
                   
                   <div id="salon-photos-grid" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <!-- Rendered dynamically -->
                   </div>
                   <div class="mt-8 pt-8 border-t border-border flex items-center justify-between">
                       <p id="photo-count" class="text-gray text-[9px] font-bold uppercase tracking-widest">0 / 6 photos uploaded</p>
                       <button onclick="document.getElementById('salon-photo-input').click()" class="text-navy text-[10px] font-black uppercase bg-bg px-4 py-2 rounded-xl border border-border hover:bg-white transition-all">Add Photos</button>
                   </div>
                </div>
                
                <!-- SAVE ACTION -->
                <div class="bg-navy p-8 rounded-[32px] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                   <div>
                      <h4 class="text-white font-black text-xl leading-tight">Ready to publish?</h4>
                      <p class="text-gray text-xs font-bold uppercase tracking-wider mt-1 opacity-60">Changes go live instantly</p>
                   </div>
                   <button onclick="saveProfileChanges()" class="w-full md:w-auto px-10 py-5 bg-gold text-navy rounded-2xl font-black text-sm shadow-xl shadow-gold/20 hover:bg-gold-light transition-all flex items-center justify-center gap-3">
                      <i data-lucide="check-circle" class="w-5 h-5"></i>
                      SAVE ALL CHANGES
                   </button>
                </div>
             </div>

             <!-- SIDEBAR COLUMN -->
             <div class="space-y-8">
                <!-- STATS CARD -->
                <div class="bg-white p-8 rounded-3xl border border-border shadow-sm">
                   <h3 class="text-navy text-sm font-black uppercase mb-8 tracking-tight border-b border-border pb-4">Business Stats</h3>
                   <div class="space-y-8">
                      <div class="flex items-center gap-4">
                         <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-sm"><i data-lucide="calendar" class="w-5 h-5"></i></div>
                         <div>
                            <p class="text-gray text-[10px] font-extrabold uppercase tracking-widest text-opacity-40">Total Appointments</p>
                            <p class="text-navy text-xl font-black mt-0.5">${i||`1,247`}</p>
                         </div>
                      </div>
                      <div class="flex items-center gap-4">
                         <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 border border-green-100 shadow-sm"><i data-lucide="indian-rupee" class="w-5 h-5"></i></div>
                         <div>
                            <p class="text-gray text-[10px] font-extrabold uppercase tracking-widest text-opacity-40">Total Earnings</p>
                            <p class="text-navy text-xl font-black mt-0.5">₹${r||`28,450`}</p>
                         </div>
                      </div>
                      <div class="flex items-center gap-4">
                         <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm"><i data-lucide="zap" class="w-5 h-5"></i></div>
                         <div>
                            <p class="text-gray text-[10px] font-extrabold uppercase tracking-widest text-opacity-40">Response Time</p>
                            <p class="text-navy text-xl font-black mt-0.5">&lt; 5 min</p>
                         </div>
                      </div>
                      <div class="flex items-center gap-4">
                         <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100 shadow-sm"><i data-lucide="check-circle" class="w-5 h-5"></i></div>
                         <div>
                            <p class="text-gray text-[10px] font-extrabold uppercase tracking-widest text-opacity-40">Completion Rate</p>
                            <p class="text-navy text-xl font-black mt-0.5">98%</p>
                         </div>
                      </div>
                   </div>
                </div>

                <!-- CERTIFICATIONS -->
                <div class="bg-white p-8 rounded-3xl border border-border shadow-sm">
                   <h3 class="text-navy text-sm font-black uppercase mb-8 tracking-tight border-b border-border pb-4">Certifications</h3>
                   <div class="space-y-4">
                      <div class="p-5 border border-border rounded-2xl hover:border-gold/30 transition-all flex items-start gap-4 group">
                         <div class="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold mt-1"><i data-lucide="award" class="w-3.5 h-3.5 fill-current"></i></div>
                         <div>
                            <h4 class="text-navy text-xs font-black leading-tight uppercase group-hover:text-gold transition-colors">Master Barber License</h4>
                            <p class="text-gray text-[10px] font-bold mt-1">International Academy • 2018</p>
                         </div>
                      </div>
                      <div class="p-5 border border-border rounded-2xl hover:border-gold/30 transition-all flex items-start gap-4 group">
                         <div class="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold mt-1"><i data-lucide="award" class="w-3.5 h-3.5 fill-current"></i></div>
                         <div>
                            <h4 class="text-navy text-xs font-black leading-tight uppercase group-hover:text-gold transition-colors">Advanced Clipper Tech</h4>
                            <p class="text-gray text-[10px] font-bold mt-1">Elite Styling Course • 2020</p>
                         </div>
                      </div>
                      <div class="p-5 border border-border rounded-2xl hover:border-gold/30 transition-all flex items-start gap-4 group">
                         <div class="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold mt-1"><i data-lucide="award" class="w-3.5 h-3.5 fill-current"></i></div>
                         <div>
                            <h4 class="text-navy text-xs font-black leading-tight uppercase group-hover:text-gold transition-colors">Beard Specialist</h4>
                            <p class="text-gray text-[10px] font-bold mt-1">Men's Grooming Cert • 2021</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
        <!-- Hidden Legacy Editor Components -->
        <div id="profile-editor-modal" class="hidden fixed inset-0 bg-navy/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div class="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-y-auto shadow-2xl relative">
              <button onclick="closeProfileEditor()" class="absolute right-6 top-6 w-10 h-10 rounded-full bg-bg flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all z-10">
                 <i data-lucide="x" class="w-5 h-5"></i>
              </button>
              <div class="p-10 space-y-8">
                 <h2 class="text-2xl font-black uppercase tracking-tight text-navy">Edit Your Business Info</h2>
                 <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-1.5">
                       <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">Shop Name</label>
                       <input id="pf-shopname" type="text" value="${t.shopName||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="Elite Cuts...">
                    </div>
                    <div class="space-y-1.5">
                       <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">Full Name</label>
                       <input id="pf-name" type="text" value="${t.name||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="John Doe">
                    </div>
                 </div>
                 <div class="space-y-1.5">
                    <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">About Bio</label>
                    <textarea id="pf-about" rows="4" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none resize-none">${t.about||``}</textarea>
                 </div>
                 <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-1.5">
                       <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">Phone Number</label>
                       <input id="pf-phone" type="tel" value="${t.phone||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none">
                    </div>
                    <div class="space-y-1.5">
                       <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">UPI ID</label>
                       <input id="pf-upi" type="text" value="${t.upiId||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none">
                    </div>
                 </div>
                 <div class="space-y-4">
                    <h3 class="text-navy text-xs font-black uppercase tracking-widest border-b border-border/50 pb-2">Location Details</h3>
                    <div class="space-y-1.5">
                       <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">Street / Area / Landmark <span class="text-red-500">*</span></label>
                       <input id="pf-street" type="text" value="${t.address?.street||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="123 Main St">
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                       <div class="space-y-1.5">
                          <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">City <span class="text-red-500">*</span></label>
                          <input id="pf-city" type="text" value="${t.address?.city||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="Bhubaneswar">
                       </div>
                       <div class="space-y-1.5">
                          <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">State <span class="text-red-500">*</span></label>
                          <input id="pf-state" type="text" value="${t.address?.state||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="Odisha">
                       </div>
                       <div class="space-y-1.5">
                          <label class="text-gray text-[10px] font-black uppercase tracking-widest ml-1">Pincode <span class="text-red-500">*</span></label>
                          <input id="pf-pincode" type="text" value="${t.address?.pincode||``}" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="751024">
                       </div>
                    </div>
                 </div>
                 <button onclick="saveProfileAndClose()" class="w-full py-4 bg-gold text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gold/20 hover:scale-[1.01] transition-all">Save Changes</button>
              </div>
           </div>
        </div>
      `,lucide.createIcons(),k()}function g(e){return(e.shopName||e.name||`?`).split(` `).map(e=>e[0]).join(``).toUpperCase().slice(0,2)}function _(e){let t=[];return Array.isArray(e)?t=e:typeof e==`string`&&e.trim()!==``&&(t=[{name:e,price:`---`,time:`30 min`}]),t.length===0&&(t=[{name:`Classic Haircut`,price:`25`,time:`30 min`},{name:`Fade & Design`,price:`35`,time:`45 min`},{name:`Beard Trim & Shape`,price:`15`,time:`20 min`},{name:`Full Grooming Package`,price:`50`,time:`60 min`}]),t.map((e,t)=>`
          <div class="p-5 bg-bg border border-border rounded-2xl flex items-center justify-between hover:border-gold/30 transition-all group relative overflow-hidden">
             <div class="flex-1">
                <p class="text-navy text-sm font-black uppercase tracking-tight">${e.name}</p>
                <p class="text-gray text-[10px] font-bold mt-1 uppercase tracking-widest">${e.time||`30 min`}</p>
             </div>
             
             <div class="flex items-center gap-6">
                <p class="text-gold text-lg font-black">₹${e.price||`0`}</p>
                
                <button onclick="deleteService(${t})" class="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                   <i data-lucide="trash-2" class="w-4.5 h-4.5"></i>
                </button>
             </div>
          </div>
       `).join(``)}window.editProfileInfo=()=>{document.getElementById(`profile-editor-modal`).classList.remove(`hidden`)},window.closeProfileEditor=()=>{document.getElementById(`profile-editor-modal`).classList.add(`hidden`)},window.editProfilePhotos=()=>{document.getElementById(`profile-pic-input`).click(),H(`Profile photo update triggered`,`info`)},window.saveProfileAndClose=async()=>{await V(),closeProfileEditor()};function v(){let t=e,n=document.getElementById(`settings-services-list`);n&&(Array.isArray(t.services)||(typeof t.services==`string`&&t.services.trim()!==``?t.services=[{name:t.services,price:`25`,time:`30 min`}]:t.services=[{name:`Classic Haircut`,price:`25`,time:`30 min`},{name:`Fade & Design`,price:`35`,time:`45 min`}]),n.innerHTML=t.services.map((e,t)=>`
          <div class="p-4 bg-bg border border-border rounded-2xl flex items-center justify-between hover:border-gold/30 transition-all group relative overflow-hidden">
             <div>
                <p class="text-navy text-xs font-black uppercase tracking-tight">${e.name}</p>
                <div class="flex items-center gap-2 mt-0.5">
                   <p class="text-gray text-[9px] font-bold uppercase tracking-widest">${e.time||`30 min`}</p>
                   <span class="text-gray/20 text-[8px]">•</span>
                   <p class="text-gold text-[10px] font-black italic">₹${e.price||`0`}</p>
                </div>
             </div>
             
             <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onclick="deleteService(${t})" class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                   <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
             </div>
          </div>
       `).join(``),lucide.createIcons())}window.openServiceModal=()=>{let e=document.createElement(`div`);e.id=`service-modal`,e.className=`fixed inset-0 bg-navy/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4`,e.innerHTML=`
          <div class="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-up">
             <h2 class="text-xl font-black uppercase tracking-tight text-navy mb-6">Add New Service</h2>
             <div class="space-y-6">
                <div class="space-y-1.5">
                   <label class="text-gray text-[10px] font-black uppercase tracking-widest">Service Item Name</label>
                   <input id="service-name-input" type="text" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="e.g. Skin Fade">
                </div>
                <div class="grid grid-cols-2 gap-4">
                   <div class="space-y-1.5">
                      <label class="text-gray text-[10px] font-black uppercase tracking-widest">Price (₹)</label>
                      <input id="service-price-input" type="number" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none" placeholder="25">
                   </div>
                   <div class="space-y-1.5">
                      <label class="text-gray text-[10px] font-black uppercase tracking-widest">Duration</label>
                      <select id="service-time-input" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none">
                         <option>15 min</option>
                         <option selected>30 min</option>
                         <option>45 min</option>
                         <option>60 min</option>
                         <option>90 min</option>
                      </select>
                   </div>
                </div>
                
                <div class="flex items-center gap-3 pt-4">
                   <button onclick="closeServiceModal()" class="flex-1 py-3 bg-bg text-gray rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                   <button onclick="addNewService()" class="flex-[2] py-3 bg-gold text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gold/20">Add Service</button>
                </div>
             </div>
          </div>
       `,document.body.appendChild(e),lucide.createIcons()},window.closeServiceModal=()=>{let e=document.getElementById(`service-modal`);e&&e.remove()},window.addNewService=async()=>{let t=document.getElementById(`service-name-input`).value,n=document.getElementById(`service-price-input`).value,r=document.getElementById(`service-time-input`).value;if(!t||!n){H(`Please fill all fields`,`error`);return}Array.isArray(e.services)||(e.services=[]);let i=[...e.services,{name:t,price:parseFloat(n),time:r}];try{await b({services:i}),e.services=i,H(`Service added!`,`success`),closeServiceModal(),document.getElementById(`profile-services-list`)&&(document.getElementById(`profile-services-list`).innerHTML=_(e.services),lucide.createIcons()),v()}catch(e){console.error(`Add service error:`,e),H(`Failed to save service: `+e.message,`error`)}},window.deleteService=async t=>{if(!confirm(`Are you sure you want to remove this service?`))return;Array.isArray(e.services)||(e.services=[]);let n=[...e.services];n.splice(t,1);try{await b({services:n}),e.services=n,H(`Service removed`,`info`),document.getElementById(`profile-services-list`)&&(document.getElementById(`profile-services-list`).innerHTML=_(e.services),lucide.createIcons()),v()}catch(e){console.error(`Delete service error:`,e),H(`Failed to delete: `+e.message,`error`)}};function y(){let t=e,n=document.getElementById(`main-content`),r=[`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`,`Sunday`],i=t.workingDays||[`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`];n.innerHTML=`
        <div class="space-y-8 pb-10 pt-4">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Left: Availability -->
            <div class="space-y-8">
               <div class="bg-white p-8 rounded-2xl border border-border card-shadow shadow-sm">
                  <h3 class="text-navy text-sm font-extrabold uppercase tracking-tight mb-6 flex items-center gap-2">
                    <i data-lucide="calendar" class="w-4 h-4 text-gold"></i>
                    Working Days
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    ${r.map(e=>`
                      <button onclick="toggleWorkingDay('${e}')" id="day-${e}" class="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${i.includes(e)?`bg-gold text-white border-gold`:`bg-bg text-gray border-border`} border shadow-sm">
                        ${e.slice(0,3)}
                      </button>
                    `).join(``)}
                  </div>
                  
                  <h3 class="text-navy text-sm font-extrabold uppercase tracking-tight mb-6 mt-10 flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-gold"></i>
                    Shift Hours
                  </h3>
                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-1.5">
                      <label class="text-gray text-[10px] font-bold uppercase tracking-widest ml-1 italic">Opening Time</label>
                      <select id="start-time" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none appearance-none">
                        ${[`7:00 AM`,`8:00 AM`,`9:00 AM`,`10:00 AM`,`11:00 AM`,`12:00 PM`].map(e=>`<option ${t.startTime===e?`selected`:``}>${e}</option>`).join(``)}
                      </select>
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-gray text-[10px] font-bold uppercase tracking-widest ml-1 italic">Closing Time</label>
                      <select id="end-time" class="w-full bg-bg border border-border px-4 py-3 rounded-xl text-sm font-bold text-navy focus:border-gold outline-none appearance-none">
                        ${[`4:00 PM`,`5:00 PM`,`6:00 PM`,`7:00 PM`,`8:00 PM`,`9:00 PM`].map(e=>`<option ${t.endTime===e?`selected`:``}>${e}</option>`).join(``)}
                      </select>
                    </div>
                  </div>
               </div>
            </div>

            <!-- Right: Services & Preferences -->
            <div class="space-y-8">
               <div class="bg-white p-8 rounded-2xl border border-border card-shadow shadow-sm">
                   <h3 class="text-navy text-sm font-black italic uppercase tracking-tight mb-6 flex items-center gap-2">
                     <i data-lucide="scissors" class="w-4 h-4 text-gold"></i>
                     Services Offered
                   </h3>
                   <div id="settings-services-list" class="space-y-3 mb-6">
                      <!-- Rendered by renderSettingsServices -->
                   </div>
                   
                   <button onclick="openServiceModal()" class="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-gray hover:border-gold hover:text-gold transition-all group">
                      <i data-lucide="plus-circle" class="w-5 h-5 group-hover:scale-110 transition-transform"></i>
                      <span class="text-[10px] font-black uppercase tracking-widest">Add New Service</span>
                   </button>

                  <h3 class="text-navy text-sm font-black italic uppercase tracking-tight mb-6 mt-10 flex items-center gap-2">
                    <i data-lucide="home" class="w-4 h-4 text-gold"></i>
                    Client Preferences
                  </h3>
                  <label class="flex items-center justify-between p-4 bg-navy rounded-2xl border border-navy shadow-lg shadow-navy/20 cursor-pointer group transition-all">
                    <div>
                       <p class="text-gold text-[10px] font-black italic uppercase italic">Home Service Available?</p>
                       <p class="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-0.5">Allow customers to book at their location</p>
                    </div>
                    <div class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="home-visit-toggle" ${t.homeVisit?`checked`:``} class="sr-only peer">
                      <div class="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                    </div>
                  </label>
               </div>
               
               <button onclick="saveSettings()" class="w-full bg-gold text-white p-4 rounded-2xl font-black italic text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gold/20 flex items-center justify-center gap-2">
                  <i data-lucide="save" class="w-5 h-5"></i>
                  SAVE SHOP SETTINGS
               </button>
               <button onclick="optimizeExistingPhotos()" class="mt-4 w-full px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all shadow-sm">⚠️ Optimize Profile Storage (Clears Space)</button>
               <button onclick="permanentlyDeleteAccount()" class="mt-4 w-full px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-500/10 border-dashed">🚫 PERMANENTLY DELETE ACCOUNT</button>
            </div>
          </div>
        </div>
      `,lucide.createIcons(),v()}window.toggleWorkingDay=t=>{e.workingDays||=[`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`];let n=e.workingDays.indexOf(t);n>-1?e.workingDays.splice(n,1):e.workingDays.push(t),y()};async function b(e){if(!n.currentUser)throw Error(`User not logged in`);let t=await n.currentUser.getIdToken(!0),r=window.TRIMZY_CONFIG?.API_URL||`https://trimzy-backend.onrender.com/api`,i=await fetch(`${r}/barbers/profile`,{method:`PUT`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${t}`},body:JSON.stringify(e)});if(!i.ok){let e=await i.json();throw Error(e.error||`Failed to update profile on backend`)}return(await i.json()).barber}window.saveSettings=async()=>{let t=document.getElementById(`home-visit-toggle`)?.checked,n=document.getElementById(`start-time`)?.value,r=document.getElementById(`end-time`)?.value;try{await b({homeVisit:t,startTime:n,endTime:r}),e.homeVisit=t,e.startTime=n,e.endTime=r,H(`Settings Saved! Live profile updated.`,`success`)}catch(e){console.error(`Save settings error:`,e),H(`Error saving settings: `+e.message,`error`)}},window.saveProfileChanges=async()=>{let t=document.getElementById(`save-profile-btn`);if(!n.currentUser){H(`Session expired. Please re-login.`,`error`);return}t&&(t.disabled=!0,t.innerHTML=`<i data-lucide="refresh-cw" class="w-5 h-5 animate-spin"></i> SAVING...`);try{let t=e;await b({about:t.about||``,profilePic:t.profilePic||``,salonPhotos:t.salonPhotos||[],services:t.services||[],shopName:t.shopName||``,upiId:t.upiId||``,address:t.address||void 0,latitude:t.location?.coordinates?.[1]||void 0,longitude:t.location?.coordinates?.[0]||void 0}),H(`Profile Saved Successfully!`,`success`)}catch(e){console.error(e),H(`Failed to save: `+e.message,`error`)}finally{t&&(t.disabled=!1,t.innerHTML=`<i data-lucide="save" class="w-5 h-5"></i> SAVE ALL CHANGES`,lucide.createIcons())}};function x(){let t=typeof T==`function`?T():[],n=3-t.length,r=Math.round(n/3*100),i=t.length>0?`
        <div class="bg-navy rounded-2xl p-6 mb-6 relative overflow-hidden shadow-xl border border-white/10 group cursor-pointer" onclick="setScreen('profile')">
          <div class="absolute -right-12 -top-12 w-40 h-40 bg-gold/20 rounded-full blur-3xl group-hover:bg-gold/30 transition-all"></div>
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-white text-lg font-black tracking-tight flex items-center gap-2">
                  <i data-lucide="alert-circle" class="w-5 h-5 text-gold"></i>
                  Complete your profile
                </h3>
                <p class="text-white/60 text-xs font-medium mt-1">You must complete these to start accepting bookings</p>
              </div>
              <div class="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-gold text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                ${r}% Done
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full h-2 bg-black/40 rounded-full overflow-hidden mb-4">
              <div class="h-full bg-gold rounded-full transition-all duration-1000 ease-out" style="width: ${r}%"></div>
            </div>
            
            <div class="flex items-center gap-2 text-white/80 text-xs font-medium mb-4">
              <span class="text-gold font-bold">Missing:</span> ${t.join(`, `)}
            </div>
            
            <button class="bg-gold text-navy px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-gold/20 flex items-center gap-2">
              Setup Shop Now
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `:``,a=document.getElementById(`main-content`);a.innerHTML=`
        ${i}
        <!-- KPI Row -->
        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div class="bg-white p-6 rounded-2xl card-shadow border border-border">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                <i data-lucide="indian-rupee" class="w-6 h-6"></i>
              </div>
              <span class="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase">+18%</span>
            </div>
            <p id="stat-earnings-new" class="text-navy text-2xl font-black">₹0</p>
            <p class="text-gray text-[10px] font-bold uppercase tracking-widest mt-1">Today's Earnings</p>
          </div>

          <div class="bg-white p-6 rounded-2xl card-shadow border border-border">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <i data-lucide="calendar" class="w-6 h-6"></i>
              </div>
            </div>
            <p id="stat-today-bookings-new" class="text-navy text-2xl font-black">0/0</p>
            <p class="text-gray text-[10px] font-bold uppercase tracking-widest mt-1">Appointments Today</p>
          </div>

          <!-- New Rating KPI Card (V8.0) -->
          <div class="bg-white p-6 rounded-2xl card-shadow border border-border">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                <i data-lucide="star" class="w-6 h-6"></i>
              </div>
            </div>
            <p id="stat-avg-rating-new" class="text-navy text-2xl font-black">4.9</p>
            <div class="flex items-center justify-between mt-1">
               <p class="text-gray text-[10px] font-bold uppercase tracking-widest">Avg. Rating</p>
               <div class="flex gap-0.5 text-gold">
                 <i data-lucide="star" class="w-2.5 h-2.5 fill-current"></i>
                 <i data-lucide="star" class="w-2.5 h-2.5 fill-current"></i>
                 <i data-lucide="star" class="w-2.5 h-2.5 fill-current"></i>
                 <i data-lucide="star" class="w-2.5 h-2.5 fill-current"></i>
                 <i data-lucide="star" class="w-2.5 h-2.5 fill-current"></i>
               </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl card-shadow border border-border">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                <i data-lucide="trending-up" class="w-6 h-6"></i>
              </div>
              <span class="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full uppercase">+22%</span>
            </div>
            <p id="stat-week-earnings-new" class="text-navy text-2xl font-black">₹0</p>
            <p class="text-gray text-[10px] font-bold uppercase tracking-widest mt-1">This Week</p>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div class="xl:col-span-2 bg-white p-6 rounded-2xl card-shadow border border-border">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h3 class="text-navy text-sm font-extrabold uppercase tracking-tight">Revenue Analysis</h3>
                <p class="text-gray text-[10px] font-bold uppercase tracking-widest">Earnings by appointment slot</p>
              </div>
              <div class="flex items-center gap-2 px-3 py-1 bg-bg rounded-lg border border-border">
                 <div class="w-2 h-2 rounded-full bg-gold"></div>
                 <span class="text-[10px] font-bold text-navy uppercase">Direct</span>
              </div>
            </div>
            <div class="h-64">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>

          <!-- Rating Breakdown (Dynamic V2.0) -->
          <div class="bg-white p-6 rounded-2xl card-shadow border border-border">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-navy text-sm font-extrabold uppercase tracking-tight">Rating Breakdown</h3>
              <div class="w-8 h-8 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><i data-lucide="award" class="w-4 h-4"></i></div>
            </div>
            <div class="space-y-4">
              ${[5,4,3].map(e=>{let t=s.distribution[e]||0,n=s.total>0?Math.round(t/s.total*100):0;return`
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span class="text-navy">${e} Stars</span>
                    <span class="text-gray">${n}%</span>
                  </div>
                  <div class="h-1.5 bg-bg rounded-full overflow-hidden">
                    <div class="h-full bg-gold rounded-full transition-all duration-1000" style="width: ${n}%"></div>
                  </div>
                </div>
              `}).join(``)}
            </div>
            <div class="mt-8 pt-8 border-t border-border flex items-center justify-between">
               <div>
                 <p class="text-[10px] font-bold uppercase tracking-widest text-gray mb-1">Total Reviews</p>
                 <p class="text-xl font-black text-navy">${s.total} <span class="text-xs text-gray lowercase ml-1">ratings</span></p>
               </div>
               <button onclick="setScreen('reviews')" class="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-white transition-all">
                 <i data-lucide="chevron-right" class="w-5 h-5"></i>
               </button>
            </div>
          </div>
        </div>

        <!-- Featured / Active Session & Today's Schedule -->
        <div class="space-y-6">
           <div id="dash-active-session"></div>

           <div class="flex items-center justify-between">
              <h3 class="text-navy text-sm font-extrabold uppercase tracking-tight">Today's Schedule</h3>
              <button onclick="setScreen('appointments')" class="text-gold text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                View All <i data-lucide="chevron-right" class="w-3 h-3"></i>
              </button>
           </div>
           <div id="dash-schedule-list" class="bg-white rounded-2xl border border-border divide-y divide-border overflow-hidden card-shadow">
              <div class="p-8 text-center text-gray">
                 <div class="w-12 h-12 bg-bg rounded-full flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="clock" class="w-6 h-6"></i>
                 </div>
                 <p class="text-[10px] font-bold uppercase tracking-widest">Loading schedule...</p>
              </div>
           </div>
        </div>
      `,lucide.createIcons(),j(),I(),O(e.isOpen),console.log(`[PERSISTENCE] UI Initialized with status:`,e.isOpen)}function S(){let t=e;O(e.isOpen);let n=document.getElementById(`barber-name-side`);n&&(n.textContent=t.shopName||t.name),document.getElementById(`side-pwa-name`).textContent=t.name||t.shopName||`Barber`,document.getElementById(`side-pwa-shop`).textContent=t.shopName||`No Shop Name`,document.getElementById(`side-pwa-rating`).textContent=t.rating||`4.9`;let r=document.getElementById(`stat-avg-rating-new`);r&&(r.textContent=t.rating||`4.9`);let i=document.getElementById(`side-pwa-avatar`);t.profilePic?i.innerHTML=`<img src="${t.profilePic}" class="w-full h-full object-cover">`:i.textContent=(t.shopName||t.name||`?`).charAt(0).toUpperCase(),O(t.isOpen);let a=(t.shopName||t.name||`?`).split(` `).map(e=>e[0]).join(``).toUpperCase().slice(0,2),o=document.getElementById(`barber-avatar-side`);o&&(t.profilePic?o.innerHTML=`<img src="${t.profilePic}" class="w-full h-full object-cover rounded-full">`:o.textContent=a);let s=document.getElementById(`topbar-date`);s&&(s.textContent=new Date().toLocaleDateString([],{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`})),T().length>0?initWizard():setScreen(`dashboard`),P()}var C=document.getElementById(`status-toggle-new`),w=document.getElementById(`status-toggle-mobile`);document.getElementById(`sidebar-status-checkbox`);function T(){let t=[];return e.shopName||t.push(`Shop Name`),(!e.services||e.services.length===0)&&t.push(`Services`),e.upiId||t.push(`UPI ID`),t}window.toggleShopStatus=async(t=null)=>{let r=n.currentUser?n.currentUser.uid:e?e.id:null;if(!r){console.error(`[PERSISTENCE] Cannot save: No UID found in Auth.`),H(`Session expired. Please re-login.`,`error`);return}let i=t===null?!e.isOpen:t;if(i===!0){let e=T();if(e.length>0){H(`Complete profile to go live: ${e.join(`, `)}`,`error`);let t=document.getElementById(`sidebar-status-checkbox`);t&&(t.checked=!1),setScreen(`profile`);return}}console.log(`[PERSISTENCE] Saving with UID LOCKDOWN: ${i?`OPEN`:`CLOSED`} to path: barbers/${r}`);try{await b({isOpen:i}),e.isOpen=i,e.id||=r,O(i),H(`Shop is now ${i?`OPEN`:`CLOSED`}`,`success`),console.log(`[PERSISTENCE] Save Successful to UID:`,r)}catch(e){console.error(`[PERSISTENCE] Save Failed:`,e),H(`Status sync failed.`,`error`);let t=document.getElementById(`sidebar-status-checkbox`);t&&(t.checked=!i)}},C&&C.addEventListener(`click`,()=>window.toggleShopStatus()),w&&w.addEventListener(`click`,()=>window.toggleShopStatus());function E(){let e=document.getElementById(`main-content`);e.innerHTML=`
        <div class="space-y-6">
           <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-1 bg-white p-8 rounded-2xl border border-border card-shadow flex flex-col items-center justify-center text-center">
                 <div class="text-4xl font-black text-navy mb-2">${s.avg.toFixed(1)}</div>
                 <div class="flex gap-1 text-gold mb-3">
                    ${[1,2,3,4,5].map(e=>`<i data-lucide="star" class="w-5 h-5 ${e<=Math.round(s.avg)?`fill-current`:`text-gray/20`}"></i>`).join(``)}
                 </div>
                 <p class="text-gray text-xs font-bold uppercase tracking-widest">Based on ${s.total} reviews</p>
              </div>

              <div class="md:col-span-2 bg-white p-8 rounded-2xl border border-border card-shadow">
                 <h3 class="text-navy text-sm font-black uppercase tracking-tight mb-6">Customer Feedback</h3>
                 <div class="space-y-4">
                    ${o.length===0?`
                       <div class="p-8 text-center text-gray italic text-sm">No reviews found yet.</div>
                    `:o.map(e=>`
                       <div class="p-4 bg-bg rounded-2xl border border-border group hover:border-gold/30 transition-all">
                          <div class="flex items-center justify-between mb-3">
                             <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold uppercase">
                                   ${(e.customerName||`G`)[0]}
                                </div>
                                <div>
                                   <p class="text-sm font-black text-navy leading-tight">${e.customerName||`Verified Guest`}</p>
                                   <p class="text-[10px] text-gray font-bold uppercase mt-0.5">${e.createdAt?new Date(e.createdAt.seconds*1e3).toLocaleDateString():`Just now`}</p>
                                </div>
                             </div>
                             <div class="flex gap-0.5 text-gold">
                                ${Array(e.rating||5).fill(0).map(()=>`<i data-lucide="star" class="w-3 h-3 fill-current"></i>`).join(``)}
                             </div>
                          </div>
                          <p class="text-xs text-gray-700 leading-relaxed italic">"${e.comment||`Great service!`}"</p>
                       </div>
                    `).join(``)}
                 </div>
              </div>
           </div>
        </div>
      `,lucide.createIcons()}async function D(){if(!(!e||!e.id))try{let t=window.TRIMZY_CONFIG?.API_URL||`https://trimzy-backend.onrender.com/api`,n=await fetch(`${t}/reviews/barber/${e.id}`);if(!n.ok)throw Error(`Failed to fetch reviews`);let r=await n.json();o=r.reviews.map(e=>({...e,id:e._id}));let i=0,a={5:0,4:0,3:0,2:0,1:0};o.forEach(e=>{let t=e.rating||5;i+=t,a[t]=(a[t]||0)+1}),s={total:r.total||o.length,avg:o.length>0?i/o.length:5,distribution:a},window.currentScreen===`dashboard`?x():window.currentScreen===`reviews`&&E(),e.rating=s.avg.toFixed(1);let c=document.getElementById(`stat-avg-rating-new`);c&&(c.textContent=e.rating);let l=document.getElementById(`side-pwa-rating`);l&&(l.textContent=e.rating);let u=document.getElementById(`side-pwa-count`);u&&(u.textContent=`(${s.total})`)}catch(e){console.error(`fetchReviewsData error:`,e)}}function O(e){let t=document.getElementById(`status-dot-new`),n=document.getElementById(`status-text-new`),r=document.getElementById(`status-toggle-new`),i=document.getElementById(`status-card-title`),a=document.getElementById(`status-card-sub`),o=document.getElementById(`status-card-sidebar`),s=document.getElementById(`sidebar-status-checkbox`),c=document.getElementById(`sidebar-slider`),l=document.getElementById(`side-pwa-status-badge`),u=document.getElementById(`side-pwa-status-dot`),d=document.getElementById(`side-pwa-status-text`),f=document.getElementById(`status-dot-mobile`),p=document.getElementById(`status-toggle-mobile`);if(s.checked=e,e){t.className=`w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]`,n.textContent=`ONLINE`,n.className=`text-green-600 text-xs font-black uppercase tracking-wider`,r.className=`flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl transition-all`,i.textContent=`Accepting Bookings`,i.className=`text-green-600 text-xs font-black uppercase tracking-tight`,a.textContent=`Customers can find you`,o.className=`mt-8 p-4 mx-2 rounded-2xl bg-green-50 border border-green-100 shadow-sm transition-all duration-300`,c.className=`slider slider-open`,l.className=`flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl transition-all`,u.className=`w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]`,d.textContent=`Online`,d.className=`text-[9px] font-black uppercase tracking-widest text-green-600`,f&&(f.className=`w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]`);let e=document.getElementById(`status-text-mobile`);e&&(e.textContent=`ONLINE`,e.className=`text-[10px] font-black uppercase tracking-widest text-green-600`),p&&(p.className=`flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 transition-all`)}else{t.className=`w-2.5 h-2.5 rounded-full bg-gray`,n.textContent=`OFFLINE`,n.className=`text-navy text-xs font-bold uppercase tracking-wider`,r.className=`flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl transition-all`,i.textContent=`Shop is Closed`,i.className=`text-red-500 text-xs font-black uppercase tracking-tight`,a.textContent=`Bookings are disabled`,o.className=`mt-8 p-4 mx-2 rounded-2xl bg-red-50 border border-red-100 shadow-sm transition-all duration-300`,c.className=`slider slider-closed`,l.className=`flex items-center gap-1.5 px-3 py-1.5 bg-gray/5 border border-border rounded-xl transition-all`,u.className=`w-1.5 h-1.5 rounded-full bg-gray`,d.textContent=`Offline`,d.className=`text-[9px] font-black uppercase tracking-widest text-gray`,f&&(f.className=`w-2 h-2 rounded-full bg-gray`);let e=document.getElementById(`status-text-mobile`);e&&(e.textContent=`OFFLINE`,e.className=`text-[10px] font-black uppercase tracking-widest text-navy`),p&&(p.className=`flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg border border-border transition-all`)}}function k(){let t=e,n=g(t);[document.getElementById(`profile-pic-preview`),document.getElementById(`profile-pic-preview-large`),document.getElementById(`side-pwa-avatar`),document.getElementById(`barber-avatar-side`)].forEach(e=>{e&&(t&&t.profilePic?e.innerHTML=`<img src="${t.profilePic}" style="width:100%;height:100%;object-fit:cover;${e.id===`barber-avatar-side`?`border-radius:50%;`:`border-radius:inherit;`}">`:e.innerHTML=`<span class="flex items-center justify-center w-full h-full">${n}</span>`)});let r=document.getElementById(`salon-photos-grid`);if(!r)return;let i=``;for(let e=0;e<6;e++){let t=c[e];t?i+=`
                <div class="relative aspect-square rounded-2xl overflow-hidden group border border-border">
                   <img src="${t}" class="w-full h-full object-cover">
                   <button onclick="deleteSalonPhoto(${e})" class="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                   </button>
                </div>
              `:i+=`
                <div onclick="document.getElementById('salon-photo-input').click()" class="aspect-square rounded-2xl bg-navy/5 border-2 border-dashed border-border flex items-center justify-center text-navy/20 cursor-pointer hover:border-gold/30 hover:text-gold/30 transition-all group">
                   <i data-lucide="scissors" class="w-6 h-6 group-hover:scale-110 transition-transform"></i>
                </div>
              `}r.innerHTML=i,lucide.createIcons();let a=document.getElementById(`photo-count`);a&&(a.textContent=`${c.length} / 6 photos uploaded`)}window.deleteSalonPhoto=async t=>{confirm(`Delete this photo?`)&&(c.splice(t,1),await b({salonPhotos:c}),e.salonPhotos=c,k(),H(`Photo deleted`,`success`))};function A(e,t=800,n=.6){return new Promise(r=>{let i=new Image;if(i.onload=()=>{let e=document.createElement(`canvas`),a=i.width,o=i.height;a>t&&(o=Math.round(o*t/a),a=t),e.width=a,e.height=o,e.getContext(`2d`).drawImage(i,0,0,a,o),r(e.toDataURL(`image/jpeg`,n))},typeof e==`string`)i.src=e;else{let t=new FileReader;t.onload=e=>{i.src=e.target.result},t.readAsDataURL(e)}})}window.optimizeExistingPhotos=async()=>{if(confirm(`This will re-compress all your photos to save space. Your profile might be reaching the 1MB limit. Continue?`)){H(`Optimizing... please wait`,`info`);try{let t=e;if(t.profilePic&&t.profilePic.startsWith(`data:image`)&&(t.profilePic=await A(t.profilePic,800,.8)),Array.isArray(t.salonPhotos))for(let e=0;e<t.salonPhotos.length;e++)t.salonPhotos[e].startsWith(`data:image`)&&(t.salonPhotos[e]=await A(t.salonPhotos[e],800,.8));await setDoc(doc(db,`barbers`,t.id),{profilePic:t.profilePic||``,salonPhotos:t.salonPhotos||[]},{merge:!0}),H(`Profile Optimized! Space cleared.`,`success`),location.reload()}catch(e){console.error(e),H(`Optimization failed.`,`error`)}}},document.addEventListener(`change`,async t=>{let r=t.target.files?.[0];if(r){if(t.target&&t.target.id===`profile-pic-input`){let t=document.getElementById(`pic-progress`),i=document.getElementById(`pic-progress-fill`);t&&i&&(t.style.display=`block`,i.style.width=`20%`);try{console.log(`DEBUG [V5.0]: Using High-Quality Base64 for profile...`);let a=await A(r,800,.8);i&&(i.style.width=`80%`);let o=n.currentUser?n.currentUser.uid:e.id;console.log(`[PERSISTENCE] Uploading Photo to ID: ${o}`),await b({profilePic:a}),e.profilePic=a,i&&(i.style.width=`100%`),t&&setTimeout(()=>t.style.display=`none`,500),H(`Profile photo updated!`,`success`),k(),x()}catch(e){t&&(t.style.display=`none`),console.error(`V4.0 Profile Error:`,e),H(`Failed to save photo.`,`error`)}}else if(t.target&&t.target.id===`salon-photo-input`){if(c.length>=6){H(`Max 6 photos allowed`,`error`);return}let t=document.getElementById(`salon-progress`),i=document.getElementById(`salon-progress-fill`);t&&i&&(t.style.display=`block`,i.style.width=`20%`);try{console.log(`DEBUG [V5.0]: Using High-Quality Base64 for gallery...`);let a=await A(r,800,.8);i&&(i.style.width=`80%`);let o=n.currentUser?n.currentUser.uid:e.id,s=[...c,a];console.log(`[PERSISTENCE] Uploading Salon Photo to ID: ${o}`),await b({salonPhotos:s}),c=s,e.salonPhotos=s,i&&(i.style.width=`100%`),t&&setTimeout(()=>t.style.display=`none`,500),H(`Salon photo added!`,`success`),k()}catch(e){t&&(t.style.display=`none`),console.error(`V4.0 Gallery Error:`,e),H(`Failed to save gallery photo.`,`error`)}}}});function j(){let e=document.getElementById(`revenueChart`);e&&(l&&l.destroy(),l=new Chart(e,{type:`bar`,data:{labels:[`9AM`,`11AM`,`1PM`,`3PM`,`5PM`,`7PM`,`9PM`],datasets:[{label:`Revenue (₹)`,data:[0,0,0,0,0,0,0],backgroundColor:`#E8A44A`,borderRadius:8,barThickness:24}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:`#0B0B18`,titleFont:{family:`Inter`,weight:`bold`},bodyFont:{family:`Inter`},padding:12,displayColors:!1}},scales:{y:{display:!1,beginAtZero:!0},x:{grid:{display:!1},ticks:{font:{family:`Inter`,weight:`bold`,size:10},color:`#9CA3AF`}}}}}))}var M=null;async function N(){if(n.currentUser)try{let e=await n.currentUser.getIdToken(!0),t=window.TRIMZY_CONFIG?.API_URL||`https://trimzy-backend.onrender.com/api`,r=await fetch(`${t}/bookings`,{headers:{Authorization:`Bearer ${e}`}});if(!r.ok)throw Error(`Failed to fetch bookings`);a=(await r.json()).bookings.map(e=>({id:e._id,...e})),a.sort((e,t)=>{if(e.status===`in_progress`&&t.status!==`in_progress`)return-1;if(e.status!==`in_progress`&&t.status===`in_progress`)return 1;let n=e.createdAt?new Date(e.createdAt).getTime():0,r=t.createdAt?new Date(t.createdAt).getTime():0;if(r!==n)return r-n;let i=F(e.scheduledAt);return F(t.scheduledAt)-i}),z(),I()}catch(e){console.error(`Dashboard bookings fetch error:`,e)}}function P(){N(),M&&clearInterval(M),M=setInterval(N,1e4)}function F(e){if(!e)return new Date;let t=new Date(e);return isNaN(t.getTime())?new Date(e.replace(` `,`T`)+`Z`):t}function I(){let t=new Date,n=0,r=0,i=0,o=0,s=0,c=[0,0,0,0,0,0,0],d=new Date(t);d.setDate(t.getDate()-t.getDay());let f=new Date(t.getFullYear(),t.getMonth(),1);a.forEach(e=>{let a=F(e.scheduledAt);e.status===`completed`&&e.completedAt&&(a=e.completedAt.seconds?new Date(e.completedAt.seconds*1e3):new Date);let l=Number(e.price)||0,u=a.toDateString()===t.toDateString(),p=a>=d,m=a>=f;if(e.status===`completed`&&(s+=l,u&&(r+=l),p&&(i+=l),m&&(o+=l),u)){let e=a.getHours();e>=9&&e<11?c[0]+=l:e>=11&&e<13?c[1]+=l:e>=13&&e<15?c[2]+=l:e>=15&&e<17?c[3]+=l:e>=17&&e<19?c[4]+=l:e>=19&&e<21?c[5]+=l:e>=21&&(c[6]+=l)}u&&e.status!==`cancelled`&&n++});let p={"stat-earnings-new":`₹`+r,"stat-today-bookings-new":n+` bookings`,"stat-rating-new":e?.rating||`4.9`,"stat-week-earnings-new":`₹`+i,"rating-big":e?.rating||`4.9`};for(let[e,t]of Object.entries(p)){let n=document.getElementById(e);n&&(n.textContent=t)}let h={"earn-today-new":`₹`+r,"earn-week-new":`₹`+i,"earn-month-new":`₹`+o,"earn-total-new":`₹`+s};for(let[e,t]of Object.entries(h)){let n=document.getElementById(e);n&&(n.textContent=t)}l&&(l.data.datasets[0].data=c,l.update());let g=document.getElementById(`earn-today-display`),_=document.getElementById(`earn-today-count`),v=document.getElementById(`earn-week-display`),y=document.getElementById(`earn-month-display`),b=document.getElementById(`earn-pending-display`),x=document.getElementById(`payout-balance`);g&&(g.textContent=`₹`+r),_&&(_.textContent=`From ${n} appointments`),v&&(v.textContent=`₹`+i),y&&(y.textContent=`₹`+o),b&&(b.textContent=`₹`+Math.floor(r*.8)),x&&(x.textContent=`₹`+s),l&&(l.data.datasets[0].data=c,l.update()),u&&(u.data.datasets[0].data=c,u.update()),R(),m()}function L(){let e=document.getElementById(`earnings-chart-new`);e&&(u&&u.destroy(),e.getContext(`2d`),u=new Chart(e,{type:`bar`,data:{labels:[`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`,`Sun`],datasets:[{label:`Revenue`,data:[0,0,0,0,0,0,0],backgroundColor:e=>{let{ctx:t,chartArea:n}=e.chart;if(!n)return null;let r=new Date().getDay();return e.dataIndex===(r===0?6:r-1)?`#E8A44A`:`#3B82F6`},borderRadius:12,barThickness:window.innerWidth<768?12:32}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:`#0B0B18`,padding:12,bodyFont:{weight:`bold`}}},scales:{y:{display:!1,beginAtZero:!0},x:{grid:{display:!1},ticks:{font:{weight:`bold`,size:10},color:`#9CA3AF`}}}}}))}function R(){let e=document.getElementById(`dash-active-session`),t=document.getElementById(`dash-schedule-list`);if(!t||!e)return;let n=new Date,r=n.toDateString(),i=a.filter(e=>{let t=F(e.scheduledAt),i=t.toDateString()===r,a=t>n&&(e.status===`upcoming`||e.status===`pending`);return(i||a)&&e.status!==`cancelled`&&e.status!==`completed`});i.sort((e,t)=>e.status===`in_progress`&&t.status!==`in_progress`?-1:e.status!==`in_progress`&&t.status===`in_progress`?1:F(e.scheduledAt)-F(t.scheduledAt));let o=i.find(e=>e.status===`in_progress`),s=i.filter(e=>e.status!==`in_progress`);if(o){let t=(o.customerName||`C`).charAt(0)+(o.customerName?.split(` `)[1]?.charAt(0)||``),n=F(o.scheduledAt).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`});e.innerHTML=`
          <div class="bg-navy rounded-[32px] p-8 shadow-2xl relative overflow-hidden group mb-6">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -translate-y-16 translate-x-16"></div>
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div class="flex items-center gap-6">
                <div class="w-16 h-16 rounded-full bg-navy2 border border-white/10 flex items-center justify-center text-white font-black text-2xl shadow-inner relative">
                  ${t}
                  <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-gold rounded-full border-4 border-navy"></div>
                </div>
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <span class="px-2.5 py-1 bg-gold/10 text-gold border border-gold/20 rounded-lg text-[9px] font-black uppercase tracking-widest animate-pulse">In Progress</span>
                    <h3 class="text-white text-xl font-black tracking-tight leading-tight">${o.customerName||`Customer`}</h3>
                  </div>
                  <p class="text-white/60 text-[11px] font-bold uppercase tracking-widest">
                    ${o.serviceName||`Premium Service`} • 30 min • ${n}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-8">
                <div class="text-right">
                  <p class="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1 font-jakarta">Service Value</p>
                  <p class="text-gold text-3xl font-black italic tracking-tighter">₹${o.price||`0`}</p>
                </div>
                <button onclick="handleFinishSession('${o.id}')" class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-xl shadow-green-500/30 active:scale-95">
                  <i data-lucide="check-circle" class="w-4 h-4"></i>
                  Mark Complete & Trigger Payment
                </button>
              </div>
            </div>
          </div>
        `}else e.innerHTML=``;if(!s.length&&!o){t.innerHTML=`
          <div class="p-16 text-center text-gray/40">
            <i data-lucide="calendar" class="w-12 h-12 mx-auto mb-4 opacity-20"></i>
            <p class="text-[10px] font-bold uppercase tracking-widest">No scheduled bookings for today</p>
          </div>
        `;return}t.innerHTML=s.map(e=>{let t=(e.customerName||`C`).charAt(0)+(e.customerName?.split(` `)[1]?.charAt(0)||``),n=F(e.scheduledAt).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),r=``;return r=e.status===`completed`?`<span class="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[9px] font-black uppercase tracking-widest"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div> Completed</span>`:e.status===`upcoming`||e.status===`scheduled`?`<span class="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-500 border border-blue-100 rounded-full text-[9px] font-black uppercase tracking-widest">Upcoming</span>`:e.status===`pending`?`<span class="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded-full text-[9px] font-black uppercase tracking-widest">Pending</span>`:`<span class="px-3 py-1 bg-gray/5 text-gray rounded-full text-[9px] font-black uppercase tracking-widest">${e.status}</span>`,`
          <div class="p-6 flex items-center justify-between hover:bg-bg/50 transition-all group cursor-pointer border-b border-border/50 last:border-0" onclick="setScreen('appointments')">
            <div class="flex items-center gap-5">
              <div class="w-12 h-12 rounded-full bg-white border border-border group-hover:border-gold/30 flex items-center justify-center text-navy font-black text-xs uppercase transition-all shadow-sm">
                ${t}
              </div>
              <div>
                <p class="text-navy text-sm font-black text-jakarta leading-tight group-hover:text-gold transition-colors">${e.customerName||`Customer`}</p>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-gray text-[10px] font-bold uppercase tracking-widest">
                    ${e.serviceName||`Service`} • 30 min
                  </p>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-10">
              <div class="flex items-center gap-12">
                <p class="text-navy text-xs font-black uppercase tracking-tight w-24 text-right"><i data-lucide="clock" class="w-3.5 h-3.5 inline mr-1.5 text-gray/50"></i>${n}</p>
                <div class="w-28 flex justify-end">
                  ${r}
                </div>
              </div>
              <div class="w-20 text-right">
                <p class="text-gold text-lg font-black italic tracking-tighter">₹${e.price||`0`}</p>
              </div>
            </div>
          </div>
        `}).join(``),lucide.createIcons()}function z(){let e=document.getElementById(`bookings-list`);if(!e)return;let t=e.dataset.filter||`all`,n=a,r=a.filter(e=>e.status===`upcoming`).length,i=document.getElementById(`bookings-count-meta`),o=document.getElementById(`pending-tab-badge`);i&&(i.textContent=`${a.length} total`),o&&(r>0?(o.textContent=r,o.classList.remove(`hidden`)):o.classList.add(`hidden`));let s=new Date;if(new Date(s.getFullYear(),s.getMonth(),s.getDate()),t===`pending`?n=a.filter(e=>e.status===`upcoming`):t===`upcoming`?n=a.filter(e=>e.status===`in_progress`):t===`completed`?n=a.filter(e=>e.status===`completed`):t===`all`&&(n=a),!n.length){e.innerHTML=`
          <div class="py-20 text-center flex flex-col items-center gap-4 bg-white rounded-2xl border border-border">
            <div class="w-16 h-16 bg-bg rounded-full flex items-center justify-center text-gray/30">
              <i data-lucide="calendar-x" class="w-8 h-8"></i>
            </div>
            <div>
              <p class="text-navy font-bold uppercase tracking-tight">No ${t} bookings</p>
              <p class="text-gray text-[10px] uppercase font-bold tracking-widest mt-1">Check back later for new requests</p>
            </div>
          </div>
        `,lucide.createIcons();return}e.innerHTML=n.map(e=>{let t=F(e.scheduledAt),n=t.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`}),r=t.toLocaleDateString([],{month:`short`,day:`numeric`}),i=``,a=``;return e.status===`upcoming`?(i=`<span class="px-3 py-1 bg-blue-50 text-blue-500 border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-widest">Pending</span>`,a=`
            <div class="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-3">
              <button onclick="handleStartAppointment('${e.id}')" class="bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-navy2 transition-all flex items-center gap-2">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-gold fill-current"></i>
                Start Session
              </button>
              <button onclick="window.location.href='tel:${e.customerPhone||``}'" class="px-4 py-2.5 bg-bg border border-border rounded-xl text-gray hover:text-gold transition-colors flex items-center gap-2 text-xs font-bold">
                 <i data-lucide="phone" class="w-4 h-4"></i>
                 Call Customer
              </button>
            </div>
          `):e.status===`in_progress`?(i=`<span class="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">Active Now</span>`,a=`
            <div class="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-3">
              <button onclick="handleFinishSession('${e.id}')" class="bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-green-600 transition-all flex items-center gap-2">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                Finish Session
              </button>
            </div>
          `):(i=`<span class="px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-lg text-[10px] font-black uppercase tracking-widest">Completed</span>`,a=`
            <div class="mt-4 pt-4 border-t border-border flex items-center gap-2 text-green-600">
               <i data-lucide="check-circle-2" class="w-4 h-4"></i>
               <p class="text-[10px] font-black uppercase tracking-widest">Service completed • Payment of ₹${e.price} received</p>
            </div>
          `),`
          <div class="bg-white border border-border rounded-2xl p-6 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 transition-all group relative overflow-hidden">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 rounded-full bg-bg border border-border flex items-center justify-center text-gold font-black text-xl shadow-sm">
                   ${(e.customerName||`C`).charAt(0)}
                </div>
                <div>
                   <h3 class="text-navy text-lg font-black tracking-tight leading-tight">${e.customerName||`Customer`}</h3>
                   <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <div class="flex items-center gap-1.5 overflow-hidden">
                         <i data-lucide="scissors" class="w-3.5 h-3.5 text-gray"></i>
                         <span class="text-gray text-[10px] font-bold uppercase tracking-widest truncate">${e.serviceName||`Premium Service`}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                         <i data-lucide="clock" class="w-3.5 h-3.5 text-gray"></i>
                         <span class="text-navy text-[10px] font-black uppercase tracking-widest">${n} • ${r}</span>
                      </div>
                   </div>
                </div>
              </div>
              
              <div class="flex flex-col md:items-end gap-2 text-right">
                 <div class="flex items-center gap-3">
                    ${i}
                    <span class="${e.status===`completed`?`text-green-500`:`text-navy`} text-2xl font-black">₹${e.price||`0`}</span>
                 </div>
                 <p class="text-gray text-[9px] font-bold uppercase tracking-widest">Booking ID: #${e.id.slice(0,6).toUpperCase()}</p>
              </div>
            </div>
            
            ${a}
          </div>
        `}).join(``),lucide.createIcons()}var B=null;window.handleStartAppointment=e=>{if(B=e,!a.find(t=>t.id===e))return;let t=document.getElementById(`pin-modal`);t&&(t.classList.remove(`hidden`),t.classList.add(`flex`),document.getElementById(`pin-input`).value=``,document.getElementById(`pin-input`).focus(),document.getElementById(`pin-error`).textContent=``)},window.closePinModal=()=>{let e=document.getElementById(`pin-modal`);e&&(e.classList.add(`hidden`),e.classList.remove(`flex`)),B=null},window.verifyPin=async()=>{if(!B)return;a.find(e=>e.id===B);let e=document.getElementById(`pin-input`).value,t=document.getElementById(`pin-error`);try{let r=await n.currentUser.getIdToken(!0),i=window.TRIMZY_CONFIG?.API_URL||`https://trimzy-backend.onrender.com/api`,a=await fetch(`${i}/bookings/${B}/verify-pin`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${r}`},body:JSON.stringify({pin:e})});a.ok?(H(`PIN Verified! Session started.`,`success`),closePinModal(),N()):(t.textContent=(await a.json()).error||`Invalid PIN. Please check with customer.`,document.getElementById(`pin-input`).value=``,document.getElementById(`pin-input`).focus())}catch{t.textContent=`Error updating status. Try again.`}},window.handleFinishSession=async e=>{let t=a.find(t=>t.id===e);if(t&&confirm(`Finish session for ${t.customerName}?`))try{let t=await n.currentUser.getIdToken(!0),r=window.TRIMZY_CONFIG?.API_URL||`https://trimzy-backend.onrender.com/api`,i=await fetch(`${r}/bookings/${e}/status`,{method:`PUT`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${t}`},body:JSON.stringify({status:`completed`})});i.ok?(H(`Service completed! Payment confirmed.`,`success`),N()):H((await i.json()).error||`Error finishing session.`,`error`)}catch{H(`Error finishing session.`,`error`)}};async function V(){let t=document.getElementById(`pf-street`)?.value.trim()||``,n=document.getElementById(`pf-city`)?.value.trim()||``,r=document.getElementById(`pf-state`)?.value.trim()||``,i=document.getElementById(`pf-pincode`)?.value.trim()||``,a={name:document.getElementById(`pf-name`).value,shopName:document.getElementById(`pf-shopname`).value,phone:document.getElementById(`pf-phone`).value,about:document.getElementById(`pf-about`).value,upiId:document.getElementById(`pf-upi`).value};if(t&&n&&r&&i)try{let e=await K(n,r,i);a.address={street:t,city:n,state:r,pincode:i},a.latitude=e.latitude,a.longitude=e.longitude}catch{H(`Could not find exact location. Please verify your address.`,`error`);return}console.log(`Saving full profile for ID:`,e.id);try{await b(a),H(`Profile saved!`,`success`)}catch(e){H(`Failed to save profile: `+e.message,`error`)}}function H(e,t){let n=document.getElementById(`toast`);n.textContent=e,n.className=`toast show ${t}`,setTimeout(()=>n.className=`toast`,3e3)}window.permanentlyDeleteAccount=async()=>{if(confirm(`⚠️ WARNING: This will PERMANENTLY DELETE your Trimzy Partner account. All your profile data, photos, and settings will be removed from our database. This CANNOT be undone.

Are you absolutely sure?`)&&confirm(`FINAL CHECK: Are you really sure? You will lose access to this dashboard immediately.`)){H(`Deleting account... please wait.`,`info`);try{let e=n.currentUser;if(!e)throw Error(`No authenticated user found.`);e.uid;let t=await e.getIdToken(!0),r=window.TRIMZY_CONFIG?.API_URL||`https://trimzy-backend.onrender.com/api`,i=await fetch(`${r}/barbers/profile`,{method:`DELETE`,headers:{Authorization:`Bearer ${t}`}});if(!i.ok){let e=await i.json();throw Error(e.error||`Failed to delete account on server`)}await n.signOut(),H(`Account deleted successfully.`,`success`),sessionStorage.clear(),localStorage.clear(),setTimeout(()=>{location.href=`index.html`},2e3)}catch(e){console.error(`Account deletion failed:`,e),H(`Error: `+e.message,`error`)}}};var U=0,W=3;window.initWizard=()=>{document.getElementById(`onboarding-wizard`).style.display=`flex`,e.shopName&&(document.getElementById(`wiz-shopname`).value=e.shopName),e.bio&&(document.getElementById(`wiz-bio`).value=e.bio),e.shopAddress&&(document.getElementById(`wiz-address`).value=e.shopAddress),e.upiId&&(document.getElementById(`wiz-upi`).value=e.upiId),e.workingHours&&(document.getElementById(`wiz-time-open`).value=e.workingHours.open||`09:00`,document.getElementById(`wiz-time-close`).value=e.workingHours.close||`21:00`),e.services&&e.services.length>0&&(document.getElementById(`wiz-service-name`).value=e.services[0].name,document.getElementById(`wiz-service-price`).value=e.services[0].price),e.profilePic&&(document.getElementById(`wiz-avatar-preview`).innerHTML=`<img src="${e.profilePic}" class="w-full h-full object-cover">`),showWizardStep(0),updateWizardProgress()},window.showWizardStep=e=>{document.querySelectorAll(`.wizard-step`).forEach(e=>e.classList.remove(`active`)),document.getElementById(`wizard-step-${e}`).classList.add(`active`);let t=document.getElementById(`wizard-top-bar`);t&&(t.style.display=e===0?`none`:`flex`),U=e,updateWizardProgress()},window.nextWizardStep=()=>{if(U===1){if(!document.getElementById(`wiz-shopname`).value.trim()){H(`Shop Name is required`,`error`);return}}else if(U===2&&(!document.getElementById(`wiz-service-name`).value.trim()||!document.getElementById(`wiz-service-price`).value)){H(`Please add at least one service`,`error`);return}U<W&&showWizardStep(U+1)},window.prevWizardStep=()=>{U>0&&showWizardStep(U-1)},window.updateWizardProgress=()=>{let e=0;document.getElementById(`wiz-shopname`).value.trim()&&e++,document.getElementById(`wiz-service-name`).value.trim()&&e++,document.getElementById(`wiz-service-price`).value&&e++,document.getElementById(`wiz-time-open`).value&&e++,document.getElementById(`wiz-address`).value.trim()&&e++,document.getElementById(`wiz-upi`).value.trim()&&e++;let t=Math.max(10,Math.round(e/6*100));U===1&&(t=Math.max(t,25)),U===2&&(t=Math.max(t,50)),U===3&&(t=Math.max(t,75)),t>95&&(t=95),document.getElementById(`wizard-percent`).textContent=t,document.getElementById(`wizard-progress-bar`).style.width=t+`%`};var G=null;window.handleWizAvatarUpload=e=>{let t=e.target.files[0];if(!t)return;let n=new FileReader;n.onload=async e=>{let t=e.target.result;if(typeof A==`function`)try{t=await A(t,800,.8)}catch{}G=t,document.getElementById(`wiz-avatar-preview`).innerHTML=`<img src="${G}" class="w-full h-full object-cover">`},n.readAsDataURL(t)};async function K(e,t,n){let r=`${e}, ${t} ${n}, India`,i=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(r)}&limit=1`,a=await(await fetch(i)).json();if(a&&a.length>0)return{latitude:parseFloat(a[0].lat),longitude:parseFloat(a[0].lon)};throw Error(`Could not find exact location for the provided city/pincode. Please check your spelling and try again.`)}window.finishWizard=async()=>{let t=document.getElementById(`btn-finish-wizard`),n=document.getElementById(`wiz-error`),r=document.getElementById(`wiz-street`).value.trim(),i=document.getElementById(`wiz-city`).value.trim(),a=document.getElementById(`wiz-state`).value.trim(),o=document.getElementById(`wiz-pincode`).value.trim(),s=document.getElementById(`wiz-upi`).value.trim();if(!r||!i||!a||!o||!s){n.textContent=`Please fill in all required fields.`,n.style.display=`block`;return}t.disabled=!0,t.textContent=`Saving...`,n.style.display=`none`;try{let t=await K(i,a,o),n={shopName:document.getElementById(`wiz-shopname`).value.trim(),about:document.getElementById(`wiz-bio`).value.trim(),address:{street:r,city:i,state:a,pincode:o},latitude:t.latitude,longitude:t.longitude,upiId:s,workingHours:{open:document.getElementById(`wiz-time-open`).value,close:document.getElementById(`wiz-time-close`).value},services:[{id:`svc_`+Date.now(),name:document.getElementById(`wiz-service-name`).value.trim(),price:document.getElementById(`wiz-service-price`).value,time:`30 mins`}]};G&&(n.profilePic=G),await b(n),Object.assign(e,n),document.getElementById(`wizard-percent`).textContent=`100`,document.getElementById(`wizard-progress-bar`).style.width=`100%`,setTimeout(()=>{document.getElementById(`onboarding-wizard`).style.display=`none`,setScreen(`dashboard`),H(`Profile setup complete!`,`success`)},800)}catch(e){console.error(`Wizard save failed:`,e),n.textContent=`Failed to save profile. Please try again.`,n.style.display=`block`,t.disabled=!1,t.textContent=`Finish Setup 🎉`}}}));export default a();