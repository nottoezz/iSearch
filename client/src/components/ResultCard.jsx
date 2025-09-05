export default function ResultCard({ item, onAdd }) {
  const img = item.artwork || "https://via.placeholder.com/300x300?text=No+Art";
  const title = item.title || item.trackName || "Untitled";
  const artist = item.artist || "Unknown";
  const date = item.releaseDate
    ? new Date(item.releaseDate).toISOString().slice(0, 10)
    : "";

  return (
    <div className="card h-100 shadow-soft">
      <img
        src={img}
        className="card-img-top"
        alt={title}
        style={{ objectFit: "cover", height: 180 }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1">{title}</h6>
        <div className="text-muted small mb-2">{artist}</div>
        {date && <div className="text-muted small mb-3">Release: {date}</div>}
        <div className="mt-auto d-flex gap-2">
          <a
            className="btn btn-outline-secondary btn-sm"
            href={item.linkUrl || "#"}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAdd(item)}
          >
            Add to favourites
          </button>
        </div>
      </div>
    </div>
  );
}
