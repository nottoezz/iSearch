import { useMemo, useState } from "react";


export default function RatingStars({ value = 0, onChange, average, count }) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);
  const [hover, setHover] = useState(0);

  const level = hover || value || 0;
  const isOn = (n) => n <= (hover || value || 0);

  return (
    <div
      className={`rating${hover ? " hovering" : ""}`}
      data-level={level || undefined}
    >
      <div className="rating-row">
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${isOn(n) ? "on" : ""}`}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(n)}
          >
            ★
          </button>
        ))}
      </div>

      <div className="rating-meta">
        {typeof average === "number" ? (
          <>
            Average: <strong>{average.toFixed(1)}</strong> ({count ?? 0})
          </>
        ) : (
          <span className="text-muted">No ratings yet</span>
        )}
      </div>
    </div>
  );
}
