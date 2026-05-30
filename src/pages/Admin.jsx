import React, { useState, useEffect } from 'react';
import '../../css/admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('applications');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  // Example stats
  const stats = {
    total: '—',
    pending: '—',
    approved: '—',
    rejected: '—',
    bookings: '—',
    revenue: '—'
  };

  useEffect(() => {
    // Hide global loader after mount
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }, []);

  const handleLogin = () => {
    // Mock login logic
    if (password === 'admin123') { // This should ideally be a real check
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
  };

  return (
    <>
      {/* GLOBAL LOADER (Optional: managed globally or here) */}
      <div id="global-loader" className="global-loader" style={{ display: 'none' }}>
        <div className="gl-logo">Trim<span>zy</span></div>
        <div className="gl-blueprint"></div>
      </div>

      {!isLoggedIn ? (
        /* LOGIN SCREEN */
        <div className="login-screen" id="login-screen" style={{ display: 'flex' }}>
          <div className="login-box">
            <div className="login-logo">Trim<span>zy</span></div>
            <div className="login-sub">Admin Panel</div>
            <div className="login-title">🔐 Enter Admin Password</div>
            <input 
              className="login-input" 
              type="password" 
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button className="login-btn" onClick={handleLogin}>
              Access Dashboard →
            </button>
            {loginError && (
              <div className="login-error" style={{ display: 'block' }}>
                ❌ Wrong password. Try again.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ADMIN DASHBOARD */
        <div className="admin-shell" id="admin-shell" style={{ display: 'flex' }}>
          {/* Top bar */}
          <div className="admin-topbar">
            <div className="admin-logo">Trim<span>zy</span> <small>ADMIN</small></div>
            <div className="admin-topbar-right">
              <span className="admin-user">👋 Welcome, Admin</span>
              <button className="admin-logout" onClick={handleLogout}>Log Out</button>
            </div>
          </div>

          {/* Stats */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-num gold">{stats.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: 'var(--gold)' }}>{stats.pending}</div>
              <div className="stat-label">Pending Review</div>
            </div>
            <div className="stat-card">
              <div className="stat-num green">{stats.approved}</div>
              <div className="stat-label">Approved Barbers</div>
            </div>
            <div className="stat-card">
              <div className="stat-num red">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
            <div className="stat-card">
              <div className="stat-num blue">{stats.bookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: 'var(--green)' }}>{stats.revenue}</div>
              <div className="stat-label">Online Revenue</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button 
              className={`admin-tab ${activeTab === 'applications' ? 'active' : ''}`} 
              onClick={() => setActiveTab('applications')}
            >
              📋 Applications
            </button>
            <button 
              className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`} 
              onClick={() => setActiveTab('bookings')}
            >
              📅 All Bookings
            </button>
            <button 
              className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} 
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>

          {/* Content */}
          <div className="admin-content">
            {/* APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="admin-view active">
                <div className="filter-bar">
                  <input className="filter-search" type="text" placeholder=" Search by name, phone, area..." />
                  <select className="filter-select">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="filter-count">Showing <span>0</span> applications</div>
                  <button style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--navy)', cursor: 'pointer' }}>
                    Refresh
                  </button>
                </div>
                <div className="apps-grid">
                  <div className="admin-loading">
                    <div className="spin"></div>Loading applications...
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="admin-view active">
                <div className="filter-bar">
                  <input className="filter-search" type="text" placeholder=" Search bookings..." />
                  <select className="filter-select">
                    <option value="">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className="filter-count">Showing <span>0</span> bookings</div>
                  <button style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--navy)', cursor: 'pointer' }}>
                    Refresh
                  </button>
                </div>
                <div>
                  <div className="admin-loading">
                    <div className="spin"></div>Loading bookings...
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div className="admin-view active">
                <div className="filter-bar">
                  <input className="filter-search" type="text" placeholder=" Search users..." />
                  <div className="filter-count">Showing <span>0</span> users</div>
                  <button style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: 'var(--gold)', fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--navy)', cursor: 'pointer' }}>
                    Refresh
                  </button>
                </div>
                <div>
                  <div className="admin-loading">
                    <div className="spin"></div>Loading users...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPROVE MODAL */}
      {showApproveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,14,26,.8)', backdropFilter: 'blur(8px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '36px', maxWidth: '440px', width: '100%' }}>
            <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '20px', fontWeight: 800, color: 'var(--navy)', marginBottom: '6px' }}>
              Approve Barber ✅
            </div>
            <div style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '24px' }}>
              Set login email for <strong>Barber Name</strong>. An email with a password reset link will be sent to them.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)' }}>Login Email *</label>
              <input type="email" placeholder="barber@email.com" style={{ padding: '13px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', fontFamily: 'Inter,sans-serif', fontSize: '14px', color: 'var(--navy)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '13px', borderRadius: '10px', border: 'none', fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 500, color: '#fff', background: 'var(--green)', cursor: 'pointer' }}>
                ✓ Approve & Create Account
              </button>
              <button onClick={() => setShowApproveModal(false)} style={{ padding: '13px 20px', borderRadius: '10px', border: '1.5px solid var(--border)', fontFamily: 'Inter,sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--gray)', background: 'transparent', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
