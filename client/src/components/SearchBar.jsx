import { useState } from "react";
import { MEDIA_OPTIONS } from "../constants/media";

// simple search bar with term + media selector
export default function SearchBar({ onSearch, loading }) {
  // local input state
  const [term, setTerm] = useState("");
  const [media, setMedia] = useState("all");

  // submit handler: prevent reload, ignore empty, send data up
  const submit = (e) => {
    e.preventDefault();
    if (!term.trim()) return; // no empty searches
    onSearch({ term: term.trim(), media });
  };

  return (
    <form className="row g-2 align-items-end" onSubmit={submit}>
      <div className="col-md-6">
        <label className="form-label">Search term</label>
        <input
          className="form-control"
          placeholder="Try: Beatles, Pixar, Python..."
          value={term}
          onChange={(e) => setTerm(e.target.value)} // keep input controlled
        />
      </div>

      <div className="col-md-3">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={media}
          onChange={(e) => setMedia(e.target.value)} // update selected media
        >
          {MEDIA_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3 d-grid">
        {/* disable while loading and show status */}
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
