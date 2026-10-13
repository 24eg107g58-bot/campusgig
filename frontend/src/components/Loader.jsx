import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid #E2E8F0',
        borderTopColor: '#4F46E5',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {message && <p style={{ marginTop: '0.85rem', color: '#64748B', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>}
    </div>
  );
}
