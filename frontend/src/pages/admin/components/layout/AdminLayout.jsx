// src/pages/admin/components/layout/AdminLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 min-h-screen flex flex-col">
        <Topbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
        <main className="admin-main flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
