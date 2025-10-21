// src/pages/cashier/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
<<<<<<< HEAD

/**
 * Sidebar: navigation links for cashier module.
 * Keep markup simple — style with your project's global CSS or modify inline styles here.
=======
import { FaBarcode } from "react-icons/fa"; // import barcode icon

/**
 * Sidebar: navigation links for cashier module.
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
 */
export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
<<<<<<< HEAD
=======
    gap: "10px", // add spacing for icon + text
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
    padding: "12px 16px",
    textDecoration: "none",
    color: isActive ? "#0b5fff" : "#2d3748",
    background: isActive ? "rgba(11,95,255,0.06)" : "transparent",
    borderLeft: isActive ? "4px solid #0b5fff" : "4px solid transparent",
    margin: "6px 8px",
    borderRadius: 6,
    fontWeight: isActive ? 600 : 500,
  });

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Cashier</h2>
        <div style={{ color: "#6b7280", fontSize: 13 }}>Point of Sale</div>
      </div>

      <nav>
        <NavLink to="dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="pos" style={linkStyle}>POS / Billing</NavLink>
        <NavLink to="hold-invoices" style={linkStyle}>Hold Invoices</NavLink>
        <NavLink to="transactions" style={linkStyle}>Transactions</NavLink>
        <NavLink to="returns" style={linkStyle}>Returns</NavLink>
        <NavLink to="orders" style={linkStyle}>Orders</NavLink>
        <NavLink to="profile" style={linkStyle}>Profile</NavLink>
<<<<<<< HEAD
=======

        {/* ✅ New Barcode Scanner Link */}
        <NavLink to="barcode-scanner" style={linkStyle}>
          <FaBarcode size={18} />
          <span>Barcode Scanner</span>
        </NavLink>
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
      </nav>

      <div style={{ marginTop: 28, fontSize: 12, color: "#94a3b8" }}>
        Tip: Use <strong>POS</strong> for quick billing.
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
