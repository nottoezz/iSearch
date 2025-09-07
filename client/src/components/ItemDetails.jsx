import RatingStars from "./RatingStars";

export default function ItemDetails({
  item,
  isFavourite,
  onAdd,
  onRemove,
  rating,
  onRate,
  onClose,
}) {
  // normalise incoming shape (favourite rows wrap item)
  const data = item.item || item;

  // derive safe fields for display
  const id = String(data.id);
  const title = data.title || data.trackName || "Untitled";
  const artist = data.artist || data.artistName || "Unknown";
  const date = data.releaseDate
    ? new Date(data.releaseDate).toISOString().slice(0, 10)
    : "";
  const img =
    data.artwork || "https://via.placeholder.com/1200x1200?text=No+Art";
  const description =
    data.longDescription || data.description || data.shortDescription || "";
  const authors =
    data.author || data.authors || data.artistName || data.artist || "";

  return (
    <div className="card details-panel">
      <div className="details-grid">
        {/* image */}
        <div className="details-media">
          <img src={img} alt={title} className="media-portrait tall" />
        </div>

        {/* info */}
        <div className="details-info">
          {/* title + meta + close */}
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div>
              <h4 className="mb-1">{title}</h4>
              <div className="meta mb-2">
                {artist}
                {date && ` • ${date}`}
              </div>
            </div>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          {/* actions */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {data.linkUrl && (
              <a
                className="btn btn-outline-secondary"
                href={data.linkUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Link
              </a>
            )}

            {!isFavourite ? (
              <button className="btn btn-primary" onClick={() => onAdd?.(data)}>
                Add to favourites
              </button>
            ) : (
              <button
                className="btn btn-outline-danger"
                onClick={() => onRemove?.(id)}
              >
                Remove from favourites
              </button>
            )}
          </div>

          {/* ratings */}
          <div className="mb-3">
            <h6 className="section-title">Ratings</h6>
            <RatingStars
              value={rating?.myRating}
              onChange={(n) => onRate?.(id, n)} // send user selection up
              average={rating?.average}
              count={rating?.count}
            />
          </div>

          {/* extra details */}
          {(authors || description) && (
            <div className="mb-2">
              {authors && (
                <div className="mb-2">
                  <strong>Authors:</strong> {authors}
                </div>
              )}
              {description && <p className="desc">{description}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
