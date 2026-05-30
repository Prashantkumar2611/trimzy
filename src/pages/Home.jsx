import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const col1Testimonials = [
  { name: 'Arjun Mohanty', role: 'Saheed Nagar', content: '"Finally no more waiting at the barbershop for 45 minutes I book my slot the night before and just walk in. Game changer!"', initials: 'AM', color: 'linear-gradient(135deg,#E8A44A,#E87766)' },
  { name: 'Suresh Patra', role: 'IRC Village', content: '"The ID verification made my family feel safe. Home visit feature is incredible. Highly professional!"', initials: 'SP', color: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' },
  { name: 'Rajan Sharma', role: 'Master Barber', content: '"My bookings tripled after joining Trimzy. The dashboard is simple and payments come directly to my UPI."', initials: 'RS', color: 'linear-gradient(135deg,#3b82f6,#2dd4bf)' },
  { name: 'Rahul Kumar', role: 'Student', content: '"Superb zero-wait experience. I can fit a haircut into my lunch break without worrying about delays."', initials: 'RK', color: 'linear-gradient(135deg,#6366f1,#a855f7)' },
  { name: 'Vikram Mishra', role: 'IT Park', content: '"Elite barbers right at my living room. Home service is a lifesaver for busy weekends."', initials: 'VM', color: 'linear-gradient(135deg,#10b981,#3b82f6)' },
  { name: 'Nikita Singh', role: 'Lawyer', content: '"ID checks and rating system give me peace of mind. Every barber I\'ve met has been professional."', initials: 'NS', color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { name: 'Prakash Panda', role: 'Shop Owner', content: '"Income has tripled in 3 months. The app handles scheduling so I can focus on my art."', initials: 'PP', color: 'linear-gradient(135deg,#ec4899,#8b5cf6)' }
];

const col2Testimonials = [
  { name: 'Ankit Sahu', role: 'Patia', content: '"Used to wait for 1 hour at my shop. Now I go when my slot starts. Trimzy is very reliable!"', initials: 'AS', color: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { name: 'Manas Dash', role: 'Unit 9', content: '"Reliable slot system. No double bookings. The app is much better than calling the barber."', initials: 'MD', color: 'linear-gradient(135deg,#06b6d4,#0891b2)' },
  { name: 'Biswajit Das', role: 'Student', content: '"Payment via UPI is seamless. No cash hassle at the shop. The UI is very smooth."', initials: 'BD', color: 'linear-gradient(135deg,#a855f7,#7c3aed)' },
  { name: 'Sanjay Malik', role: 'Barber Pro', content: '"I handle 15-20 clients easily now. No chaos at the shop. My customers love the speed."', initials: 'SM', color: 'linear-gradient(135deg,#ec4899,#db2777)' },
  { name: 'Priyanka Roy', role: 'Regular User', content: '"The UI feels premium. Finding a barber in Bhubaneswar was never this easy. Kudos!"', initials: 'PR', color: 'linear-gradient(135deg,#10b981,#059669)' },
  { name: 'Hitesh Agarwal', role: 'Shop Owner', content: '"My business grew 40% after joining the platform. The feedback system really helps."', initials: 'HA', color: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { name: 'Kartik Dev', role: 'Customer', content: '"Clean slots, clean experience. Best booking app for men\'s grooming in India."', initials: 'KD', color: 'linear-gradient(135deg,#6b7280,#4b5563)' }
];

const col3Testimonials = [
  { name: 'John Doe', role: 'Developer', content: '"The app is so fast. I booked my haircut in literally 60 seconds."', initials: 'JD', color: 'linear-gradient(135deg,#8b5cf6,#ef4444)' },
  { name: 'Sonal Hota', role: 'Puri', content: '"Every barber is ID-verified. That\'s a huge plus for home services."', initials: 'SH', color: 'linear-gradient(135deg,#10b981,#3b82f6)' },
  { name: 'Amit Verma', role: 'Student', content: '"No more awkward phone calls to barbers. Just pick a slot and go."', initials: 'AV', color: 'linear-gradient(135deg,#E8A44A,#10b981)' },
  { name: 'Rajesh Tripathy', role: 'Infosys', content: '"Finally someone solved the barber queue problem. Incredible execution."', initials: 'RT', color: 'linear-gradient(135deg,#ef4444,#e8a44a)' },
  { name: 'Rohan Sen', role: 'Master Barber', content: '"Love the UI. It\'s so clean and easy to use on my iPhone. Highly recommended."', initials: 'RS', color: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' },
  { name: 'Manoj Kar', role: 'Regular User', content: '"The best barber booking app in Bhubaneswar. Keep growing guys!"', initials: 'MK', color: 'linear-gradient(135deg,#10b981,#d97706)' },
  { name: 'Naveen Kumar', role: 'Saheed Nagar', content: '"The reviews are honest. I found my signature barber through Trimzy."', initials: 'NK', color: 'linear-gradient(135deg,#d97706,#3b82f6)' }
];

const TestimonialCard = ({ item }) => (
  <div className="testimonial-card">
    <div className="tc-stars">★★★★★</div>
    <div className="tc-content">{item.content}</div>
    <div className="tc-footer">
      <div className="tc-avatar" style={{ background: item.color }}>{item.initials}</div>
      <div className="tc-info">
        <div className="tc-name">{item.name}</div>
        <div className="tc-role">{item.role}</div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Add scroll listener for nav
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero" id="hero">
        <video 
          className={`hero-video-bg ${isVideoLoaded ? 'loaded' : ''}`} 
          id="hero-video" 
          poster="/assets/hero-poster.png" 
          preload="auto" 
          autoPlay 
          loop 
          muted 
          playsInline
          onCanPlayThrough={() => setIsVideoLoaded(true)}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-logo-type fade-up">trimzy</div>
          <h1 className="hero-headline fade-up-d1">
            India's #1<br />barber booking app
          </h1>
          <p className="hero-sub fade-up-d2">Experience fast and hassle free salon booking with Trimzy app</p>
          <div className="hero-actions fade-up-d3">
            <button className="btn-hero-primary" onClick={() => navigate('/app')}>
              Book a Barber
            </button>
            <button className="btn-hero-secondary" onClick={() => navigate('/for-barbers#barber-signup')}>
              Join as Barber
            </button>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="ticker-item">
              {['Book in 60 seconds', 'No waiting in line', 'Home visits available', 'UPI payments', 'ID-verified barbers', 'Real-time slots', "Bhubaneswar's #1"][i % 7]}
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how">
        <h2 className="section-title">Book your barber in <span className="accent">4 simple steps</span></h2>
        <p className="section-sub">A premium, hassle-free experience designed for modern life. No queues, no phone calls, just great hair.</p>

        <div className="steps-grid">
          <div className="swiggy-card" data-aos="fade-up">
            <div className="swiggy-img-box">
              <img src="/assets/img/guide/step1.png" className="swiggy-img" alt="Search" />
            </div>
            <div className="swiggy-pill">Find nearby barbers</div>
          </div>
          <div className="swiggy-card" data-aos="fade-up" data-aos-delay="100">
            <div className="swiggy-img-box">
              <img src="/assets/img/guide/step3.png" className="swiggy-img" alt="Booking" />
            </div>
            <div className="swiggy-pill">Pick your slot</div>
          </div>
          <div className="swiggy-card" data-aos="fade-up" data-aos-delay="200">
            <div className="swiggy-img-box">
              <img src="/assets/img/guide/step4.png" className="swiggy-img" alt="Service" />
            </div>
            <div className="swiggy-pill">Visit or Stay Home</div>
          </div>
          <div className="swiggy-card" data-aos="fade-up" data-aos-delay="300">
            <div className="swiggy-img-box">
              <img src="/assets/img/guide/step5.png" className="swiggy-img" alt="Quality" />
            </div>
            <div className="swiggy-pill">Verified Quality</div>
          </div>
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <button className="btn-gold" onClick={() => navigate('/how-it-works')}
            style={{ padding: '18px 48px', fontSize: '16px', borderRadius: '100px', fontWeight: '500', boxShadow: '0 10px 30px var(--gold-glow)' }}>
            Explore The Experience →
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2 className="section-title">Everything you need for a <span className="accent">great haircut</span></h2>
        <p className="section-sub">We built Trimzy because waiting at barbershops shouldn't be your problem anymore</p>
        <div className="features-grid">
          <div className="feat-card">
            <div className="feat-title">Real-time slot booking</div>
            <div className="feat-desc">See live availability and book a slot instantly No double bookings no surprises</div>
            <div className="feat-tag" style={{ background: 'rgba(232,164,74,.08)', color: 'var(--gold)' }}>Core Feature</div>
          </div>
          <div className="feat-card">
            <div className="feat-title">Home visit booking</div>
            <div className="feat-desc">Book a verified barber to come to your door Perfect for busy days or special occasions</div>
            <div className="feat-tag" style={{ background: 'rgba(232,164,74,.12)', color: 'var(--gold)' }}>Popular</div>
          </div>
          <div className="feat-card">
            <div className="feat-title">ID-verified barbers</div>
            <div className="feat-desc">Every barber on Trimzy is identity verified and background-checked Safe, always</div>
            <div className="feat-tag" style={{ background: 'rgba(52,211,153,.08)', color: 'var(--green)' }}>Trust & Safety</div>
          </div>
          <div className="feat-card">
            <div className="feat-title">UPI payments</div>
            <div className="feat-desc">Pay seamlessly via UPI after your cut No cash hassles, instant digital receipts</div>
          </div>
          <div className="feat-card">
            <div className="feat-title">Honest ratings</div>
            <div className="feat-desc">Real reviews from real customers Find the best barbers based on verified feedback</div>
          </div>
          <div className="feat-card">
            <div className="feat-title">Smart reminders</div>
            <div className="feat-desc">Get reminders before your appointment so you never miss your slot</div>
          </div>
        </div>
      </section>

      {/* FOR BARBERS TEASER */}
      <section className="barber-section">
        <h2 className="section-title">Grow your income with <span className="accent">Trimzy</span></h2>
        <p className="section-sub">Join 50+ barbers already growing their business on our platform Your chair, your schedule, your terms</p>
        <div className="barber-split">
          <div className="barber-visual">
            <div className="barber-visual-bg"></div>
            <div className="earnings-card">
              <div className="earnings-label">Monthly Earnings</div>
              <div className="earnings-value">₹<span>42,500</span></div>
              <div className="earnings-change">↑ +28% vs last month</div>
            </div>
            <div className="earnings-card">
              <div className="earnings-label">Bookings This Month</div>
              <div className="earnings-value"><span>186</span></div>
              <div className="earnings-change">↑ 9 bookings today</div>
            </div>
          </div>
          <div className="barber-perks">
            <div className="perk">
              <div className="perk-icon">📅</div>
              <div>
                <div className="perk-title">Manage your schedule</div>
                <div className="perk-desc">Set your own hours Block days off Accept or decline bookings You're in control</div>
              </div>
            </div>
            <div className="perk">
              <div className="perk-icon">💰</div>
              <div>
                <div className="perk-title">Direct UPI payouts</div>
                <div className="perk-desc">Payments go straight to your UPI ID No waiting, no middlemen</div>
              </div>
            </div>
            <div className="perk">
              <div className="perk-icon">📊</div>
              <div>
                <div className="perk-title">Growth analytics</div>
                <div className="perk-desc">Track your bookings, earnings and ratings from a simple dashboard</div>
              </div>
            </div>
            <button className="btn-gold" onClick={() => navigate('/for-barbers#barber-signup')}
              style={{ marginTop: '28px', padding: '16px 32px', fontSize: '15px', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
              Join as a Barber →
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial-section">
        <div className="testimonial-header">
          <h2 className="section-title">What our users say</h2>
          <p className="section-sub">Discover how thousands of users streamline their grooming appointments with our platform.</p>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-column" style={{ '--duration': '40s' }}>
            {[...col1Testimonials, ...col1Testimonials].map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>

          <div className="testimonial-column col-hide-mobile" style={{ '--duration': '55s' }}>
            {[...col2Testimonials, ...col2Testimonials].map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>

          <div className="testimonial-column col-hide-tablet" style={{ '--duration': '45s' }}>
            {[...col3Testimonials, ...col3Testimonials].map((item, i) => (
              <TestimonialCard key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="cities-section">
        <h2 className="section-title" style={{ color: '#fff', textAlign: 'center' }}>Live in <span className="accent">Bhubaneswar</span><br />Coming to your city next</h2>
        <div className="cities" style={{ justifyContent: 'center', marginTop: '28px' }}>
          <div className="city-badge active"> Bhubaneswar</div>
          <div className="city-badge">Cuttack</div>
          <div className="city-badge">Puri</div>
          <div className="city-badge">Rourkela</div>
          <div className="city-badge">Sambalpur</div>
          <div className="city-badge">Berhampur</div>
          <div className="city-badge">+ More Soon</div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="section-label" style={{ color: 'rgba(14,14,26,.4)', textAlign: 'center', justifyContent: 'center' }}>Get Started</div>
        <h2 className="cta-title">Ready for your best<br />haircut experience?</h2>
        <p className="cta-sub">Join thousands of customers and barbers already on Trimzy Free to use, always</p>
        <div className="cta-actions">
          <button className="btn-cta-dark" onClick={() => navigate('/app')}>Book a Barber Now</button>
          <button className="btn-cta-outline" onClick={() => navigate('/for-barbers#barber-signup')}>Join as a Barber</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
