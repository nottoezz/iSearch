import { useMemo } from 'react';

export default function RatingStars({ value = 0, onChange, average, count }) {
  const stars = useMemo(() => [1,2,3,4,5], []);

  return (
    <div className="rating">
      <div className="rating-row">
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${n <= (value || 0) ? 'on' : ''}`}
            aria-label={`Rate ${n} star${n>1?'s':''}`}
            onClick={() => onChange?.(n)}
          >
            ★
          </button>
        ))}
      </div>
      <div className="rating-meta">
        {typeof average === 'number'
          ? <>Average: <strong>{average.toFixed(1)}</strong> ({count ?? 0})</>
          : <span className="text-muted">No ratings yet</span>
        }
      </div>
    </div>
  );
}
