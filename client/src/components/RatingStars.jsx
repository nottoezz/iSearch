import { useMemo, useState } from "react";

// simple interactive 5-star rating with hover + average display
export default function RatingStars({ value = 0, onChange, average, count }) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], []); // fixed star slots
  const [hover, setHover] = useState(0); // current hover level (0 = none)

  const level = hover || value || 0; // drives color via css data-level
  const isOn = (n) => n <= (hover || value || 0); // star is lit if <= current level

  return (
    <div
      className={`rating${hover ? " hovering" : ""}`} // add class while hovering
      data-level={level || undefined} // used by css to pick color
    >
      <div className="rating-row">
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${isOn(n) ? "on" : ""}`} // lit vs dim state
            aria-label={`rate ${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)} // preview this value
            onMouseLeave={() => setHover(0)} // clear preview
            onClick={() => onChange?.(n)} // send selection up
          >
            ★
          </button>
        ))}
      </div>

      <div className="rating-meta">
        {typeof average === "number" ? (
          <>
            average: <strong>{average.toFixed(1)}</strong> ({count ?? 0})
          </>
        ) : (
          <span className="text-muted">no ratings yet</span>
        )}
      </div>
    </div>
  );
}
