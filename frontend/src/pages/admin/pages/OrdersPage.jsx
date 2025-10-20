import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const handleViewOrder = async (orderId) => {
    try {
      const data = await api.getOrder(orderId);
      setSelectedOrder(data);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
    }
  };

  const closeModal = () => setSelectedOrder(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Orders</h2>

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
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Cashier</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Amount</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Date</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Status</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.order_number}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{o.order_number}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{o.customer_name || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{o.cashier_name || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>₹ {o.total}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{o.status}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    <button
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#facc15",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => handleViewOrder(o.order_number)}
                    >
                      View
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

      {/* Modal */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal} // click outside closes modal
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 24,
              borderRadius: 8,
              width: "80%",
              maxHeight: "80%",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            <h3>Order #{selectedOrder.order_id} Details</h3>
            <p>Customer: {selectedOrder.customer_name}</p>
            <p>Cashier: {selectedOrder.cashier_name}</p>
            <p>Status: {selectedOrder.status}</p>
            <p>Subtotal: ₹ {selectedOrder.subtotal}</p>
            <p>Tax: ₹ {selectedOrder.tax}</p>
            <p>Total: ₹ {selectedOrder.amount}</p>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
              <thead style={{ backgroundColor: "#e5e7eb" }}>
                <tr>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>Product</th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>Price</th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>Quantity</th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{item.name || item.product_name}</td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>₹ {item.price}</td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{item.quantity}</td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>₹ {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
