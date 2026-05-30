import React from 'react';
import { Link } from 'react-router-dom';

const BarberCard = ({ barber, onClick }) => {
  const bName = barber.shopName || barber.name || 'Professional Barber';
  let bArea = barber.area || 'Bhubaneswar';
  if (barber.address && barber.address.street) {
    bArea = `${barber.address.street}, ${barber.address.city || ''}`.replace(/,\s*$/, "");
  }

  const profilePic = barber.profilePic || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop';
  
  let minPrice = 0;
  if (barber.services && Array.isArray(barber.services) && barber.services.length > 0) {
    minPrice = Math.min(...barber.services.map(s => Number(s.price) || 999999));
  }
  if (minPrice === 0 || minPrice === 999999) minPrice = barber.minPrice || 80;

  const rating = Number(barber.rating || 0);
  const hasReviews = (Number(barber.reviewCount) || 0) > 0;
  const isOpen = barber.isOpen !== false;

  return (
    <div className={`barber-card ${!isOpen ? 'closed' : ''}`} onClick={() => isOpen && onClick(barber)}>
      <div className="bc-inner" style={{ backgroundImage: `url('${profilePic}')` }}>
        <div className="bc-price-badge">₹{minPrice}+</div>
        {!isOpen && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', zIndex: 5, borderRadius: '24px'
          }}>
            <div style={{
              background: '#fff', padding: '6px 12px', borderRadius: '20px', 
              color: 'var(--navy)', fontWeight: 700, fontSize: '12px'
            }}>Closed</div>
          </div>
        )}
      </div>
      <div className="bc-info">
        <div className="bc-rating">{hasReviews ? `⭐ ${rating.toFixed(1)}` : '⭐ New'}</div>
        <div className="bc-name">{bName}</div>
        <div className="bc-loc">{bArea}</div>
      </div>
    </div>
  );
};

export default BarberCard;
