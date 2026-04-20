import { db, collection, getDocs, query, where, doc, updateDoc } from '../firebase.js';

async function syncAllRatings() {
  console.log("Starting Rating Sync...");
  
  // 1. Get all approved barbers
  const barbersSnap = await getDocs(query(collection(db, "barbers"), where("status", "==", "approved")));
  console.log(`Found ${barbersSnap.size} approved barbers.`);
  
  for (const bDoc of barbersSnap.docs) {
    const barberId = bDoc.id;
    console.log(`\nProcessing Barber: ${bDoc.data().shopName || bDoc.data().name} (${barberId})`);
    
    // 2. Get all reviews for this barber
    const reviewsSnap = await getDocs(query(collection(db, "reviews"), where("barberId", "==", barberId)));
    const totalReviews = reviewsSnap.size;
    
    if (totalReviews === 0) {
      console.log("  -> No reviews found. Setting rating to 0, reviewCount to 0.");
      await updateDoc(doc(db, "barbers", barberId), {
        rating: 0,
        reviewCount: 0
      });
      continue;
    }
    
    // 3. Calculate average
    let sum = 0;
    reviewsSnap.forEach(r => {
      sum += (Number(r.data().rating) || 5);
    });
    const avg = sum / totalReviews;
    
    console.log(`  -> Final Stats: ${avg.toFixed(2)} stars across ${totalReviews} reviews.`);
    
    // 4. Update Barber Document
    await updateDoc(doc(db, "barbers", barberId), {
      rating: avg,
      reviewCount: totalReviews
    });
  }
  
  console.log("\n✅ Sync Complete!");
  alert("Rating Sync Complete!");
}

window.syncAllRatings = syncAllRatings;
syncAllRatings().catch(err => {
  console.error("Sync Failed:", err);
  alert("Sync Failed: " + err.message);
});
