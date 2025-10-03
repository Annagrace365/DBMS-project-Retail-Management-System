import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex">
      {sidebarOpen && <Sidebar />}
      <div className="flex-1 min-h-screen">
        <Topbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
