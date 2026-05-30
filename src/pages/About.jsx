import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Page specific CSS
import '../../css/about.css';

const About = () => {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="about-hero">
        <div className="ah-bg"></div>
        <div className="ah-bg2"></div>

        <h1>
          We're fixing how <span style={{ color: 'var(--gold)' }}>INDIA</span> gets haircuts
        </h1>
        <p>
          Trimzy was born from a simple frustration waiting at a barbershop when you could be doing literally anything
          else. We built the solution
        </p>
      </section>

      {/* MISSION */}
      <section className="mission-section">
        <div className="section-label">Mission</div>
        <h2 className="section-title">
          Why we built <span className="accent">Trimzy</span>
        </h2>
        <div className="mission-split">
          <div className="mission-text">
            <p>
              In India, millions of people visit barbershops every week Most of them wait Some wait 10 minutes
              Many wait 45 minutes or more That's time they'll never get back
            </p>
            <p>
              At the same time, talented barbers struggle with inconsistent income some hours completely empty, others
              unmanageably busy The system was broken on both sides
            </p>
            <div className="mission-quote">
              <p>"We don't just book appointments We give barbers their livelihood and customers their time back"</p>
              <cite>— Trimzy Team, Bhubaneswar</cite>
            </div>
            <p>
              Trimzy was our answer A platform that connects customers with the right barber at the right time
              instantly, effortlessly, and completely transparently
            </p>
          </div>
          <div className="mission-stats-box">
            <div className="ms-stat">
              <div className="ms-num">50<span>+</span></div>
              <div className="ms-label">Barbers onboard</div>
            </div>
            <div className="ms-stat">
              <div className="ms-num">2K<span>+</span></div>
              <div className="ms-label">Bookings completed</div>
            </div>
            <div className="ms-stat">
              <div className="ms-num">4.9<span>★</span></div>
              <div className="ms-label">Average rating</div>
            </div>
            <div className="ms-stat">
              <div className="ms-num">0<span>₹</span></div>
              <div className="ms-label">Commission charged</div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY / TIMELINE */}
      <section className="story-section">
        <h2 className="section-title">
          How we got <span className="accent">here</span>
        </h2>
        <div className="story-timeline">
          <div className="story-item">
            <div className="story-dot">1</div>
            <div className="story-content">
              <div className="story-year">Early 2025</div>
              <div className="story-title">The idea</div>
              <div className="story-desc">
                After waiting 50 minutes at a Saheed Nagar barbershop, our founder started sketching
                an app on his phone What if you could book a barber the same way you book an Ola?
              </div>
            </div>
          </div>
          <div className="story-item">
            <div className="story-dot">2</div>
            <div className="story-content">
              <div className="story-year">Mid 2025</div>
              <div className="story-title">First 5 barbers</div>
              <div className="story-desc">
                We pitched our idea to barbers in the Saheed Nagar area Five of them signed up in the
                first week. The first version of Trimzy was a simple WhatsApp-based booking system
              </div>
            </div>
          </div>
          <div className="story-item">
            <div className="story-dot">3</div>
            <div className="story-content">
              <div className="story-year">Late 2025</div>
              <div className="story-title">The platform launches</div>
              <div className="story-desc">
                We built and launched the full Trimzy web platform Within 3 months, we had 30 barbers
                and 500 bookings Customers loved the zero wait experience
              </div>
            </div>
          </div>
          <div className="story-item">
            <div className="story-dot">4</div>
            <div className="story-content">
              <div className="story-year">2026</div>
              <div className="story-title">Growing fast</div>
              <div className="story-desc">
                50+ barbers, 2,000+ bookings, home visits launched. We're now expanding to Cuttack,
                Puri, and more cities across Odisha The mission continues
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <h2 className="section-title">
          People behind <span className="accent">Trimzy</span>
        </h2>
        <p className="section-sub">A small, passionate team from Bhubaneswar building something meaningful for our city</p>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar-photo">
              <img 
                src="https://imglink.cc/cdn/pkz8avjFpZ.jpg" 
                alt="Prasant Kumar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="team-avatar" style={{ display: 'none', background: 'linear-gradient(135deg,#E8A44A,#E87766)' }}>PK</div>
            </div>
            <div className="team-name">Prasant Kumar</div>
            <div className="team-role">Founder & CEO</div>
            <div className="team-bio">
              Engineer with a strong focus on scalable system design and product thinking. Driven to
              build efficient, user-focused solutions that solve real-world problems
            </div>
          </div>

          <div className="team-card">
            <div className="team-avatar-photo">
              <img 
                src="https://imglink.cc/cdn/Py5HKnGB4V.png" 
                alt="Harsh Raj"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if(e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="team-avatar" style={{ display: 'none', background: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' }}>HR</div>
            </div>
            <div className="team-name">Harsh Raj</div>
            <div className="team-role">Co Founder</div>
            <div className="team-bio">
              Passionate about making technology feel human. Designed every pixel of the Trimzy
              experience
            </div>
          </div>

          <div className="team-card">
            <div className="team-avatar" style={{ background: 'linear-gradient(135deg,#4AAFE8,#4A78E8)' }}>RS</div>
            <div className="team-name">Rohit Sahoo</div>
            <div className="team-role">Lead Engineer</div>
            <div className="team-bio">
              Builds fast, reliable software. Keeps Trimzy running 24/7 so barbers and customers never
              miss a beat
            </div>
          </div>

          <div className="team-card">
            <div className="team-avatar" style={{ background: 'linear-gradient(135deg,#2ECC8E,#1A9668)' }}>SP</div>
            <div className="team-name">Sonia Panda</div>
            <div className="team-role">Barber Relations</div>
            <div className="team-bio">
              Spent months talking to every barber in Bhubaneswar. Understands what they need and makes
              sure Trimzy delivers it
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="section-label">Our Values</div>
        <h2 className="section-title" style={{ color: '#fff' }}>
          What we stand <span className="accent">for</span>
        </h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-title">Time is precious</div>
            <div className="value-desc">
              We take waiting seriously Every minute saved for a customer is a minute they get back
              for what matters to them
            </div>
          </div>
          <div className="value-card">
            <div className="value-title">Barbers first</div>
            <div className="value-desc">
              Barbers are our partners, not just suppliers Zero commission Transparent tools We win
              when they win
            </div>
          </div>
          <div className="value-card">
            <div className="value-title">Safety always</div>
            <div className="value-desc">
              ID verification, real reviews, and transparent profiles Customers should feel safe
              booking anyone on Trimzy
            </div>
          </div>
          <div className="value-card">
            <div className="value-title">Built for India</div>
            <div className="value-desc">
              UPI payments, local areas, local languages Trimzy is built specifically for Indian
              cities starting with Bhubaneswar
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <h2 className="cta-title">
          Join us in changing how<br />Bhubaneswar gets its haircuts
        </h2>
        <p className="cta-sub">Whether you're a customer or a barber, Trimzy is built for you</p>
        <div className="cta-actions">
          <button 
            className="btn-cta-dark" 
            onClick={() => window.location.href = '/app'}
          >
            Book a Barber
          </button>
          <button 
            className="btn-cta-outline" 
            onClick={() => window.location.href = '/for-barbers#barber-signup'}
          >
            Join as a Barber
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
