// src/pages/cashier/components/CashierIndex.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCashier } from "./CashierContext";

/**
 * CashierIndex: landing dashboard for cashier.
 * Shows quick KPIs, Recent Transactions, and shortcuts.
 */
export default function CashierIndex() {
  const navigate = useNavigate();
  const { transactions, heldInvoices } = useCashier();

  const recent = transactions.slice(0, 5);

  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 14 }}>Cashier Dashboard</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <Card title="Today's Sales" value={`₹ ${getSumToday(transactions).toFixed(2)}`} />
        <Card title="Held Invoices" value={heldInvoices.length} />
        <Card title="Transactions" value={transactions.length} />
        <Card title="Quick POS" value={<button onClick={() => navigate("/cashier/pos")} style={styles.quickBtn}>Open POS</button>} />
      </div>

      <section>
        <h3 style={{ marginTop: 0 }}>Recent transactions</h3>
        {recent.length === 0 ? (
          <div style={{ color: "#6b7280" }}>No recent transactions</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>₹ {t.cart.totals.total.toFixed(2)}</td>
                  <td>{t.payment.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8, minWidth: 160, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ color: "#6b7280", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 20, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function getSumToday(transactions) {
  const today = new Date().toDateString();
  return transactions.reduce((sum, t) => {
    if (new Date(t.createdAt).toDateString() === today) {
      return sum + (t.cart?.totals?.total || 0);
    }
    return sum;
  }, 0);
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  quickBtn: {
    padding: "8px 12px",
    background: "#0b5fff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
