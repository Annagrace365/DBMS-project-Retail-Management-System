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

  // Create Order button handler
  const handleCreateOrder = () => {
    // Open modal or navigate to order creation page
    alert("Create Order clicked!");
  };

  return (
    <AdminLayout>
      {/* Header with right-aligned button */}
      <div className="flex items-center mb-6 w-full">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <div className="ml-auto">
          <button onClick={handleCreateOrder} className="btn-create-order">
            + Create Order
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.order_number}</td>
                  <td>{o.customer_name || "-"}</td>
                  <td>₹ {o.total}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-row-action">View</button>
                      <button className="btn-row-action">Invoice</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm mt-2">No orders found</div>
        )}
      </div>
    </AdminLayout>
  );
}
