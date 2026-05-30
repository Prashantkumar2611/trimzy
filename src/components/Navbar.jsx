import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const navLinksRef = useRef(null);

  const [highlighterStyle, setHighlighterStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    opacity: 0
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Sync user state from sessionStorage on mount and path changes
  useEffect(() => {
    const checkUser = () => {
      try {
        const userData = sessionStorage.getItem('ss_user');
        setUser(userData ? JSON.parse(userData) : null);
      } catch (err) {
        console.error('Navbar session read error:', err);
        setUser(null);
      }
    };
    
    checkUser();
    
    // Listen for storage updates
    window.addEventListener('storage', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
    };
  }, [location.pathname]);

  // Handle mobile menu scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // SlideTabs Pill Highlighter calculation
  const updateHighlighter = (element) => {
    if (!element || !navLinksRef.current) {
      setHighlighterStyle(prev => ({ ...prev, opacity: 0 }));
      return;
    }
    const rect = element.getBoundingClientRect();
    const parentRect = navLinksRef.current.getBoundingClientRect();

    setHighlighterStyle({
      width: rect.width,
      height: rect.height,
      left: rect.left - parentRect.left,
      top: rect.top - parentRect.top,
      opacity: 1
    });
  };

  // Trigger highlighter position on initial render and route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navLinksRef.current) {
        const activeLink = navLinksRef.current.querySelector('a.active');
        updateHighlighter(activeLink);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle active link highlighter mouse tracking
  const handleMouseEnter = (e) => {
    updateHighlighter(e.currentTarget);
  };

  const handleMouseLeave = () => {
    if (navLinksRef.current) {
      const activeLink = navLinksRef.current.querySelector('a.active');
      updateHighlighter(activeLink);
    }
  };

  const handleLogout = () => {
    if (typeof window.firebaseLogout === 'function') {
      window.firebaseLogout();
    } else {
      sessionStorage.removeItem('ss_user');
      setUser(null);
      setDropdownOpen(false);
      navigate('/');
    }
  };

  const activeClass = ({ isActive }) => isActive ? 'active' : '';

  const avatarSrc = user?.profilePic || user?.photoURL || `https://images.shadcnspace.com/assets/profiles/user-${Math.floor(Math.random() * 5) + 1}.jpg`;

  return (
    <>
      <nav>
        <NavLink to="/" className="nav-logo">Trim<span>zy</span></NavLink>
        <div 
          className="nav-links" 
          id="nav-pill" 
          ref={navLinksRef}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink to="/" end className={activeClass} onMouseEnter={handleMouseEnter}>Home</NavLink>
          <NavLink to="/how-it-works" className={activeClass} onMouseEnter={handleMouseEnter}>How It Works</NavLink>
          <NavLink to="/for-barbers" className={activeClass} onMouseEnter={handleMouseEnter}>For Barbers</NavLink>
          <NavLink to="/about" className={activeClass} onMouseEnter={handleMouseEnter}>About</NavLink>
          <div 
            className="nav-highlighter" 
            id="nav-highlighter"
            style={{
              width: `${highlighterStyle.width}px`,
              height: `${highlighterStyle.height}px`,
              left: `${highlighterStyle.left}px`,
              top: `${highlighterStyle.top}px`,
              opacity: highlighterStyle.opacity,
              display: highlighterStyle.opacity > 0 ? 'block' : 'none'
            }}
          ></div>
        </div>

        <div className="nav-cta">
          {user ? (
            <div className="nav-user" id="nav-user" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
                <div 
                  className="nav-user-avatar" 
                  id="nav-avatar-btn" 
                  title={user.name} 
                  style={{ overflow: 'hidden', border: 'none', padding: 0, background: 'none' }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img src={avatarSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <span style={{ position: 'absolute', right: '-2px', bottom: '-2px', display: 'flex', width: '16px', height: '16px', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'white', pointerEvents: 'none' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
              </div>
              <div className={`nav-user-menu ${dropdownOpen ? 'open' : ''}`} id="nav-user-menu">
                <div className="num-header">
                  <div className="num-name">{user.name}</div>
                  <div className="num-detail">{user.phone || user.email || ''}</div>
                </div>
                <div className="num-divider"></div>
                <NavLink className="num-item" to="/app?view=bookings" onClick={() => setDropdownOpen(false)}>My Bookings</NavLink>
                <NavLink className="num-item" to="/app" onClick={() => setDropdownOpen(false)}>Book a Barber</NavLink>
                <div className="num-divider"></div>
                <button className="num-item num-logout" onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          ) : (
            <button className="btn-outline" onClick={() => navigate('/auth?tab=login')}>Log In</button>
          )}
        </div>

        <button 
          className={`hamburger ${isOpen ? 'open' : ''}`} 
          id="hamburger" 
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`} id="mobile-menu">
        <NavLink to="/" end className={activeClass} onClick={toggleMenu}>Home</NavLink>
        <NavLink to="/how-it-works" className={activeClass} onClick={toggleMenu}>How It Works</NavLink>
        <NavLink to="/for-barbers" className={activeClass} onClick={toggleMenu}>For Barbers</NavLink>
        <NavLink to="/about" className={activeClass} onClick={toggleMenu}>About</NavLink>
        <div className="mobile-menu-btns">
          {user ? (
            <>
              <div style={{ textAlign: 'center', padding: '8px 0', fontFamily: "'Inter',sans-serif", fontSize: '15px', fontWeight: '700', color: 'var(--gold)' }}>{user.name}</div>
              <button className="btn-gold" style={{ width: '100%', marginBottom: '8px' }} onClick={() => { navigate('/app'); toggleMenu(); }}>Book a Barber</button>
              <button className="btn-outline" style={{ width: '100%' }} onClick={() => { handleLogout(); toggleMenu(); }}>Log Out</button>
            </>
          ) : (
            <button className="btn-outline" style={{ width: '100%' }} onClick={() => { navigate('/auth?tab=login'); toggleMenu(); }}>Log In</button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
