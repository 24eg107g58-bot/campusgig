import React from 'react';

export default function Badge({ status, type = 'status' }) {
  if (!status) return null;

  let colorClass = 'badge-secondary';
  const s = status.toUpperCase();

  if (s === 'OPEN' || s === 'ACTIVE' || s === 'ACCEPTED' || s === 'COMPLETED') {
    colorClass = 'badge-success';
  } else if (s === 'PENDING' || s === 'IN_PROGRESS') {
    colorClass = 'badge-warning';
  } else if (s === 'REJECTED' || s === 'CLOSED' || s === 'CANCELLED') {
    colorClass = 'badge-danger';
  }

  return (
    <span className={`badge ${colorClass}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
