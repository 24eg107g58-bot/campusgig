import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is nothing to display here yet.',
  actionLabel,
  onAction
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      background: '#ffffff',
      border: '1px dashed #CBD5E1',
      borderRadius: '16px',
      margin: '1.5rem 0'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#EEF2FF',
        color: '#4F46E5',
        marginBottom: '1rem'
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ color: '#64748B', fontSize: '0.925rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
