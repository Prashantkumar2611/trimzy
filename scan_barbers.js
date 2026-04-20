
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDciX44koaTNnC26NNUaEXVy_nL-e0c4xo",
  authDomain: "snipslot-2629.firebaseapp.com",
  projectId: "snipslot-2629",
  storageBucket: "snipslot-2629.appspot.com",
  messagingSenderId: "330621998514",
  appId: "1:330621998514:web:e2b0de05e46359006480ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listAll() {
  console.log("Listing all barbers...");
  const snap = await getDocs(collection(db, "barbers"));
  console.log("Found", snap.size, "barbers.");
  snap.forEach(doc => {
    const data = doc.data();
    if ((data.salonPhotos && data.salonPhotos.length > 0) || data.name?.includes("Aalim") || data.email?.includes("sanjay")) {
      console.log(`[ID: ${doc.id}] Name: ${data.name} | Email: ${data.email} | Photos: ${data.salonPhotos?.length || 0} | UID: ${data.uid || 'NONE'}`);
    }
  });
  console.log("List complete.");
  process.exit();
}

listAll();
