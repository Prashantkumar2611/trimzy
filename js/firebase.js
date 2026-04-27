// ============================================================
//  Trimzy — Firebase Connection (firebase.js)
//  Import this file in every HTML page
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, doc, getDoc, collection, addDoc, getDocs, updateDoc, setDoc, 
  query, where, orderBy, deleteDoc, serverTimestamp, onSnapshot, limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDciX44koaTNnC26NNUaEXVy_nL-e0c4xo",
  authDomain: "snipslot-2629.firebaseapp.com",
  projectId: "snipslot-2629",
  storageBucket: "snipslot-2629.appspot.com",
  messagingSenderId: "330621998514",
  appId: "1:330621998514:web:e2b0de05e46359006480ab",
  measurementId: "G-7DR5SJSG9N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { 
  auth, db, storage, doc, getDoc, collection, addDoc, getDocs, updateDoc, setDoc, 
  query, where, orderBy, deleteDoc, serverTimestamp, onSnapshot, limit,
  ref, uploadBytesResumable, getDownloadURL
};
