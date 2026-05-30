import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingSidebar = ({ barber, user, openAuthModal }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.displayName || '',
    phone: '',
    email: user?.email || '',
    notes: '',
    address: ''
  });
  
  const [paymentMode, setPaymentMode] = useState('cash'); // 'upi', 'card', 'cash'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // 1. Generate Next 7 Days
  useEffect(() => {
    const nextDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const dateNum = d.getDate();
      
      nextDays.push({
        value: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
        displayFull: `${dayName}, ${dateNum} ${month}`,
        dayName, dateNum, month
      });
    }
    setDates(nextDays);
    if(nextDays.length > 0) setSelectedDate(nextDays[0].value);
  }, []);

  // 2. Generate Slots
  useEffect(() => {
    if (!selectedDate) return;
    
    // In a real app we'd fetch booked slots from the backend here.
    // For now, we generate 30 min intervals between 9 AM and 9 PM
    const generatedSlots = [];
    let startMin = 9 * 60; // 9:00 AM
    let endMin = 21 * 60; // 9:00 PM
    
    // Simple parsing from barber object if they have custom hours
    // (Skipped complex parsing for brevity, defaulting to standard hours)
    
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
    
    for (let m = startMin; m < endMin; m += 30) {
      if (isToday && m < nowMins + 15) continue; // Must be at least 15 min in future today
      
      const hh = Math.floor(m / 60);
      const mm = String(m % 60).padStart(2, '0');
      const ampm = hh >= 12 ? 'PM' : 'AM';
      const h12 = hh % 12 || 12;
      generatedSlots.push(`${h12}:${mm} ${ampm}`);
    }
    
    setSlots(generatedSlots);
    setSelectedSlot('');
  }, [selectedDate]);

  const handleBooking = async () => {
    if (!user) {
      alert("Please login to complete your booking.");
      if (openAuthModal) openAuthModal();
      return;
    }
    
    setLoading(true);
    try {
      import('../../js/firebase.js').then(async ({ auth }) => {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("Unauthenticated");
        
        const token = await currentUser.getIdToken(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            barberId: barber.uid || barber.id || barber._id,
            serviceName: selectedService.name,
            mode: 'shop', // Assuming shop mode for now
            scheduledAt: selectedDate + ' ' + selectedSlot,
            customerPhone: customerInfo.phone,
            notes: customerInfo.notes,
            address: null
          })
        });
        
        const data = await res.json();
        if (data.success) {
          setBookingId(data.booking._id || data.booking.id);
          setSuccess(true);
        } else {
          alert("Error: " + data.message);
        }
      });
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="book-card" style={{padding: '30px', textAlign: 'center'}}>
        <div style={{fontSize: '50px', color: '#10b981', marginBottom: '10px'}}>✓</div>
        <h3 style={{fontFamily: "'Sora', sans-serif", fontSize: '24px', color: '#0f172a', marginBottom: '10px'}}>Booking Confirmed!</h3>
        <p style={{color: '#64748b', marginBottom: '20px'}}>ID: {bookingId}</p>
        <button onClick={() => navigate('/app')} style={{width: '100%', padding: '14px', borderRadius: '12px', background: '#000', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', marginBottom: '10px'}}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="book-card" style={{background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'sticky', top: '100px'}}>
      
      {/* Header Tabs */}
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px'}}>
        <div style={{fontWeight: step === 1 ? 700 : 500, color: step === 1 ? '#000' : '#94a3b8', cursor: 'pointer'}} onClick={() => step > 1 && setStep(1)}>1. Service</div>
        <div style={{color: '#e2e8f0'}}>&gt;</div>
        <div style={{fontWeight: step === 2 ? 700 : 500, color: step === 2 ? '#000' : '#94a3b8', cursor: 'pointer'}} onClick={() => step > 2 && setStep(2)}>2. Time</div>
        <div style={{color: '#e2e8f0'}}>&gt;</div>
        <div style={{fontWeight: step === 3 ? 700 : 500, color: step === 3 ? '#000' : '#94a3b8'}}>3. Details</div>
      </div>

      {/* STEP 1: SERVICE */}
      {step === 1 && (
        <div>
          <h4 style={{marginBottom: '15px'}}>Choose a service</h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {barber?.services?.map((svc, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedService(svc)}
                style={{
                  padding: '16px', borderRadius: '12px', border: selectedService?.name === svc.name ? '2px solid #E8A44A' : '1px solid #e2e8f0', 
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedService?.name === svc.name ? '#FFF8ED' : '#fff'
                }}
              >
                <div>
                  <div style={{fontWeight: 600, color: '#0f172a'}}>{svc.name}</div>
                  <div style={{fontSize: '12px', color: '#64748b'}}>{svc.time || '30 mins'}</div>
                </div>
                <div style={{fontWeight: 700, color: '#0f172a'}}>₹{svc.price}</div>
              </div>
            ))}
            {(!barber?.services || barber.services.length === 0) && (
              <div style={{color: '#ef4444'}}>No services listed for this barber.</div>
            )}
          </div>
          <button 
            disabled={!selectedService}
            onClick={() => setStep(2)}
            style={{width: '100%', marginTop: '20px', padding: '16px', borderRadius: '12px', background: selectedService ? '#000' : '#e2e8f0', color: selectedService ? '#fff' : '#94a3b8', fontWeight: 600, border: 'none', cursor: selectedService ? 'pointer' : 'not-allowed'}}
          >
            Next: Date & Time
          </button>
        </div>
      )}

      {/* STEP 2: DATE & TIME */}
      {step === 2 && (
        <div>
          <h4 style={{marginBottom: '10px'}}>Select Date</h4>
          <div style={{display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px', marginBottom: '20px'}}>
            {dates.map((d, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedDate(d.value)}
                style={{
                  flexShrink: 0, padding: '10px 16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                  border: selectedDate === d.value ? '2px solid #E8A44A' : '1px solid #e2e8f0',
                  background: selectedDate === d.value ? '#FFF8ED' : '#fff'
                }}
              >
                <div style={{fontSize: '12px', color: selectedDate === d.value ? '#E8A44A' : '#64748b', fontWeight: 600}}>{d.dayName}</div>
                <div style={{fontSize: '20px', color: '#0f172a', fontWeight: 700}}>{d.dateNum}</div>
              </div>
            ))}
          </div>

          <h4 style={{marginBottom: '10px'}}>Available Slots</h4>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px'}}>
            {slots.length > 0 ? slots.map((s, i) => (
              <div 
                key={i}
                onClick={() => setSelectedSlot(s)}
                style={{
                  padding: '10px', textAlign: 'center', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  background: selectedSlot === s ? '#000' : '#f8fafc',
                  color: selectedSlot === s ? '#fff' : '#334155',
                  border: selectedSlot === s ? 'none' : '1px solid #e2e8f0'
                }}
              >
                {s}
              </div>
            )) : (
              <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#ef4444'}}>No slots available for this date.</div>
            )}
          </div>
          
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => setStep(1)} style={{padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer'}}>Back</button>
            <button 
              disabled={!selectedSlot}
              onClick={() => setStep(3)}
              style={{flex: 1, padding: '16px', borderRadius: '12px', background: selectedSlot ? '#000' : '#e2e8f0', color: selectedSlot ? '#fff' : '#94a3b8', fontWeight: 600, border: 'none', cursor: selectedSlot ? 'pointer' : 'not-allowed'}}
            >
              Review Details
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS */}
      {step === 3 && (
        <div>
          <div style={{background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '20px'}}>
            <div style={{fontWeight: 700, marginBottom: '8px', color: '#0f172a'}}>Booking Summary</div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px'}}>
              <span style={{color: '#64748b'}}>Service</span>
              <span style={{fontWeight: 600}}>{selectedService?.name}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px'}}>
              <span style={{color: '#64748b'}}>Date</span>
              <span style={{fontWeight: 600}}>{selectedDate} at {selectedSlot}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0'}}>
              <span style={{fontWeight: 700, color: '#0f172a'}}>Total</span>
              <span style={{fontWeight: 700, color: '#0f172a'}}>₹{selectedService?.price}</span>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px'}}>
            <input type="text" placeholder="Your Name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} style={{padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
            <input type="tel" placeholder="Phone Number *" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} style={{padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0'}} required />
            <input type="text" placeholder="Notes for barber (Optional)" value={customerInfo.notes} onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})} style={{padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => setStep(2)} style={{padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 600, cursor: 'pointer'}}>Back</button>
            <button 
              disabled={loading || !customerInfo.phone}
              onClick={handleBooking}
              style={{flex: 1, padding: '16px', borderRadius: '12px', background: '#E8A44A', color: '#fff', fontWeight: 700, border: 'none', cursor: (loading || !customerInfo.phone) ? 'not-allowed' : 'pointer'}}
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingSidebar;
