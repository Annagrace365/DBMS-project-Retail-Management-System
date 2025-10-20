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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Payments</h2>
      </div>

      {/* Payments Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : error ? (
          <div style={{ color: "red", padding: 12 }}>
            <strong>Error loading payments</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{String(error)}</pre>
          </div>
        ) : payments.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id}>
                  <td>{p.order_number}</td>
                  <td>{p.customer_name}</td>
                  <td>₹ {p.amount.toFixed(2)}</td>
                  <td>{p.mode}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 mt-2">No payments found</div>
        )}
      </div>
    </AdminLayout>
  );
}
