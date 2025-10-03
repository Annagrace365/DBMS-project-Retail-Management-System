import React from "react";

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="admin-topbar">
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
        />
        <div className="flex items-center gap-3">
          <button className="p-2 rounded hover:bg-gray-100">🔔</button>
          <div className="px-2">Admin</div>
        </div>
      </div>
    </header>
  );
}
