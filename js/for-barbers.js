    import { auth } from './firebase.js';

    window.submitBarberForm = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.form-submit');
      btn.textContent = 'Submitting...';
      btn.disabled = true;

      const form = e.target;
      const inputs = form.querySelectorAll('input, select, textarea');

      try {
        const API_URL = window.TRIMZY_CONFIG?.API_URL || 'https://trimzy-backend.onrender.com/api';
        const payload = {
          name: inputs[0].value.trim(),
          phone: inputs[1].value.trim(),
          email: inputs[2].value.trim(),
          area: inputs[3].value.trim(),
          shopName: inputs[0].value.trim() + "'s Shop" // Default shop name
        };

        const response = await fetch(`${API_URL}/admin/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Failed to submit application');
        }

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
