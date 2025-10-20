import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.listOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);



  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Orders</h2>

      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <div>Loading orders...</div>
        ) : orders.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Order #</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Customer</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Total</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Date</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{o.order_number}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{o.customer_name || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>₹ {o.total}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    <button
                      style={{
                        marginRight: 8,
                        padding: "4px 8px",
                        backgroundColor: "#facc15",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280", marginTop: 8 }}>No orders found</div>
        )}
      </div>
    </AdminLayout>
  );
}
