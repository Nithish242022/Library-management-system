import React, { useEffect, useState } from "react";
import { Search, RefreshCw, BookOpen, Plus } from "lucide-react";
import { api } from "../services/api";

export default function BooksPage({ setToast }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");

  const loadBooks = async (params = {}) => {
    try {
      const res = await api.get("/books", params);
      setBooks(res.books);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to load books" });
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleRefresh = () => {
    loadBooks({ search, category, department });
    setToast({ type: "success", message: "Books refreshed" });
  };

  return (
    <div className="books-page glass" style={{ padding: "1.5rem" }}>
      <div className="books-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ color: "var(--text-primary)" }}>Library Catalog</h2>
        <button className="btn btn-primary" onClick={handleRefresh}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filter bar */}
      <div className="books-filters" style={{ display: "flex", gap: "12px", marginBottom: "1.2rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Search (title, author, ISBN)</label>
          <div className="input-icon-wrapper">
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="form-control with-icon"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {/* TODO: Populate dynamically from API if needed */}
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All</option>
            {/* TODO: Populate dynamically from API if needed */}
            <option value="Computer Science">Computer Science</option>
            <option value="Physics">Physics</option>
            <option value="History">History</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          style={{ alignSelf: "flex-end", height: "38px" }}
          onClick={() => loadBooks({ search, category, department })}
        >
          <Search size={16} /> Apply
        </button>
      </div>

      {/* Books table */}
      <table className="glass" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.05)" }}>
            <th style={{ padding: "0.5rem" }}>ISBN</th>
            <th style={{ padding: "0.5rem" }}>Title</th>
            <th style={{ padding: "0.5rem" }}>Author</th>
            <th style={{ padding: "0.5rem" }}>Category</th>
            <th style={{ padding: "0.5rem" }}>Dept.</th>
            <th style={{ padding: "0.5rem" }}>Copies</th>
            <th style={{ padding: "0.5rem" }}>Avail.</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <td style={{ padding: "0.4rem" }}>{b.isbn}</td>
              <td style={{ padding: "0.4rem" }}>{b.title}</td>
              <td style={{ padding: "0.4rem" }}>{b.author}</td>
              <td style={{ padding: "0.4rem" }}>{b.category}</td>
              <td style={{ padding: "0.4rem" }}>{b.department || "—"}</td>
              <td style={{ padding: "0.4rem", textAlign: "center" }}>{b.total_copies}</td>
              <td style={{ padding: "0.4rem", textAlign: "center", color: b.available_copies > 0 ? "#34d399" : "#f87171" }}>
                {b.available_copies}
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)" }}>
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
