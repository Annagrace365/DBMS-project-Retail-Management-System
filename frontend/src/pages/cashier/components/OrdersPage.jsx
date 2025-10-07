// src/pages/cashier/components/OrdersPage.jsx
import React from "react";

/**
 * OrdersPage: placeholder for orders (delivery / pending orders).
 * Extend this with order detail UI, filters and actions.
 */
export default function OrdersPage() {
  return (
    <div>
      <h1>Orders</h1>
      <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
        <p style={{ color: "#6b7280" }}>This page will list store orders (delivery/pickup/layaway) and let you manage them.</p>

        <div style={{ marginTop: 12 }}>
          <div style={{ padding: 10, borderRadius: 8, border: "1px dashed #e6eefc" }}>
            <div style={{ fontWeight: 600 }}>No orders yet (demo)</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>Add order management features as needed.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
