import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Payments</h2>
      </div>

      {/* Payments Table */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <div>Loading payments...</div>
        ) : error ? (
          <div style={{ color: "red", padding: 12 }}>
            <strong>Error loading payments</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{String(error)}</pre>
          </div>
        ) : payments.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Order Number</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Customer</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Amount</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Payment Mode</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{p.order_number}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{p.customer_name}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>₹ {p.amount.toFixed(2)}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{p.mode}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280", marginTop: 8 }}>No payments found</div>
        )}
      </div>
    </AdminLayout>
  );
}
