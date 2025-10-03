import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/suppliers", label: "Suppliers" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/settings", label: "Settings" },
  { to: "/admin/audit", label: "Audit Log" },
];

export default function Sidebar() {
  return (
    <aside className="admin-sidebar p-4">
      <div className="mb-6">
        <div className="text-2xl font-bold">HexaFarm Admin</div>
        <div className="text-xs opacity-70">Dashboard</div>
      </div>
      <nav className="space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === "/admin"}
            className={({ isActive }) =>
              "block py-2 px-3 rounded hover:bg-gray-700 " +
              (isActive ? "bg-gray-700 font-semibold" : "text-gray-200")
            }
          >
            {it.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
