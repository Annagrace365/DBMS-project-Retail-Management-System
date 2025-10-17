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
        <Card
          title="Quick POS"
          value={
            <button onClick={() => navigate("/cashier/pos")} style={styles.quickBtn}>
              Open POS
            </button>
          }
        />
      </div>

      <section>
        <h3 style={{ marginTop: 0 }}>Recent transactions</h3>
        {recent.length === 0 ? (
          <div style={{ color: "#6b7280" }}>No recent transactions</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Method</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={{
                      ...styles.tbodyRow,
                      backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#fff",
                    }}
                  >
                    <td style={styles.td}>{t.id}</td>
                    <td style={styles.td}>{new Date(t.createdAt).toLocaleString()}</td>
                    <td style={styles.td}>₹ {t.cart.totals.total.toFixed(2)}</td>
                    <td style={styles.td}>{t.payment.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: 16,
        background: "#fff",
        borderRadius: 8,
        minWidth: 160,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
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
    borderCollapse: "separate",
    borderSpacing: 0,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    backgroundColor: "#fff",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },
  theadRow: {
    backgroundColor: "#f1f5f9",
    color: "#374151",
    fontWeight: 600,
    textAlign: "left",
  },
  th: {
    padding: "12px 16px",
    fontSize: "0.95rem",
  },
  tbodyRow: {
    transition: "all 0.15s ease-in-out",
  },
  td: {
    padding: "12px 16px",
    color: "#1f2937",
    fontSize: "0.93rem",
    borderBottom: "1px solid #e5e7eb",
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
