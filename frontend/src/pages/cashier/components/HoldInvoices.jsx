// src/pages/cashier/components/HoldInvoices.jsx
import React from "react";
import { useCashier } from "./CashierContext";
import { useNavigate } from "react-router-dom";

/**
 * HoldInvoices: lists held invoices and allows restore or delete.
 */
export default function HoldInvoices() {
  const { heldInvoices, restoreHeldInvoice, setHeldInvoices } = useCashier();
  const navigate = useNavigate();

  function handleRestore(id) {
    const restored = restoreHeldInvoice(id);
    if (restored) {
      // navigate to POS where the cart will be restored
      navigate("/cashier/pos");
    }
  }

  function handleDelete(id) {
    if (!confirm("Delete held invoice?")) return;
    setHeldInvoices((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div>
      <h1>Held Invoices</h1>
      {heldInvoices.length === 0 ? (
        <div style={{ color: "#6b7280" }}>No held invoices</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {heldInvoices.map((h) => (
            <div key={h.id} style={{ padding: 12, background: "#fff", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{h.name}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{new Date(h.createdAt).toLocaleString()}</div>
                <div style={{ marginTop: 6 }}>Items: {h.cart.items.length} • Total: ₹ {h.cart.totals.total.toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleRestore(h.id)} style={styles.restore}>Resume</button>
                <button onClick={() => handleDelete(h.id)} style={styles.delete}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  restore: { padding: "8px 10px", background: "#0b5fff", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" },
  delete: { padding: "8px 10px", background: "#ef4444", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" },
};
