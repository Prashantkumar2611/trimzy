import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import BookingSidebar from '../components/BookingSidebar';
import BarberReviews from '../components/BarberReviews';
import '../../css/barber-profile.css';

const BarberProfileV2 = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const barberId = searchParams.get('id');

  const [barber, setBarber] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribe;
    import('../../js/firebase.js').then(({ auth }) => {
      import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js').then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
      });
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!barberId) {
      setError("No barber ID provided.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const url = import.meta.env.VITE_API_URL;
        
        // Fetch Barber
        const bRes = await fetch(`${url}/barbers/${barberId}`);
        if (!bRes.ok) throw new Error("Barber not found");
        const bData = await bRes.json();
        if (bData.success) {
          setBarber(bData.barber);
        }

        // Fetch Reviews
        const rRes = await fetch(`${url}/reviews/barber/${barberId}`);
        if (rRes.ok) {
          const rData = await rRes.json();
          setReviews(rData.reviews || []);
        }

      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [barberId]);

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading Barber Profile...</div>;
  if (error || !barber) return <div style={{padding: '100px', textAlign: 'center', color: 'red'}}>{error || "Barber not found"}</div>;

  const bName = barber.shopName || barber.name || 'Professional Barber';
  const profilePic = barber.profilePic || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop';
  
  let bArea = barber.area || 'Bhubaneswar';
  if (barber.address && barber.address.street) {
    bArea = `${barber.address.street}, ${barber.address.city || ''}`;
  }

  return (
    <div style={{background: '#f8fafc', minHeight: '100vh'}}>
      {/* Navbar Simulation */}
      <nav style={{position: 'fixed', top: 0, left: 0, right: 0, height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 5%', zIndex: 100, justifyContent: 'space-between'}}>
        <Link to="/" style={{textDecoration: 'none', fontWeight: 800, fontSize: '24px', color: '#0f172a'}}>Trim<span style={{color: '#E8A44A'}}>zy</span></Link>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
          <Link to="/app" style={{textDecoration: 'none', color: '#64748b', fontWeight: 600}}>Browse Barbers</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{marginTop: '70px', height: '300px', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url('${profilePic}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px) brightness(0.6)'}}></div>
        <div style={{position: 'absolute', bottom: '40px', left: '5%', right: '5%', display: 'flex', gap: '20px', alignItems: 'flex-end', zIndex: 10}}>
          <div style={{width: '120px', height: '120px', borderRadius: '24px', border: '4px solid white', backgroundImage: `url('${profilePic}')`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}></div>
          <div style={{color: 'white'}}>
            <h1 style={{fontSize: '32px', margin: '0 0 5px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>{bName}</h1>
            <div style={{fontSize: '16px', fontWeight: 500, display: 'flex', gap: '10px', alignItems: 'center'}}>
              <span>📍 {bArea}</span>
              <span>⭐ {barber.rating || 'New'} ({reviews.length} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: '40px', padding: '40px 5%', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap'}}>
        
        {/* Left Column (Content) */}
        <div style={{flex: '1 1 600px'}}>
          <div style={{background: 'white', padding: '30px', borderRadius: '24px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'}}>
            <h3 style={{fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px'}}>About</h3>
            <p style={{color: '#475569', lineHeight: '1.6'}}>{barber.about || "This barber hasn't provided a description yet, but they are verified by Trimzy."}</p>
          </div>

          <div style={{background: 'white', padding: '30px', borderRadius: '24px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'}}>
            <h3 style={{fontSize: '20px', marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px'}}>Ratings & Reviews</h3>
            <BarberReviews reviews={reviews} />
          </div>
        </div>

        {/* Right Column (Booking Sidebar) */}
        <div style={{flex: '0 0 400px'}}>
          <BookingSidebar barber={barber} user={user} openAuthModal={() => navigate('/auth?redirect=barber-profile?id=' + barberId)} />
        </div>
      </div>

    </div>
  );
};

export default BarberProfileV2;
