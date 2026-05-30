import React, { useState, useEffect } from 'react';

const DashboardAppointments = ({ token, barber }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [verifyingId, setVerifyingId] = useState(null);
  const [pin, setPin] = useState('');
  
  useEffect(() => {
    fetchBookings();
  }, [token]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const url = import.meta.env.VITE_API_URL;
      const res = await fetch(`${url}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const res = await fetch(`${url}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(bookings.map(b => b._id === id ? { ...b, status: status } : b));
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  const handleVerifyPin = async (id) => {
    try {
      const url = import.meta.env.VITE_API_URL;
      const res = await fetch(`${url}/bookings/${id}/verify-pin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (data.success) {
        alert("PIN verified! Service started.");
        setVerifyingId(null);
        setPin('');
        handleUpdateStatus(id, 'completed'); // Mocking start/complete flow
      } else {
        alert(data.message || "Invalid PIN");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying PIN");
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (bookings.length === 0) return <div>No bookings found.</div>;

  return (
    <div>
      <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '20px'}}>Appointments</h2>
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        {bookings.map(b => (
          <div key={b._id} style={{background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
              <div>
                <h3 style={{fontWeight: 700, fontSize: '18px'}}>{b.serviceName || 'Haircut'}</h3>
                <div style={{color: '#64748b', fontSize: '14px'}}>
                  {b.scheduledAt || 'Queue'} • Customer: {b.customerPhone || b.customerName || 'Anonymous'}
                </div>
              </div>
              <div>
                <span style={{
                  padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase',
                  background: b.status === 'completed' ? '#dcfce7' : (b.status === 'cancelled' ? '#fee2e2' : '#fef9c3'),
                  color: b.status === 'completed' ? '#166534' : (b.status === 'cancelled' ? '#991b1b' : '#854d0e')
                }}>
                  {b.status}
                </span>
              </div>
            </div>
            
            {b.status === 'pending' && (
              <div style={{marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center'}}>
                {verifyingId === b._id ? (
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input 
                      type="text" 
                      placeholder="Enter 4-digit PIN" 
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={4}
                      style={{padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '150px'}}
                    />
                    <button onClick={() => handleVerifyPin(b._id)} style={{background: '#000', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>Verify</button>
                    <button onClick={() => setVerifyingId(null)} style={{background: '#f1f5f9', color: '#64748b', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setVerifyingId(b._id)} style={{background: '#000', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer'}}>
                      Start Service (Ask PIN)
                    </button>
                    <button onClick={() => handleUpdateStatus(b._id, 'cancelled')} style={{background: '#fee2e2', color: '#991b1b', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer'}}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAppointments;
