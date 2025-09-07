// client/src/components/ResultCard.jsx
export default function ResultCard({
  item,
  isFavourite = false,
  onSelect,
  onAdd,
  onRemove,
}) {
  // normalise shape (favourites wrap the item)
  const data = item?.item || item || {};

  // derive display fields with safe fallbacks
  const id = String(data.id ?? "");
  const img =
    data.artwork || "https://via.placeholder.com/1200x1200?text=No+Art";
  const title = data.title || data.trackName || "Untitled";
  const artist = data.artist || data.artistName || "Unknown";
  const date = data.releaseDate
    ? new Date(data.releaseDate).toISOString().slice(0, 10)
    : "";

  // pick any available external link field
  const href =
    data.linkUrl ||
    data.link ||
    data.trackViewUrl ||
    data.collectionViewUrl ||
    data.artistViewUrl ||
    null;

  return (
    // whole card is clickable to open details
    <div
      className="card h-100 result-card hoverable"
      onClick={() => onSelect?.(id)}
      role="button" // basic a11y hint
    >
      <img src={img} alt={title} className="media-portrait" />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{title}</h5>
        <div className="meta mb-2">
          {artist}
          {date && ` • ${date}`}
        </div>

        <div className="mt-auto d-flex gap-2">
          {/* open external page without triggering card click */}
          {href && (
            <a
              className="btn btn-outline-secondary btn-sm"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </a>
          )}

          {/* toggle favourite; stop propagation to avoid opening details */}
          {!isFavourite ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onAdd?.(data);
              }}
            >
              Add
            </button>
          ) : (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(id);
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
