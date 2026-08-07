import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  const handleLoginSuccess = (loggedUser) => setUser(loggedUser);

  return (
    <>
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
      {user ? (
        <Dashboard user={user} setToast={setToast} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} setToast={setToast} />
      )}
    </>
  );
}
