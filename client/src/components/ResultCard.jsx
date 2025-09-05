export default function ResultCard({
  item,
  onAdd,
  onRemove,
  isFavourite = false,
}) {
  const data = item.item || item; // support { item: {...} } or plain {...}
  const img = data.artwork || "https://via.placeholder.com/600x600?text=No+Art";
  const title = data.title || data.trackName || "Untitled";
  const artist = data.artist || "Unknown";
  const date = data.releaseDate
    ? new Date(data.releaseDate).toISOString().slice(0, 10)
    : "";

  return (
    <div className="card h-100 result-card">
      <img src={img} className="card-img-top" alt={title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{title}</h5>
        <div className="meta mb-2">
          {artist}
          {date && ` • ${date}`}
        </div>
        <div className="mt-auto d-flex gap-2">
          {data.linkUrl && (
            <a
              className="btn btn-outline-secondary btn-sm"
              href={data.linkUrl}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          )}

          {!isFavourite ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onAdd?.(data)}
            >
              Add to favourites
            </button>
          ) : (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onRemove?.(String(data.id))}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
