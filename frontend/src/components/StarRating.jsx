import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, max = 5, size = 16, interactive = false, onRatingChange }) {
  const numRating = Number(rating) || 0;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= Math.round(numRating);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            style={{
              padding: 0,
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              display: 'inline-flex',
            }}
          >
            <Star
              size={size}
              fill={filled ? '#FBBF24' : 'transparent'}
              color={filled ? '#F59E0B' : '#CBD5E1'}
            />
          </button>
        );
      })}
      {numRating > 0 && !interactive && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px', color: '#475569' }}>
          {numRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
