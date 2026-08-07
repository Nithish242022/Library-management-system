// src/services/api.js
/**
 * Tiny wrapper around fetch.
 * All endpoints are relative; Vite proxies `/api/*` → http://localhost:5000.
 */

async function get(endpoint, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${endpoint}?${qs}` : endpoint;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "API GET failed");
  }
  return res.json();
}

async function post(endpoint, body = {}, method = "POST") {
  const res = await fetch(endpoint, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API ${method} failed`);
  }
  return res.json();
}

// Export a namespace used throughout the UI
export const api = {
  get,
  post,
  login: async ({ email, password }) => post("/api/auth/login", { email, password }),
};
