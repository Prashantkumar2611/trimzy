    async function submitContact(e) {
      e.preventDefault();
      const btn = document.getElementById('cf-submit-btn');
      const originalText = btn.textContent;
      
      const name = document.getElementById('cf-name').value;
      const contact = document.getElementById('cf-contact').value;
      const subject = document.getElementById('cf-subject').value;
      const message = document.getElementById('cf-message').value;

      btn.textContent = 'Sending...';
      btn.disabled = true;

      const DESTINATION_EMAIL = 'trimzy.co.in@gmail.com';
      const API_URL = window.TRIMZY_CONFIG?.API_URL || 'https://trimzy-backend.onrender.com/api';

      try {
        const response = await fetch(`${API_URL}/auth/contact`, {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            contact,
            subject,
            message
          })
        });

        const resJson = await response.json();
        if (response.ok) {
          document.getElementById('success-overlay').classList.add('show');
          e.target.reset(); // clear the form
        } else {
          alert('Sorry, there was an error sending your message. Please try again or email us directly at ' + DESTINATION_EMAIL);
          console.error(resJson);
        }
      } catch (error) {
        console.error(error);
        alert('Could not deliver message. Please contact us directly at ' + DESTINATION_EMAIL);
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    }
