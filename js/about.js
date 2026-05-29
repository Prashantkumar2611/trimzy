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

      // Use the restored secure local config
      const DESTINATION_EMAIL = 'trimzy.co.in@gmail.com';
      const API_URL = window.TRIMZY_CONFIG?.API_URL || 'https://trimzy-backend.onrender.com/api';

      try {
        const response = await fetch(`${API_URL}/auth/send-email`, {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            toEmail: DESTINATION_EMAIL, 
            toName: "Prasant Kumar",
            subject: `New Trimzy Message: ${subject}`,
            htmlContent: `
              <h2>New message from Trimzy Website!</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Contact Info:</strong> ${contact}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="padding:15px;background:#f4f4f4;border-left:4px solid #e8a44a;">${message}</p>
            `
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
    // ══ Form Success Handling ══
    if (new URLSearchParams(window.location.search).get('message') === 'sent') {
      document.getElementById('success-overlay').classList.add('show');
    }
