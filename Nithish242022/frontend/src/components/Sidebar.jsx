// src/components/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  LogOut,
  Menu,
} from "lucide-react";
import { api } from "../services/api";

/* ------------------------------------------------------------------
   Sidebar – glass‑styled vertical navigation
   ------------------------------------------------------------------ */
export default function Sidebar({ user, setToast }) {
  const navigate = useNavigate();

  // Menu definition – each entry is rendered as a NavLink
  const menuItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: Home,
    },
    {
      label: "Books",
      to: "/books",
      icon: BookOpen,
    },
    {
      label: "Members",
      to: "/members",
      icon: Users,
    },
  ];

  // -----------------------------------------------------------------
  // Sign‑out handler – calls backend, shows toast, redirects to login
  // -----------------------------------------------------------------
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setToast({
        type: "success",
        message: "Signed out successfully – redirecting to login",
      });
      // Clear any client‑side auth state (you may also clear localStorage, etc.)
      navigate("/", { replace: true });
    } catch (err) {
      setToast({ type: "error", message: err.message || "Logout failed" });
    }
  };

  return (
    <aside
      className="sidebar glass"
      style={{
        width: "240px",
        minHeight: "100vh",
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid var(--border-glass)",
      }}
    >
      {/* -----------------------------------------------------------------
          Top – App logo & user avatar
          ----------------------------------------------------------------- */}
      <div className="sidebar-top">
        <div
          className="logo-container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            marginBottom: "2rem",
          }}
        >
          {/* Replace with your actual logo file if you have one */}
          <img
            src="/library_logo.png"
            alt="Library logo"
            style={{ width: "30px", height: "30px" }}
            onError={(e) => (e.target.style.display = "none")}
          />
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            LibFlow
          </h2>
        </div>

        {/* -----------------------------------------------------------------
            Navigation links
            ----------------------------------------------------------------- */}
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "0.6rem 0.9rem",
                  marginBottom: "0.6rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive
                    ? "var(--accent-cyan)"
                    : "var(--text-muted)",
                  background: isActive
                    ? "rgba(6,182,212,0.12)"
                    : "transparent",
                })}
              >
                <Icon
                  size={20}
                  color={isActive => (isActive ? "var(--accent-cyan)" : "#9ca3af")}
                />
                <span style={{ fontSize: "0.95rem" }}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* -----------------------------------------------------------------
          Bottom – user badge & sign‑out button
          ----------------------------------------------------------------- */}
      <div className="sidebar-bottom">
        <div
          className="user-badge glass"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 0.8rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          {/* Avatar – you can replace with a real image URL */}
          <img
            src={user?.avatar_url || "/default_avatar.png"}
            alt="User avatar"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "2px solid var(--border-glass)",
            }}
            onError={(e) => (e.target.src = "/default_avatar.png")}
          />
          <div style={{ lineHeight: 1.2 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 500,
                color: "var(--text-primary)",
                fontSize: "0.93rem",
              }}
            >
              {user?.name || "Guest"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.78rem",
                color: "var(--text-muted)",
              }}
            >
              {user?.role || "Visitor"}
            </p>
          </div>
        </div>

        {/* Sign‑out button */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.55rem 0",
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
