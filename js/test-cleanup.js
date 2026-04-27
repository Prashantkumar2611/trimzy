    // STANDALONE CONFIG
    const firebaseConfig = {
      apiKey: "AIzaSyDciX44koaTNnC26NNUaEXVy_nL-e0c4xo",
      authDomain: "snipslot-2629.firebaseapp.com",
      projectId: "snipslot-2629",
      storageBucket: "snipslot-2629.appspot.com",
      messagingSenderId: "330621998514",
      appId: "1:330621998514:web:e2b0de05e46359006480ab",
      measurementId: "G-7DR5SJSG9N"
    };

    // Initialize Firebase using Compat API
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    async function performReset() {
      const btn = document.getElementById('reset-btn');
      if (!confirm("Are you ABSOLUTELY sure? This will delete all documents in barbers, bookings, reviews, and users collections.")) return;

      btn.disabled = true;
      btn.textContent = "Processing...";

      const collections = [
        'barbers',
        'bookings',
        'customer_reviews',
        'reviews',
        'users',
        'barber_applications',
        'userSessions'
      ];

      for (const collName of collections) {
        log(`Starting wipe for: ${collName}...`, 'info');
        try {
          const querySnapshot = await db.collection(collName).get();

          if (querySnapshot.empty) {
            log(`Collection '${collName}' is already empty.`, 'success');
            continue;
          }

          const batch = db.batch();
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });

          await batch.commit();
          log(`Successfully deleted ${querySnapshot.size} documents from '${collName}'.`, 'success');
        } catch (err) {
          log(`Error clearing ${collName}: ${err.message}`, 'error');
          console.error(err);
        }
      }

      log("--- WIPE COMPLETE ---", 'success');
      btn.textContent = "WIPE FINISHED";
      alert("Database cleared! You can now start fresh testing.");
    }

    function log(msg, type) {
      const div = document.createElement('div');
      div.className = 'log-entry ' + type;
      div.textContent = `> ${msg}`;
      document.getElementById('status').appendChild(div);
      document.getElementById('status').scrollTop = document.getElementById('status').scrollHeight;
    }
