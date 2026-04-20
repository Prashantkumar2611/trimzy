
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

async function audit() {
  const id = "QUFZwk4i9ibXXF52Y6W5";
  console.log("Auditing ID:", id);
  const snap = await getDoc(doc(db, "barbers", id));
  if (snap.exists()) {
    const data = snap.data();
    console.log("ID EXISTS.");
    console.log("UID:", data.uid || "MISSING");
    console.log("Email:", data.email || "MISSING");
    console.log("Photos Count:", (data.salonPhotos || []).length);
    console.log("Profile Pic:", data.profilePic ? "YES" : "NO");
    console.log("Doc Size (approx):", JSON.stringify(data).length, "bytes");
  } else {
    console.log("ID DOES NOT EXIST.");
  }
  process.exit();
}

audit();
