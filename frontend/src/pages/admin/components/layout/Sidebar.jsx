import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/suppliers", label: "Suppliers" },
  { to: "/admin/payments", label: "Payments" },
    { to: "/admin/users", label: "Users" },

  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/settings", label: "Settings" },
  { to: "/admin/audit", label: "Audit Log" },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`admin-sidebar p-4${collapsed ? " collapsed" : ""}`}
      style={{ position: "relative" }}
    >
      <button
        className="sidebar-toggle"
        onClick={onToggle}
        aria-label="Toggle sidebar"
        style={{
          position: "absolute",
          top: 8,
          right: 10, // align left
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "1.5rem",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        &#9776; {/* ☰ hamburger menu */}
      </button>

      <div className={`mb-6 sidebar-header${collapsed ? " hidden" : ""}`}>
        <div className="sidebar-title">Admin Panel</div>
      </div>

      <nav className="sidebar-nav" aria-label="Admin navigation">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.to === "/admin"}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "") + (collapsed ? " collapsed-link" : "")
            }
            title={it.label}
          >
            {collapsed ? (
              <span className="sidebar-icon" aria-hidden="true">
                {it.label.charAt(0)}
              </span>
            ) : (
              it.label
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}