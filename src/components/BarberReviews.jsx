import React from 'react';

const BarberReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bp-no-reviews" style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>
        No ratings yet
      </div>
    );
  }

  return (
    <div className="reviews-masonry" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px'}}>
      {reviews.map((rev, i) => (
        <div key={i} className="review-card" style={{padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9'}}>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px'}}>
            <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#334155'}}>
              {(rev.customerName || 'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{fontWeight: 600, color: '#0f172a', fontSize: '14px'}}>{rev.customerName || 'Anonymous'}</div>
              <div style={{color: '#64748b', fontSize: '12px'}}>{new Date(rev.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{marginLeft: 'auto', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: '20px', color: '#f59e0b', fontWeight: 600, fontSize: '12px'}}>
              ★ {rev.rating}
            </div>
          </div>
          {rev.comment && (
            <div style={{color: '#334155', fontSize: '14px', lineHeight: '1.5'}}>
              "{rev.comment}"
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BarberReviews;
