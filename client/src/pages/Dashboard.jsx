import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import ItemDetails from "../components/ItemDetails";
import { useToast } from "../components/ToastProvider";

// compute how many columns are visible based on current breakpoint
function useGridColumns() {
  const get = () => {
    const w = window.innerWidth;
    if (w >= 992) return 3; // lg+
    if (w >= 576) return 2; // sm/md
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

// normalise id from either search item or favourite row
const getId = (entry) => String(entry?.item?.id ?? entry?.id);

export default function Dashboard() {
  // view state
  const [mode, setMode] = useState("search"); // 'search' | 'favourites'
  const [loading, setLoading] = useState(false);

  // data state
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState([]); // [{ id, item }]
  const [favIds, setFavIds] = useState(new Set()); // quick lookup for ui toggles

  // ui feedback / details panel state
  const [notice, setNotice] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [ratings, setRatings] = useState({}); // per-item rating payload
  const panelRef = useRef(null);

  const cols = useGridColumns();
  const { addToast } = useToast();

  // preload favourite ids once so search cards can render add/remove correctly
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/favourites");
        const items = Array.isArray(data) ? data : data.items || [];
        setFavIds(new Set(items.map(getId)));
      } catch {
        /* silent */
      }
    })();
  }, []);

  // run a search request
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

  // fetch full favourites list (used when switching to favourites tab)
  const loadFavourites = async () => {
    setLoading(true);
    setNotice("");
    try {
      const { data } = await api.get("/favourites");
      const items = Array.isArray(data) ? data : data.items || [];
      setFavourites(items);
      setFavIds(new Set(items.map(getId)));
      if (!items.length) setNotice("No favourites yet.");
    } catch (e) {
      setNotice(e.response?.data?.error || "Failed to load favourites");
    } finally {
      setLoading(false);
    }
  };

  // optimistic add to favourites (instant ui), revert on error
  const addToFavourites = async (item) => {
    const idStr = String(item.id);
    const prevIds = new Set(favIds);
    setFavIds((s) => new Set(s).add(idStr));

    let optimisticRow;
    if (mode === "favourites") {
      optimisticRow = { id: `tmp-${idStr}`, item };
      setFavourites((prev) => [optimisticRow, ...prev]);
    }

    try {
      await api.post("/favourites", { item });
      addToast("Added to favourites", { type: "success" });
    } catch (e) {
      // revert if server failed
      setFavIds(prevIds);
      if (mode === "favourites" && optimisticRow) {
        setFavourites((prev) => prev.filter((r) => r !== optimisticRow));
      }
      addToast(e.response?.data?.error || "Could not add to favourites", {
        type: "error",
      });
    }
  };

  // optimistic remove (instant ui), revert on error
  const removeFavourite = async (itemId) => {
    const idStr = String(itemId);

    const prevIds = new Set(favIds);
    const prevFavs = favourites.slice();

    // local update first
    setFavIds((s) => {
      const n = new Set(s);
      n.delete(idStr);
      return n;
    });
    if (mode === "favourites") {
      setFavourites((prev) => prev.filter((d) => getId(d) !== idStr));
    }
    if (expandedId === idStr) setExpandedId(null);

    try {
      await api.delete(`/favourites/${encodeURIComponent(idStr)}`);
      addToast("Removed from favourites", { type: "success" });
    } catch (e) {
      // revert if server failed
      setFavIds(prevIds);
      if (mode === "favourites") setFavourites(prevFavs);
      addToast(e.response?.data?.error || "Could not remove favourite", {
        type: "error",
      });
    }
  };

  // load favourites when switching to that tab
  useEffect(() => {
    if (mode === "favourites") loadFavourites();
  }, [mode]);

  // fetch rating payload when details panel opens
  useEffect(() => {
    if (!expandedId) return;
    (async () => {
      try {
        const { data } = await api.get(
          `/ratings/${encodeURIComponent(expandedId)}`
        );
        setRatings((prev) => ({ ...prev, [expandedId]: data || {} }));
      } catch {
        /* ignore */
      }
    })();
  }, [expandedId]);

  // smooth scroll to the details panel when it appears
  useEffect(() => {
    if (panelRef.current)
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expandedId]);

  // choose data source based on active tab
  const list = mode === "search" ? results : favourites;

  // if an expanded item disappears (e.g., removed), close the panel
  useEffect(() => {
    if (!expandedId) return;
    const stillThere = list.some(
      (it) => String((it.item || it).id) === String(expandedId)
    );
    if (!stillThere) setExpandedId(null);
  }, [list, expandedId]);

  // submit a user rating and merge response
  const handleRate = async (itemId, n) => {
    try {
      const { data } = await api.post(
        `/ratings/${encodeURIComponent(itemId)}`,
        { rating: n }
      );
      setRatings((prev) => ({ ...prev, [itemId]: data || { myRating: n } }));
    } catch (e) {
      addToast(e.response?.data?.error || "Rating failed", { type: "error" });
    }
  };

  // figure out where to insert the full-width details panel:
  // place it after the end of the row that contains the selected card
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
              // switch to search and collapse details
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
              // switch to favourites and collapse details
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
          const isFav = favIds.has(id); // drives add/remove state on every card

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

          // render the tile normally unless this index closes the row with the expanded card
          if (i !== panelRowEndIndex) return tile;

          // append the full-width details card after the row that contains the expanded card
          return (
            <React.Fragment key={`row-end-${i}-${mode}`}>
              {tile}
              {expandedIndex >= 0 && (
                <div className="col-12" ref={panelRef}>
                  <ItemDetails
                    item={list[expandedIndex]}
                    isFavourite={favIds.has(String(expandedId))}
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
