import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BarberCard from '../components/BarberCard';
import '../../css/app.css'; // Make sure this is imported if required
const AppPageV2 = () => {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('rating');
  const [areaOption, setAreaOption] = useState('');
  const [serviceMode, setServiceMode] = useState('shop'); // 'shop' or 'home'
  
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);

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

  const fetchBarbers = async (lat, lng) => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/barbers?limit=50`;
      if (lat && lng) url += `&lat=${lat}&lng=${lng}`;
      if (serviceMode === 'home') url += `&homeVisit=true`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch barbers');
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setBarbers(data.data);
      } else {
        setBarbers([]);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load barbers at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch without location
    fetchBarbers();
  }, [serviceMode]); // re-fetch if mode changes

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...barbers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        (b.shopName && b.shopName.toLowerCase().includes(q)) ||
        (b.name && b.name.toLowerCase().includes(q)) ||
        (b.area && b.area.toLowerCase().includes(q))
      );
    }

    if (areaOption) {
      result = result.filter(b => b.area && b.area.includes(areaOption));
    }

    if (sortOption === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortOption === 'price-low') {
      result.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    }

    setFilteredBarbers(result);
  }, [barbers, searchQuery, sortOption, areaOption]);

  const handleBarberClick = (barber) => {
    navigate(`/barber-profile?id=${barber.uid || barber.id}`);
  };

  const handleLogout = async () => {
    import('../../js/firebase.js').then(({ auth }) => {
      import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js').then(({ signOut }) => {
        signOut(auth);
      });
    });
  };

  return (
    <div className="app-shell" style={{paddingTop: '80px', backgroundColor: '#f8fafc', minHeight: '100vh'}}>
      {/* Navbar Simulation */}
      <nav style={{position: 'fixed', top: 0, left: 0, right: 0, height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 5%', zIndex: 100, justifyContent: 'space-between'}}>
        <Link to="/" style={{textDecoration: 'none', fontWeight: 800, fontSize: '24px', color: '#0f172a'}}>Trim<span style={{color: '#E8A44A'}}>zy</span></Link>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
           {user ? (
             <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
               <span style={{fontSize: '14px', fontWeight: 600}}>Hi, {user.displayName?.split(' ')[0] || 'User'}</span>
               <button onClick={handleLogout} style={{background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer'}}>Log Out</button>
             </div>
           ) : (
             <button onClick={() => navigate('/auth?redirect=app')} style={{background: '#E8A44A', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer'}}>Log In</button>
           )}
        </div>
      </nav>

      <div className="app-header" style={{padding: '20px 5%'}}>
        <div className="app-search-row" id="search-bar" style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <input 
            type="text" 
            placeholder="Search barber or area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{flex: 1, minWidth: '200px', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0'}}
          />
          <select value={sortOption} onChange={e => setSortOption(e.target.value)} style={{padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white'}}>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
          <select value={areaOption} onChange={e => setAreaOption(e.target.value)} style={{padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white'}}>
            <option value="">All Areas</option>
            <option value="Saheed Nagar">Saheed Nagar</option>
            <option value="Bapuji Nagar">Bapuji Nagar</option>
            <option value="IRC Village">IRC Village</option>
            <option value="Patia">Patia</option>
            <option value="Nayapalli">Nayapalli</option>
            <option value="Kharvel Nagar">Kharvel Nagar</option>
          </select>
        </div>
      </div>

      <div className="app-body" style={{padding: '0 5% 50px 5%'}}>
        <div style={{marginBottom: '20px', fontWeight: 600, color: '#64748b'}}>{filteredBarbers.length} barbers found</div>
        
        {loading ? (
          <div style={{textAlign: 'center', padding: '50px', color: '#64748b'}}>Loading barbers...</div>
        ) : error ? (
          <div style={{textAlign: 'center', padding: '50px', color: '#ef4444'}}>{error}</div>
        ) : (
          <div className="barber-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
            {filteredBarbers.map(barber => (
              <BarberCard key={barber.uid || barber.id || Math.random()} barber={barber} onClick={handleBarberClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPageV2;
