import React, { useEffect, useState } from "react";
import { Search, RefreshCw, User, Plus } from "lucide-react";
import { api } from "../services/api";

export default function MembersPage({ setToast }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const loadMembers = async (params = {}) => {
    try {
      const res = await api.get("/members", params);
      setMembers(res.members);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to load members" });
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleRefresh = () => {
    loadMembers({ search, status: statusFilter, role_type: roleFilter });
    setToast({ type: "success", message: "Members refreshed" });
  };

  // Simple table – feel free to extend with edit/delete modals later
  return (
    <div className="members-page glass" style={{ padding: "1.5rem" }}>
      <div className="members-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2 style={{ color: "var(--text-primary)" }}>Library Members Directory</h2>
        <button className="btn btn-primary" onClick={handleRefresh}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Search / Filters */}
      <div className="members-filters" style={{ display: "flex", gap: "12px", marginBottom: "1.2rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Search (name, email, code, dept)</label>
          <div className="input-icon-wrapper">
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="form-control with-icon"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label>Role Type</label>
          <select
            className="form-control"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Librarian">Librarian</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          style={{ alignSelf: "flex-end", height: "38px" }}
          onClick={() => loadMembers({ search, status: statusFilter, role_type: roleFilter })}
        >
          <Search size={16} /> Apply
        </button>
      </div>

      {/* Members table */}
      <table className="glass" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.05)" }}>
            <th style={{ padding: "0.6rem" }}>Member Code</th>
            <th style={{ padding: "0.6rem" }}>Name</th>
            <th style={{ padding: "0.6rem" }}>Email</th>
            <th style={{ padding: "0.6rem" }}>Department</th>
            <th style={{ padding: "0.6rem" }}>Role</th>
            <th style={{ padding: "0.6rem" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <td style={{ padding: "0.5rem" }}>{m.member_code}</td>
              <td style={{ padding: "0.5rem" }}>{m.name}</td>
              <td style={{ padding: "0.5rem" }}>{m.email}</td>
              <td style={{ padding: "0.5rem" }}>{m.department}</td>
              <td style={{ padding: "0.5rem" }}>{m.role_type}</td>
              <td style={{ padding: "0.5rem", color: m.status === "ACTIVE" ? "#34d399" : "#f87171" }}>
                {m.status}
              </td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)" }}>
                No members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
