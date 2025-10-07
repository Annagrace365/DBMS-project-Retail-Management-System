// src/pages/cashier/components/Transactions.jsx
import React, { useState } from "react";
import { useCashier } from "./CashierContext";

/**
 * Transactions: lists saved transactions and allow viewing details.
 */
export default function Transactions() {
  const { transactions } = useCashier();
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "flex", gap: 18 }}>
      <div style={{ flex: 1 }}>
        <h1>Transactions</h1>
        {transactions.length === 0 ? (
          <div style={{ color: "#6b7280" }}>No transactions yet</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Method</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>₹ {t.cart.totals.total.toFixed(2)}</td>
                  <td>{t.payment.method}</td>
                  <td><button onClick={() => setSelected(t)} style={styles.viewBtn}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <aside style={{ width: 360 }}>
        <div style={{ padding: 12, background: "#fff", borderRadius: 8 }}>
          <h3>Transaction details</h3>
          {selected ? (
            <div>
              <div><strong>ID:</strong> {selected.id}</div>
              <div><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}</div>
              <div style={{ marginTop: 8 }}>
                <strong>Items</strong>
                <ul>
                  {selected.cart.items.map((it) => (
                    <li key={it.id}>{it.name} × {it.qty} — ₹ {(it.price * it.qty).toFixed(2)}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 8 }}><strong>Total:</strong> ₹ {selected.cart.totals.total.toFixed(2)}</div>
              <div style={{ marginTop: 8 }}><strong>Payment:</strong> {selected.payment.method}</div>
            </div>
          ) : (
            <div style={{ color: "#6b7280" }}>Select a transaction to view details</div>
          )}
        </div>
      </aside>
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
  viewBtn: { padding: "6px 10px", background: "#0b5fff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};
