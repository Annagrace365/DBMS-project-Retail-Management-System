// src/pages/admin/components/layout/Topbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";

export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.warn("logout error", e);
    }
    navigate("/login", { replace: true });
  };

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <div className="topbar-title">Welcome Admin</div>
        <div className="topbar-search">
          <input
            className="topbar-search-input"
            placeholder="Search orders, customers, SKUs..."
            aria-label="global search"
          />
        </div>
      </div>
      <div className="topbar-right">
        <button
          title="Notifications"
          className="topbar-notify"
          aria-label="notifications"
        >
          <FiBell size={22} />
        </button>
        <div className="topbar-account">
          <div className="topbar-avatar">A</div>
          <button
            onClick={handleLogout}
            className="topbar-logout"
            aria-label="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}