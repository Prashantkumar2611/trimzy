import { db, collection, getDocs, query, where } from '../firebase.js';

async function check() {
  const q = query(collection(db, "barbers"), where("status", "==", "approved"));
  const snap = await getDocs(q);
  console.log("Found " + snap.size + " approved barbers.");
  
  for (const doc of snap.docs) {
    const data = doc.data();
    console.log("Barber: " + (data.shopName || data.name) + " | ID: " + doc.id + " | Rating Field: " + data.rating);
    
    // Check reviews for this barber
    const rq = query(collection(db, "reviews"), where("barberId", "==", doc.id));
    const rSnap = await getDocs(rq);
    console.log("  -> Reviews: " + rSnap.size);
    if (rSnap.size > 0) {
      let sum = 0;
      rSnap.forEach(rd => sum += (rd.data().rating || 0));
      console.log("  -> Real Average: " + (sum / rSnap.size).toFixed(1));
    }
  }
}

check().catch(console.error);
