export const api = {
  login: async ({ email, password }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }
    return res.json();
  },

  // Example helper – you can add more as needed
  getBooks: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/books?${qs}`);
    if (!res.ok) throw new Error("Failed to fetch books");
    return res.json();
  },
};
