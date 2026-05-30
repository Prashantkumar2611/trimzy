import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardAppointments from '../components/dashboard/DashboardAppointments';
import DashboardProfile from '../components/dashboard/DashboardProfile';
import DashboardServices from '../components/dashboard/DashboardServices';
import '../../css/barber-dashboard.css';

const BarberDashboardV2 = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    let unsubscribe;
    import('../../js/firebase.js').then(({ auth }) => {
      import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js').then(({ onAuthStateChanged, signOut }) => {
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            try {
              const t = await currentUser.getIdToken(true);
              setToken(t);
              await fetchBarberProfile(t);
            } catch (err) {
              console.error(err);
              setLoading(false);
            }
          } else {
            navigate('/barber-login');
          }
        });
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const fetchBarberProfile = async (authToken) => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const res = await fetch(`${url}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.barber) {
          setBarber(data.barber);
          setIsOnline(data.barber.status === 'online');
          // If no name or shopName, force them to profile setup (wizard equivalent)
          if (!data.barber.name || !data.barber.shopName) {
            setActiveTab('profile');
          }
        } else {
          // New barber, force profile setup
          setActiveTab('profile');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = isOnline ? 'offline' : 'online';
    setIsOnline(!isOnline);
    try {
      const url = import.meta.env.VITE_API_URL;
      await fetch(`${url}/barbers/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    import('../../js/firebase.js').then(({ auth }) => {
      import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js').then(({ signOut }) => {
        signOut(auth).then(() => navigate('/barber-login'));
      });
    });
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Dashboard...</div>;

  const NavItem = ({ id, icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', borderRadius: '12px',
        border: 'none', background: activeTab === id ? '#FFF8ED' : 'transparent',
        color: activeTab === id ? '#E8A44A' : '#64748b', fontWeight: activeTab === id ? 700 : 500,
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
      }}
    >
      <span style={{fontSize: '18px'}}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div style={{display: 'flex', height: '100vh', background: '#f8fafc', overflow: 'hidden'}}>
      
      {/* Sidebar Desktop */}
      <aside style={{width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column'}}>
        <div style={{padding: '24px', borderBottom: '1px solid #e2e8f0'}}>
          <Link to="/" style={{textDecoration: 'none', fontSize: '24px', fontWeight: 900, color: '#0f172a'}}>
            Trim<span style={{color: '#E8A44A'}}>zy</span>
          </Link>
          <div style={{fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', letterSpacing: '1px'}}>Partner Portal</div>
        </div>

        {/* Barber Mini Profile */}
        <div style={{padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={{width: '50px', height: '50px', borderRadius: '25px', background: '#FFF8ED', border: '2px solid #E8A44A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#E8A44A'}}>
            {barber?.shopName ? barber.shopName[0] : '?'}
          </div>
          <div>
            <div style={{fontWeight: 700, color: '#0f172a', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px'}}>{barber?.shopName || 'Setup Profile'}</div>
            <div style={{fontSize: '12px', color: '#64748b'}}>★ {barber?.rating || 'New'}</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <NavItem id="dashboard" icon="📊" label="Dashboard" />
          <NavItem id="appointments" icon="📅" label="Appointments" />
          <NavItem id="services" icon="✂️" label="Services" />
          <NavItem id="profile" icon="🏪" label="My Shop" />
        </nav>

        {/* Status Toggle */}
        <div style={{padding: '20px', borderTop: '1px solid #e2e8f0'}}>
          <div style={{background: '#f1f5f9', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a'}}>Accepting Bookings</div>
              <div style={{fontSize: '10px', color: '#64748b'}}>Customers can find you</div>
            </div>
            <label style={{position: 'relative', display: 'inline-block', width: '44px', height: '24px'}}>
              <input type="checkbox" checked={isOnline} onChange={toggleStatus} style={{opacity: 0, width: 0, height: 0}} />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: isOnline ? '#10b981' : '#cbd5e1', borderRadius: '24px', transition: '0.4s'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px', 
                  backgroundColor: 'white', borderRadius: '50%', transition: '0.4s', 
                  transform: isOnline ? 'translateX(20px)' : 'translateX(0)'
                }}></span>
              </span>
            </label>
          </div>
          
          <button onClick={handleLogout} style={{width: '100%', marginTop: '15px', padding: '12px', background: 'transparent', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer'}}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{flex: 1, overflowY: 'auto', padding: '40px', background: '#f8fafc'}}>
        
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '20px'}}>Welcome back, {barber?.name || 'Partner'}!</h2>
            <div style={{display: 'flex', gap: '20px'}}>
              <div style={{flex: 1, background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'}}>
                <div style={{color: '#64748b', fontSize: '14px', fontWeight: 600}}>Total Earnings</div>
                <div style={{fontSize: '32px', fontWeight: 800, color: '#0f172a', marginTop: '10px'}}>₹{barber?.earnings || 0}</div>
              </div>
              <div style={{flex: 1, background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'}}>
                <div style={{color: '#64748b', fontSize: '14px', fontWeight: 600}}>Total Bookings</div>
                <div style={{fontSize: '32px', fontWeight: 800, color: '#0f172a', marginTop: '10px'}}>{barber?.bookingCount || 0}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <DashboardAppointments token={token} barber={barber} />
        )}

        {activeTab === 'services' && (
          <DashboardServices token={token} barber={barber} onProfileUpdate={setBarber} />
        )}

        {activeTab === 'profile' && (
          <DashboardProfile token={token} barber={barber} onProfileUpdate={setBarber} />
        )}

      </main>

    </div>
  );
};

export default BarberDashboardV2;
