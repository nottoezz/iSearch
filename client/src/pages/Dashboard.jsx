// client/src/pages/Dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import ItemDetails from "../components/ItemDetails";

function useGridColumns() {
  // Matches: col-12 col-sm-6 col-md-6 col-lg-4  => 1 / 2 / 2 / 3 cols
  const get = () => {
    const w = window.innerWidth;
    if (w >= 992) return 3; // lg and up
    if (w >= 576) return 2; // sm and md
    return 1; // xs
  };
  const [cols, setCols] = useState(get);
  useEffect(() => {
    const on = () => setCols(get());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return cols;
}

export default function Dashboard() {
  const [mode, setMode] = useState("search"); // 'search' | 'favourites'
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [notice, setNotice] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [ratings, setRatings] = useState({}); // { [id]: { average, count, myRating } }
  const panelRef = useRef(null);
  const cols = useGridColumns();

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 1500);
  };

  const onSearch = async ({ term, media }) => {
    setMode("search");
    setExpandedId(null);
    setLoading(true);
    setNotice("");
    try {
      const { data } = await api.get("/search", {
        params: { term, media, limit: 24 },
      });
      const items = data?.items || [];
      setResults(items);
      if (!items.length)
        setNotice("No results. Try a different term or category.");
    } catch (e) {
      setNotice(e.response?.data?.error || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const loadFavourites = async () => {
    setLoading(true);
    setNotice("");
    try {
      const { data } = await api.get("/favourites");
      const items = Array.isArray(data) ? data : data.items || [];
      setFavourites(items);
      if (!items.length) setNotice("No favourites yet.");
    } catch (e) {
      setNotice(e.response?.data?.error || "Failed to load favourites");
    } finally {
      setLoading(false);
    }
  };

  const addToFavourites = async (item) => {
    try {
      await api.post("/favourites", { item });
      if (mode === "favourites")
        setFavourites((prev) => [{ id: "temp", item }, ...prev]);
      flash("Added to favourites");
    } catch (e) {
      flash(e.response?.data?.error || "Could not add to favourites");
    }
  };

  const removeFavourite = async (itemId) => {
    try {
      await api.delete(`/favourites/${encodeURIComponent(String(itemId))}`);
      setFavourites((prev) =>
        prev.filter((d) => (d.item?.id || d.id) !== String(itemId))
      );
      if (expandedId === String(itemId)) setExpandedId(null);
    } catch (e) {
      flash(e.response?.data?.error || "Could not remove favourite");
    }
  };

  useEffect(() => {
    if (mode === "favourites") loadFavourites();
  }, [mode]);

  useEffect(() => {
    const id = expandedId;
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/ratings/${encodeURIComponent(id)}`);
        setRatings((prev) => ({ ...prev, [id]: data || {} }));
      } catch {
        /* ignore */
      }
    })();
  }, [expandedId]);

  useEffect(() => {
    if (panelRef.current)
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expandedId]);

  // Close panel if selected item disappears from the current list
  const list = mode === "search" ? results : favourites;
  useEffect(() => {
    if (!expandedId) return;
    const stillThere = list.some(
      (it) => String((it.item || it).id) === String(expandedId)
    );
    if (!stillThere) setExpandedId(null);
  }, [list, expandedId]);

  const handleRate = async (itemId, n) => {
    try {
      const { data } = await api.post(
        `/ratings/${encodeURIComponent(itemId)}`,
        { rating: n }
      );
      setRatings((prev) => ({ ...prev, [itemId]: data || { myRating: n } }));
    } catch (e) {
      flash(e.response?.data?.error || "Rating failed");
    }
  };

  // Calculate where to place the full-width panel: after the row that holds expandedId
  const expandedIndex = expandedId
    ? list.findIndex((it) => String((it.item || it).id) === String(expandedId))
    : -1;

  const panelRowEndIndex =
    expandedIndex >= 0
      ? Math.min(
          Math.floor(expandedIndex / cols) * cols + (cols - 1),
          list.length - 1
        )
      : -1;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Dashboard</h2>
        <div className="btn-group" role="group">
          <button
            className={`btn btn-sm ${
              mode === "search" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => {
              setMode("search");
              setExpandedId(null);
            }}
          >
            Search Results
          </button>
          <button
            className={`btn btn-sm ${
              mode === "favourites" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => {
              setMode("favourites");
              setExpandedId(null);
            }}
          >
            My Favourites
          </button>
        </div>
      </div>

      {mode === "search" && (
        <div className="card mb-4">
          <div className="card-body">
            <SearchBar onSearch={onSearch} loading={loading} />
            {notice && <div className="notice mt-2">{notice}</div>}
          </div>
        </div>
      )}

      {loading && <div className="text-muted">Loading…</div>}
      {!loading && notice && mode !== "search" && (
        <div className="notice mb-3">{notice}</div>
      )}

      <div className="row g-3">
        {list.map((it, i) => {
          const data = it.item || it;
          const id = String(data.id);
          const isFav = mode === "favourites";

          const tile = (
            <div
              key={`card-${id}-${mode}`}
              className="col-12 col-sm-6 col-md-6 col-lg-4"
            >
              <ResultCard
                item={it}
                isFavourite={isFav}
                onSelect={() =>
                  setExpandedId((prev) => (prev === id ? null : id))
                }
                onAdd={addToFavourites}
                onRemove={removeFavourite}
              />
            </div>
          );

          // if this is not the end of the expanded row, just render the tile
          if (i !== panelRowEndIndex) return tile;

          // otherwise, append the full-width panel *after* the row
          return (
            <React.Fragment key={`row-end-${i}-${mode}`}>
              {tile}
              {expandedIndex >= 0 && (
                <div className="col-12" ref={panelRef}>
                  <ItemDetails
                    item={list[expandedIndex]}
                    isFavourite={isFav}
                    onAdd={addToFavourites}
                    onRemove={removeFavourite}
                    rating={ratings[expandedId]}
                    onRate={handleRate}
                    onClose={() => setExpandedId(null)}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
