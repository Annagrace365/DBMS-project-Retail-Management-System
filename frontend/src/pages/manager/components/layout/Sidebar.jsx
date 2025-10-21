import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/manager", label: "Dashboard" },
  { to: "/manager/customers", label: "Customers" },
  { to: "/manager/orders", label: "Orders" },
  { to: "/manager/products", label: "Products" },
  { to: "/manager/suppliers", label: "Suppliers" },
  { to: "/manager/payments", label: "Payments" },
  { to: "/manager/reports", label: "Reports" },
<<<<<<< HEAD
  { to: "/manager/settings", label: "Settings" },
  { to: "/manager/audit", label: "Audit Log" },
=======
 
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
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
        <div className="sidebar-title">Manager Panel</div>
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