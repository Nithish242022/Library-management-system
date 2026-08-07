import React, { useState } from "react";
import {
  GraduationCap,
  BookOpenCheck,
  ShieldCheck,
  KeyRound,
  Mail,
  Lock,               // ✅ added
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { api } from "../services/api";

export default function LoginPage({ onLoginSuccess, setToast }) {
  const [activePortal, setActivePortal] = useState("STUDENT");
  const [email, setEmail] = useState("student@university.edu");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const portals = [
    {
      id: "STUDENT",
      name: "Student Portal",
      icon: GraduationCap,
      accent: "var(--accent-cyan)",
      bg: "rgba(6,182,212,0.12)",
      badge: "Student Access",
      defaultEmail: "student@university.edu",
      defaultPass: "student123",
      desc: "Browse catalog, check loans, view fines.",
    },
    {
      id: "FACULTY",
      name: "Faculty Portal",
      icon: BookOpenCheck,
      accent: "var(--accent-amber)",
      bg: "rgba(245,158,11,0.12)",
      badge: "Faculty Access",
      defaultEmail: "faculty@university.edu",
      defaultPass: "faculty123",
      desc: "30‑day loans, priority reservations, department requests.",
    },
    {
      id: "LIBRARIAN",
      name: "Librarian Admin",
      icon: ShieldCheck,
      accent: "var(--primary)",
      bg: "rgba(99,102,241,0.12)",
      badge: "Admin Control",
      defaultEmail: "librarian@library.org",
      defaultPass: "admin123",
      desc: "Full CRUD for books, members, transactions.",
    },
  ];

  const cur = portals.find((p) => p.id === activePortal);

  const handlePortalSwitch = (p) => {
    setActivePortal(p.id);
    setEmail(p.defaultEmail);
    setPassword(p.defaultPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ type: "error", message: "Both fields are required" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setToast({ type: "success", message: res.message });
      onLoginSuccess(res.user);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-login-viewport glass">
      <div className="portal-login-wrapper">
        {/* Header */}
        <div className="portal-header">
          <div className="portal-logo-container">
            <img
              src="/library_logo.png"
              alt="Library Logo"
              className="portal-logo-img"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <div>
            <h1 className="portal-main-title">LibFlow University Library</h1>
            <p className="portal-sub-title">
              Select a portal to sign in to your academic account
            </p>
          </div>
        </div>

        {/* Portal cards */}
        <div className="portal-cards-grid">
          {portals.map((p) => {
            const Icon = p.icon;
            const selected = activePortal === p.id;
            return (
              <div
                key={p.id}
                className={`portal-card-column ${selected ? "selected" : ""}`}
                onClick={() => handlePortalSwitch(p)}
                style={{
                  borderColor: selected ? p.accent : "var(--border-glass)",
                  boxShadow: selected ? `0 0 25px ${p.bg}` : "none",
                }}
              >
                <div className="portal-card-top">
                  <div
                    className="portal-icon-badge"
                    style={{ background: p.bg, color: p.accent }}
                  >
                    <Icon size={26} />
                  </div>
                  <span
                    className="portal-access-tag"
                    style={{
                      color: p.accent,
                      background: p.bg,
                      borderColor: p.bg,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>

                <h3 className="portal-name">{p.name}</h3>
                <p className="portal-desc">{p.desc}</p>

                <div
                  className="portal-select-indicator"
                  style={{
                    color: selected ? p.accent : "var(--text-dim)",
                  }}
                >
                  {selected ? "● Active Selection" : "Click to Select"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Login form */}
        <div className="portal-form-container glass">
          <div className="portal-form-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <KeyRound size={20} style={{ color: cur.accent }} />
              <h3>Sign In to {cur.name}</h3>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setEmail(cur.defaultEmail);
                setPassword(cur.defaultPass);
                setToast({
                  type: "success",
                  message: `Pre‑filled ${cur.name} demo credentials!`,
                });
              }}
            >
              <Sparkles size={14} /> 1‑Click Auto Fill
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-inputs-grid">
              {/* Email */}
              <div className="form-group">
                <label>Academic / Staff Email *</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    className="form-control with-icon"
                    placeholder="user@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Security Password *</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control with-icon"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Demo credentials help */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "4px",
                marginBottom: "24px",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Demo: <strong style={{ color: cur.accent }}>{cur.defaultEmail}</strong> /
                <strong>{cur.defaultPass}</strong>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn login-submit-btn"
              disabled={loading}
              style={{
                background: `linear-gradient(135deg, ${cur.accent}, #0284C7)`,
                boxShadow: `0 4px 18px ${cur.bg}`,
              }}
            >
              {loading ? "Authenticating…" : <>Access {cur.name} <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
