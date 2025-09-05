import { useEffect, useState } from "react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";

export default function Dashboard() {
  const [mode, setMode] = useState("search");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [notice, setNotice] = useState("");

  const onSearch = async ({ term, media }) => {
    setMode("search");
    setLoading(true);
    setNotice("");
    try {
      const { data } = await api.get("/search", {
        params: { term, media, limit: 24 },
      });
      setResults(data?.items || []);
      if ((data?.items || []).length === 0)
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
      if (items.length === 0) setNotice("No favourites yet.");
    } catch (e) {
      setNotice(e.response?.data?.error || "Failed to load favourites");
    } finally {
      setLoading(false);
    }
  };

  const addToFavourites = async (item) => {
    try {
      await api.post("/favourites", { item });
      setNotice("Added to favourites");
      // optimistic add if currently viewing favourites
      if (mode === "favourites")
        setFavourites((prev) => [{ id: "temp", item }, ...prev]);
      setTimeout(() => setNotice(""), 1200);
    } catch (e) {
      setNotice(e.response?.data?.error || "Could not add to favourites");
      setTimeout(() => setNotice(""), 1500);
    }
  };

  const removeFavourite = async (itemId) => {
    try {
      await api.delete(`/favourites/${encodeURIComponent(String(itemId))}`);
      setFavourites((prev) =>
        prev.filter((d) => (d.item?.id || d.id) !== String(itemId))
      );
    } catch (e) {
      setNotice(e.response?.data?.error || "Could not remove favourite");
      setTimeout(() => setNotice(""), 1500);
    }
  };

  // when switching to favourites, load them
  useEffect(() => {
    if (mode === "favourites") loadFavourites();
  }, [mode]);

  return (
    <div className="container py-4">
      {/* mode toggle header */}
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Dashboard</h2>
        <div className="btn-group" role="group" aria-label="View toggle">
          <button
            className={`btn btn-sm ${
              mode === "search" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setMode("search")}
          >
            Search Results
          </button>
          <button
            className={`btn btn-sm ${
              mode === "favourites" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setMode("favourites")}
          >
            My Favourites
          </button>
        </div>
      </div>

      {/* search section only visible in search mode */}
      {mode === "search" && (
        <div className="card mb-4">
          <div className="card-body">
            <SearchBar onSearch={onSearch} loading={loading} />
            {notice && <div className="notice mt-2">{notice}</div>}
          </div>
        </div>
      )}

      {/* unified grid for display */}
      {loading && <div className="text-muted">Loading…</div>}

      {!loading && notice && mode !== "search" && (
        <div className="notice mb-3">{notice}</div>
      )}

      <div className="row g-3">
        {(mode === "search" ? results : favourites).map((it) => {
          const key =
            (it.item?.id || it.id || crypto.randomUUID?.()) +
            (mode === "favourites" ? "-fav" : "-res");
          return (
            <div key={key} className="col-12 col-sm-6 col-md-6 col-lg-4">
              <ResultCard
                item={it}
                isFavourite={mode === "favourites"}
                onAdd={addToFavourites}
                onRemove={removeFavourite}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
