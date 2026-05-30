import React, { useState } from 'react';

const DashboardServices = ({ token, barber, onProfileUpdate }) => {
  const [services, setServices] = useState(barber?.services || []);
  const [loading, setLoading] = useState(false);
  
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceTime, setNewServiceTime] = useState('30 mins');

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    
    const newService = {
      name: newServiceName,
      price: Number(newServicePrice),
      time: newServiceTime
    };
    
    setServices([...services, newService]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleRemoveService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = import.meta.env.VITE_API_URL;
      const res = await fetch(`${url}/barbers/profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ services })
      });
      const data = await res.json();
      if (data.success) {
        alert('Services updated successfully!');
        if (onProfileUpdate) onProfileUpdate(data.barber);
      } else {
        alert(data.message || "Failed to update services");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving services");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: '800px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Manage Services</h2>
        <button onClick={handleSave} disabled={loading} style={{padding: '10px 20px', background: '#000', color: 'white', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer'}}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div style={{background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px'}}>
        <h3 style={{fontSize: '18px', fontWeight: 600, marginBottom: '15px'}}>Add New Service</h3>
        <form onSubmit={handleAddService} style={{display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 200px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>Service Name</label>
            <input type="text" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="e.g. Premium Haircut" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
          </div>
          <div style={{flex: '1 1 100px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>Price (₹)</label>
            <input type="number" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} placeholder="150" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} required />
          </div>
          <div style={{flex: '1 1 100px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '5px'}}>Duration</label>
            <select value={newServiceTime} onChange={e => setNewServiceTime(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}}>
              <option value="15 mins">15 mins</option>
              <option value="30 mins">30 mins</option>
              <option value="45 mins">45 mins</option>
              <option value="60 mins">1 hr</option>
            </select>
          </div>
          <button type="submit" style={{padding: '10px 20px', background: '#E8A44A', color: 'white', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer', height: '40px'}}>
            Add
          </button>
        </form>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        {services.map((svc, i) => (
          <div key={i} style={{background: 'white', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontWeight: 700, fontSize: '16px', color: '#0f172a'}}>{svc.name}</div>
              <div style={{color: '#64748b', fontSize: '14px'}}>Duration: {svc.time}</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <div style={{fontWeight: 700, fontSize: '16px'}}>₹{svc.price}</div>
              <button onClick={() => handleRemoveService(i)} style={{background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>Remove</button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div style={{padding: '30px', textAlign: 'center', color: '#64748b', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1'}}>
            No services added yet. Add your first service above!
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardServices;
