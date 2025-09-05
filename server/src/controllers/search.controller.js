import { searchItunes } from "../services/itunes.services.js";

// map items to our API
function mapItem(item) {
  // set track identifiers and adjust atwrok size
  const id = item.trackId || item.collectionId || item.artistId;
  const title = item.trackName || item.collectionName || item.artistName;
  const artist = item.artistName;
  const date = item.releaseDate;
  const kind = item.kind || item.wrapperType;
  const collection = item.collectionName;
  const link = item.trackViewUrl || item.collectionViewUrl;
  const preview = item.previewUrl || null;
  const artwork = (item.artworkUrl100 || "").replace("100x100", "600x600");
  // return formatted
  return {
    id,
    title,
    artist,
    date,
    kind,
    collection,
    link,
    preview,
    artwork,
  };
}

// GET api search
export async function handleSearch(req, res, next) {
  try {
    const {
      term,
      media = "all",
      limit = 24,
      offset = 0,
      entity,
      attribute,
    } = req.query;
    if (!term) return res.status(400).json({ message: "Term is required" });

    const raw = await searchItunes({
      term,
      media,
      limit,
      offset,
      entity,
      attribute,
    });
    const items = (raw.results || []).map(mapItem);
    res.json({ count: items.length, items });
  } catch (error) {
    next(error);
  }
}
