// src/pages/cashier/components/ProfilePage.jsx
import React from "react";
import { useCashier } from "./CashierContext";

/**
 * ProfilePage: cashier settings and shift management (frontend only).
 */
export default function ProfilePage() {
  const { currentCart } = useCashier();

  return (
    <div>
      <h1>Profile</h1>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <div style={{ fontWeight: 600 }}>Cashier: Demo User</div>
          <div style={{ color: "#6b7280", marginTop: 6 }}>Role: Cashier</div>
        </div>

        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <div style={{ fontWeight: 600 }}>Current Session</div>
          <div style={{ marginTop: 8 }}>Cart items: {currentCart.items.length}</div>
          <div>Cart total: ₹ {currentCart.totals.total.toFixed(2)}</div>
        </div>

        <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
          <strong>Actions</strong>
          <div style={{ marginTop: 8 }}>
            <button style={{ padding: "8px 12px", borderRadius: 6, background: "#0b5fff", color: "#fff", border: "none", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
