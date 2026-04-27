    import { db } from './firebase.js';
    import { collection, addDoc, serverTimestamp }
      from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

    window.submitBarberForm = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.form-submit');
      btn.textContent = 'Submitting...';
      btn.disabled = true;

      const form = e.target;
      const inputs = form.querySelectorAll('input, select, textarea');

      try {
        await addDoc(collection(db, 'barber_applications'), {
          name: inputs[0].value.trim(),
          phone: inputs[1].value.trim(),
          email: inputs[2].value.trim(),
          upiId: inputs[3].value.trim(),
          shopName: inputs[4].value.trim(),
          area: inputs[5].value.trim(),
          experience: inputs[6].value,
          services: inputs[7].value,
          homeVisit: inputs[8].value,
          about: inputs[9].value.trim(),
          status: 'pending',
          createdAt: serverTimestamp()
        });

        document.getElementById('success-overlay').classList.add('show');
        form.reset();
      } catch (err) {
        alert('Something went wrong. Please check your connection and try again.');
        console.error(err);
      } finally {
        btn.textContent = 'Submit Application →';
        btn.disabled = false;
      }
    };
