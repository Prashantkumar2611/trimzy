    import { db, auth, collection, query, where, getDocs, setDoc, doc, deleteDoc } from './firebase.js';
    import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

    window.startRepair = async () => {
        const email = document.getElementById('email').value.trim();
        const btn = document.getElementById('repair-btn');
        const status = document.getElementById('status');
        
        if (!email) {
            showStatus("Please enter an email address.", "error");
            return;
        }

        btn.disabled = true;
        btn.textContent = "Processing...";
        showStatus("Analyzing database...", "");

        try {
            // 1. Find the barber document by email
            const q = query(collection(db, "barbers"), where("email", "==", email));
            const snap = await getDocs(q);

            if (snap.empty) {
                showStatus("No barber profile found with this email in Firestore.", "error");
                btn.disabled = false;
                btn.textContent = "Repair Account Now";
                return;
            }

            const barberDoc = snap.docs[0];
            const barberData = barberDoc.data();
            const currentDocId = barberDoc.id;
            const uidInField = barberData.uid;

            if (!uidInField) {
                showStatus("This profile is missing a UID field. Please log in as this barber first to generate a UID, or fix it in the Admin panel.", "error");
                btn.disabled = false;
                btn.textContent = "Repair Account Now";
                return;
            }

            // 2. Migration: Move the data to a new document with ID = UID
            await setDoc(doc(db, "barbers", uidInField), barberData);
            console.log("Moved data to UID-based document:", uidInField);

            // 3. Delete the old random-id document
            if (currentDocId !== uidInField) {
                await deleteDoc(doc(db, "barbers", currentDocId));
                console.log("Deleted old legacy document:", currentDocId);
            }

            showStatus("✅ Success! Account repaired. The barber can now log in normally.", "success");
            btn.textContent = "Fixed! Try logging in now.";
        } catch (err) {
            console.error(err);
            showStatus("Error: " + err.message, "error");
            btn.disabled = false;
            btn.textContent = "Repair Account Now";
        }
    };

    function showStatus(msg, type) {
        const el = document.getElementById('status');
        el.textContent = msg;
        el.className = type;
    }
