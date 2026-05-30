import"./shared-BKSQ3Ylu.js";import"./shared-Cz6FGEhM.js";import{c as e,i as t,l as n,n as r,o as i,r as a,s as o,t as s}from"./firebase-CQB50Ful.js";import{onAuthStateChanged as c}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";async function l(){let s=new URLSearchParams(window.location.search),c=s.get(`id`);if(!c){window.location.href=`/`;return}document.getElementById(`back-profile`).href=`/barber-profile?id=${c}`;try{let l=new Set([c]),u=s.get(`uid`);u&&l.add(u);let d=`this shop`;try{let e=await i(t(a,`barbers`,c));if(e.exists()){let t=e.data();d=t.shopName||t.name||`this shop`,Object.keys(t).join(`, `),t.uid,t.uid&&l.add(t.uid)}else console.warn(`[REVIEWS] Barber doc NOT found for:`,c)}catch(e){console.warn(`[REVIEWS] Could not read barber doc (may need auth):`,e.message||e)}document.getElementById(`barber-name-sub`).innerText=`What people are saying about ${d}`,[...l];let f=new Map;for(let t of l)try{let i=await o(e(r(a,`reviews`),n(`barberId`,`==`,t)));`${t}${i.docs.length}`,i.docs.forEach(e=>{f.has(e.id)||f.set(e.id,{id:e.id,...e.data()})})}catch(e){console.error(`[REVIEWS] Query error for "${t}":`,e.message||e)}f.size;let p=document.getElementById(`reviews-grid`);if(f.size===0){p.innerHTML=`
            <div class="empty-state">
              <p style="font-size: 24px; margin-bottom: 8px;">No reviews yet</p>
              <p>Be the first to share your experience after your appointment!</p>
              <p style="font-size: 11px; opacity: 0.5; margin-top: 20px;">(Searched: ${[...l].join(`, `)})</p>
            </div>`;return}p.innerHTML=[...f.values()].sort((e,t)=>{let n=e.createdAt?.toMillis?e.createdAt.toMillis():e.createdAt?.seconds?e.createdAt.seconds*1e3:0;return(t.createdAt?.toMillis?t.createdAt.toMillis():t.createdAt?.seconds?t.createdAt.seconds*1e3:0)-n}).map(e=>{let t=e.customerName&&e.customerName!==`Customer`?e.customerName:`Verified Guest`,n=t.split(` `).map(e=>e[0]).join(``).toUpperCase().substring(0,2),r=`Recently`;return e.createdAt&&(r=(e.createdAt.toDate?e.createdAt.toDate():new Date(e.createdAt.seconds*1e3)).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})),`
            <div class="review-card">
              <div class="rc-header">
                <div class="rc-avatar">${n}</div>
                <div class="rc-details">
                  <div class="rc-name">${t}</div>
                  <div class="rc-meta">Verified Customer</div>
                  <div class="rc-stars">${`★`.repeat(Math.min(5,Math.max(1,e.rating||5)))}</div>
                </div>
              </div>
              <div class="rc-text">${e.comment||`Outstanding service, highly recommended!`}</div>
              <div class="rc-date">${r}</div>
            </div>`}).join(``)}catch(e){console.error(`[REVIEWS] Fatal error:`,e),document.getElementById(`reviews-grid`).innerHTML=`<p class="loading-state">Failed to load reviews. Please try again later.</p>`}}var u=!1;function d(){u||(u=!0,l())}c(s,e=>{e&&e.email,d()}),setTimeout(()=>{u||d()},2e3);