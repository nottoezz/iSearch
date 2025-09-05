import { useState } from "react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import ResultCard from "../components/ResultCard";
import FavouritesDropdown from "../components/FavouritesDropdown";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [notice, setNotice] = useState("");

  const onSearch = async ({ term, media }) => {
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

  const addToFavourites = async (item) => {
    try {
      await api.post("/favourites", { item });
      setNotice("Added to favourites");
      setTimeout(() => setNotice(""), 1500);
    } catch (e) {
      setNotice(e.response?.data?.error || "Could not add to favourites");
      setTimeout(() => setNotice(""), 2000);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Dashboard</h2>
        <FavouritesDropdown />
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <SearchBar onSearch={onSearch} loading={loading} />
          {notice && <div className="text-muted small mt-2">{notice}</div>}
        </div>
      </div>

      <div className="row g-3">
        {results.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ResultCard item={item} onAdd={addToFavourites} />
          </div>
        ))}
      </div>
    </div>
  );
}
