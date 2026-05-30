import React, { useState } from 'react';

const DashboardProfile = ({ token, barber, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    name: barber?.name || '',
    shopName: barber?.shopName || '',
    about: barber?.about || '',
    address: {
      street: barber?.address?.street || '',
      city: barber?.address?.city || '',
      state: barber?.address?.state || '',
      pincode: barber?.address?.pincode || ''
    },
    upiId: barber?.upiId || '',
    status: barber?.status || 'offline'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'pincode'].includes(name)) {
      setProfile(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const url = import.meta.env.VITE_API_URL;
      const res = await fetch(`${url}/barbers/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Profile updated successfully!');
        if (onProfileUpdate) onProfileUpdate(data.barber);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: '800px'}}>
      <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>My Shop Profile</h2>
      
      {success && <div style={{background: '#dcfce7', color: '#166534', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>{success}</div>}

      <form onSubmit={handleSave} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        
        <div style={{background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
          <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '15px'}}>Basic Details</h3>
          <div style={{display: 'grid', gap: '15px'}}>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>Shop Name</label>
              <input type="text" name="shopName" value={profile.shopName} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>Your Name</label>
              <input type="text" name="name" value={profile.name} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>About</label>
              <textarea name="about" value={profile.about} onChange={handleChange} rows="3" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1'}}></textarea>
            </div>
          </div>
        </div>

        <div style={{background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
          <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '15px'}}>Location</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div style={{gridColumn: '1/-1'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>Street / Area</label>
              <input type="text" name="street" value={profile.address.street} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>City</label>
              <input type="text" name="city" value={profile.address.city} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>Pincode</label>
              <input type="text" name="pincode" value={profile.address.pincode} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
            </div>
          </div>
        </div>

        <div style={{background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
          <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '15px'}}>Payments</h3>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>UPI ID</label>
            <input type="text" name="upiId" value={profile.upiId} onChange={handleChange} placeholder="yourname@upi" style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{padding: '16px', background: '#E8A44A', color: 'white', fontWeight: 'bold', fontSize: '16px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer'}}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>

      </form>
    </div>
  );
};

export default DashboardProfile;
