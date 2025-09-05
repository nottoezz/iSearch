import { useEffect, useState } from "react";
import api from "../services/api";

export default function FavouritesDropdown({ onRemoved }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/favourites");
      setItems(data?.items || data || []);
    } catch (e) {
      console.error("favourites load error", e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeOne = async (itemId) => {
    try {
      await api.delete(`/favourites/${encodeURIComponent(itemId)}`);
      setItems((prev) => prev.filter((i) => (i.item?.id || i.id) !== itemId));
      onRemoved?.(itemId);
    } catch (e) {
      console.error("remove favourite error", e.response?.data || e.message);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {loading ? "Favourites…" : `Favourites (${items.length})`}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end p-2"
        style={{ minWidth: 320, maxHeight: 340, overflowY: "auto" }}
      >
        {loading && <li className="px-2 py-1 text-muted small">Loading…</li>}
        {!loading && items.length === 0 && (
          <li className="px-2 py-1 text-muted small">No favourites yet</li>
        )}
        {!loading &&
          items.map((doc) => {
            // support either { id, title, artwork } or { item: {...} }
            const data = doc.item || doc;
            const id = data.id;
            return (
              <li
                key={id}
                className="d-flex align-items-center gap-2 px-2 py-1"
              >
                <img
                  src={data.artwork || "https://via.placeholder.com/40"}
                  alt=""
                  width="40"
                  height="40"
                  className="rounded"
                />
                <div className="flex-grow-1">
                  <div
                    className="small fw-semibold text-truncate"
                    title={data.title}
                  >
                    {data.title}
                  </div>
                  <div className="small text-muted text-truncate">
                    {data.artist}
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeOne(id)}
                >
                  Remove
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
