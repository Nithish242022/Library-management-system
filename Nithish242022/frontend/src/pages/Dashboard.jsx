import React, { useEffect, useState } from "react";
import { ChartBar, TrendingUp, RefreshCw, LogOut } from "lucide-react";
import { api } from "../services/api";

/* Helper component for a glass‑styled widget */
function Widget({ title, value, icon: Icon, bg, accent }) {
  return (
    <div
      className="glass"
      style={{
        padding: "1.2rem",
        textAlign: "center",
        background: bg,
        borderColor: accent,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <Icon size={28} color={accent} />
      <h4 style={{ margin: "0.4rem 0 0.2rem", color: "var(--text-primary)" }}>
        {title}
      </h4>
      <p style={{ fontSize: "1.4rem", fontWeight: 600, color: accent }}>
        {value}
      </p>
    </div>
  );
}

/* Recent activity table */
function RecentTable({ transactions }) {
  if (!transactions?.length) return <p>No recent activity.</p>;

  return (
    <table className="glass" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "rgba(255,255,255,0.05)" }}>
          <th style={{ padding: "0.6rem" }}>Book</th>
          <th style={{ padding: "0.6rem" }}>Member</th>
          <th style={{ padding: "0.6rem" }}>Issue Date</th>
          <th style={{ padding: "0.6rem" }}>Due</th>
          <th style={{ padding: "0.6rem" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <td style={{ padding: "0.5rem" }}>{t.book_title}</td>
            <td style={{ padding: "0.5rem" }}>{t.member_name}</td>
            <td style={{ padding: "0.5rem" }}>{t.issue_date}</td>
            <td style={{ padding: "0.5rem" }}>{t.due_date}</td>
            <td style={{ padding: "0.5rem", color: t.status === "OVERDUE" ? "#f87171" : "#34d399" }}>
              {t.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Main dashboard component */
export default function Dashboard({ user, setToast }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.stats);
      setRecent(res.recent_activity);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to load dashboard" });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    fetchStats();
    setToast({ type: "success", message: "Dashboard refreshed" });
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setToast({ type: "success", message: "Signed out" });
      window.location.reload();
    } catch (e) {
      setToast({ type: "error", message: "Logout failed" });
    }
  };

  return (
    <div className="dashboard-wrapper glass" style={{ padding: "2rem" }}>
      {/* Header */}
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <h2 style={{ color: "var(--text-primary)" }}>
          Welcome, {user?.name || "User"}!
        </h2>
        <div>
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ marginLeft: "0.8rem" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Widgets */}
      <div className="dashboard-widgets" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {stats ? (
          <>
            <Widget
              title="Total Books"
              value={stats.total_book_copies}
              icon={ChartBar}
              bg="rgba(6,182,212,0.12)"
              accent="var(--accent-cyan)"
            />
            <Widget
              title="Active Loans"
              value={stats.active_loans}
              icon={TrendingUp}
              bg="rgba(245,158,11,0.12)"
              accent="var(--accent-amber)"
            />
            <Widget
              title="Overdue Fines"
              value={`$${stats.total_fines_collected.toFixed(2)}`}
              icon={ChartBar}
              bg="rgba(99,102,241,0.12)"
              accent="var(--primary)"
            />
          </>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>Loading stats…</p>
        )}
      </div>

      {/* Recent Activity */}
      <h3 style={{ color: "var(--text-primary)", marginBottom: "0.8rem" }}>
        Recent Transactions
      </h3>
      <RecentTable transactions={recent} />
    </div>
  );
}
