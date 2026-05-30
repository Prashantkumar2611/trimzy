import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/contact.css';

const Contact = () => {
  const navigate = useNavigate();

  useEffect(() => {
    import('../../js/shared.js').catch(err => console.error(err));
    import('../../js/contact.js').catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />

      {/*  CONTACT HERO  */}
      <section className="contact-hero">
        <div className="ch-bg1"></div>
        <div className="ch-bg2"></div>
        <div className="ch-content">
          <div className="section-label" style={{color: 'var(--gold)'}}>Get in touch</div>
          <h1>We'd love to <span style={{color: 'var(--gold)'}}>hear</span> from you</h1>
          <p>Have questions about bookings, partnerships, or just want to say hello? Our team is here to help.</p>
        </div>
      </section>

      {/*  CONTACT SPLIT  */}
      <section style={{background: 'var(--bg)', padding: '80px 5%'}}>
        <div className="contact-grid">
          {/*  Contact Info  */}
          <div className="contact-info-panel">
            <h2 className="panel-title">Contact Information</h2>
            <p className="panel-sub" style={{marginBottom: '40px'}}>Fill out the form and our team will get back to you within 24 hours.</p>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <div className="info-label">Call or WhatsApp</div>
                <div className="info-val">+91 70081 23456</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <div className="info-label">Email Us</div>
                <div className="info-val">support@trimzy.co.in</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <div className="info-label">Office Address</div>
                <div className="info-val">KIIT TBI, Patia, Bhubaneswar, Odisha, 751024</div>
              </div>
            </div>
          </div>

          {/*  Contact Form  */}
          <div className="contact-form-panel">
            <form onSubmit={(e) => window.submitContactForm(e)}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" type="text" placeholder="John" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" type="text" placeholder="Doe" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" type="email" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" type="tel" placeholder="9876543210" required />
                </div>
                <div className="form-group full">
                  <label className="form-label">Message *</label>
                  <textarea className="form-input" placeholder="Type your message here..." style={{minHeight: '120px', resize: 'vertical'}} required></textarea>
                </div>
              </div>
              <button className="form-submit" type="submit" style={{width: '100%', marginTop: '24px'}}>Send Message →</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      {/*  SUCCESS OVERLAY  */}
      <div className="success-overlay" id="success-overlay">
        <div className="success-box">
          <div className="success-icon-big">📩</div>
          <div className="success-title">Message Sent!</div>
          <div className="success-desc">Thanks for reaching out! We'll get back to you within 24 hours. You're awesome!</div>
          <button className="success-btn"
            onClick={(e) => { document.getElementById('success-overlay').classList.remove('show') }}>Done</button>
        </div>
      </div>
    </>
  );
};

export default Contact;
