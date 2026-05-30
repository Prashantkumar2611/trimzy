import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../../css/how-it-works.css';

const HowItWorks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.style.display = 'none', 600); }
    import('../../js/shared.js').catch(err => console.error(err));
    import('../../js/how-it-works.js').catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />

      {/*  PAGE HERO  */}
      <section className="page-hero">
        <div className="page-hero-bg"></div>

        <h1>How <span style={{color: 'var(--gold)'}}>Trimzy</span> works</h1>
        <p>From finding a barber to walking out with a fresh cut here's everything you need to know</p>
      </section>

      {/*  BOOKING TYPES  */}
      <section style={{background: 'var(--bg)'}}>
        <div className="section-label">Two ways to book</div>
        <h2 className="section-title">Visit the shop or <span className="accent">we come to you</span></h2>
        <div className="types-grid">
          <div className="type-card shop">
            <div className="type-badge">SHOP VISIT</div>
            <div className="type-title">Visit the Barbershop</div>
            <div className="type-desc">Walk in at your scheduled time no queue no wait The barber is ready for you</div>
            <ul className="type-list">
              <li>Choose your barber & barbershop</li>
              <li>Pick a time slot that's free</li>
              <li>Walk in exactly on time</li>
              <li>Pay after your haircut via UPI</li>
            </ul>
          </div>
          <div className="type-card home">
            <div className="type-badge">HOME VISIT</div>
            <div className="type-title">Barber Comes to You</div>
            <div className="type-desc">An ID-verified barber brings their tools to your home Safe, convenient, premium</div>
            <ul className="type-list">
              <li>Filter for "home visit" barbers</li>
              <li>Share your address & time</li>
              <li>Barber arrives with full kit</li>
              <li>Pay via UPI after the service</li>
            </ul>
          </div>
        </div>
      </section>

      {/*  STEP BY STEP  */}
      <section className="process-section">

        <h2 className="section-title">Your complete <span className="accent">booking guide</span></h2>
        <div className="steps-grid">
          {/*  STEP 1  */}
          <div className="swiggy-card" data-aos="fade-up">
            <div className="swiggy-img-box">
              <img src="assets/img/guide/guide1.png" className="swiggy-img" alt="App & Location" />
            </div>
            <div className="swiggy-pill">Open app & set location</div>
          </div>

          {/*  STEP 2  */}
          <div className="swiggy-card" data-aos="fade-up" data-aos-delay="100">
            <div className="swiggy-img-box">
              <img src="assets/img/guide/guide2.png" className="swiggy-img" alt="Choose Barber" />
            </div>
            <div className="swiggy-pill">Browse & choose barber</div>
          </div>

          {/*  STEP 3  */}
          <div className="swiggy-card" data-aos="fade-up" data-aos-delay="200">
            <div className="swiggy-img-box">
              <img src="assets/img/guide/guide3.png" className="swiggy-img" alt="Time Slot" />
            </div>
            <div className="swiggy-pill">Pick date & time slot</div>
          </div>

          {/*  STEP 4  */}
          <div className="swiggy-card" data-aos="fade-up" data-aos-delay="300">
            <div className="swiggy-img-box">
              <img src="assets/img/guide/guide4.png" className="swiggy-img" alt="Haircut" />
            </div>
            <div className="swiggy-pill">Get your haircut</div>
          </div>

          {/*  STEP 5  */}
          <div className="swiggy-card" data-aos="fade-up" data-aos-delay="400">
            <div className="swiggy-img-box">
              <img src="assets/img/guide/guide5.png" className="swiggy-img" alt="Pay UPI" />
            </div>
            <div className="swiggy-pill">Pay via UPI & Review</div>
          </div>
        </div>
      </section>

      {/*  FAQ  */}
      <section className="faq-section">

        <h2 className="section-title">Frequently asked <span className="accent">questions</span></h2>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-q">Is Trimzy free for customers? <span className="faq-icon">+</span></div>
            <div className="faq-a">
              <p>Yes, completely free for customers There are no booking fees or service charges You only pay the barber for
                the haircut directly via UPI</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">How do I cancel or reschedule a booking? <span className="faq-icon">+</span></div>
            <div className="faq-a">
              <p>You can cancel or reschedule up to 2 hours before your appointment from the app Late cancellations may
                affect your reliability score</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Are home visit barbers safe? <span className="faq-icon">+</span></div>
            <div className="faq-a">
              <p>All home visit barbers are ID-verified and reviewed by our team You can see their rating, reviews, and
                verified badge before booking Your safety is our priority</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">What if the barber doesn't show up? <span className="faq-icon">+</span></div>
            <div className="faq-a">
              <p>In the rare case of a no show, contact our support and we'll help you find another barber immediately or
                reschedule at no inconvenience to you</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Which areas in Bhubaneswar are covered? <span className="faq-icon">+</span></div>
            <div className="faq-a">
              <p>We currently cover Saheed Nagar, Bapuji Nagar, IRC Village, Patia, Nayapalli, Kharvel Nagar, and more We're
                expanding rapidly check the app for the latest coverage</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Can I book for someone else? <span className="faq-icon">+</span></div>
            <div className="faq-a">
              <p>Yes! You can book for a family member or friend Just add their name during the booking flow The barber will
                know who to expect</p>
            </div>
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <h2 className="cta-title">Ready to book your barber?</h2>
        <p className="cta-sub">It takes 60 seconds No account needed for your first booking</p>
        <div className="cta-actions">
          <button className="btn-cta-dark" onClick={(e) => { navigate('/app') }}>Book a Barber Now</button>
          <button className="btn-cta-outline" onClick={(e) => { navigate('/for-barbers#barber-signup') }}>Join as a Barber</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HowItWorks;
