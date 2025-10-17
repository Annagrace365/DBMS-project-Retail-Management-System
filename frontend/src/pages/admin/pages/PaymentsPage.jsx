import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { adminApi } from "../services/adminApi";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listPayments()
      .then((d) => setPayments(d || []))
      .catch((err) => console.error("Failed to fetch payments:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 w-full">
        <h2 className="text-2xl font-semibold">Payments</h2>
        {/* Optional: Add Payment button */}
        {/* <button className="btn-add-payment">+ Add Payment</button> */}
      </div>

      {/* Payments Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : payments.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.order_number}</td>
                  <td>{p.customer_name || "-"}</td>
                  <td>₹ {p.amount}</td>
                  <td>{p.mode}</td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-row-action">View</button>
                      <button className="btn-row-action">Refund</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm mt-2">No payments found</div>
        )}
      </div>
    </AdminLayout>
  );
}
