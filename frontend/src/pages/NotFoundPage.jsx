import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#EEF2FF',
          color: '#4F46E5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Compass size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
          404 - Not Found
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '2rem' }}>
          The page or project listing you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Homepage
        </Link>
      </div>
    </div>
  );
}
