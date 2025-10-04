// src/pages/admin/components/layout/Topbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      // Clear any other user state you may have
      localStorage.removeItem("user");
    } catch (e) {
      console.warn("logout error", e);
    }
    navigate("/login", { replace: true });
  };

  return (
    <header className="admin-topbar flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="toggle sidebar"
        >
          ☰
        </button>
        <div className="text-lg font-medium">Admin Panel</div>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="border rounded px-2 py-1"
          placeholder="Search orders, customers, SKUs..."
          aria-label="global search"
        />

        <button
          title="Notifications"
          className="p-2 rounded hover:bg-gray-100"
          aria-label="notifications"
        >
          🔔
        </button>

        <div className="flex items-center gap-2">
          <div className="text-sm hidden sm:block">Admin</div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 border rounded text-sm hover:bg-red-50"
            aria-label="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
