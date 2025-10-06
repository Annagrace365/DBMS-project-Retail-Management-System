import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
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

  const columns = [
    { key: "order_number", title: "Order #", render: (r) => r.order_number },
    { key: "customer_name", title: "Customer", render: (r) => r.customer_name || "-" },
    { key: "total", title: "Total", render: (r) => `₹ ${r.total}` },
    { key: "created_at", title: "Date", render: (r) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div>
          <button className="px-3 py-2 bg-green-600 text-white rounded">Create Order</button>
        </div>
      </div>

      <Table
        columns={columns}
        data={loading ? [] : orders}
        renderRowActions={(row) => (
          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded">View</button>
            <button className="px-2 py-1 border rounded">Invoice</button>
          </div>
        )}
      />
    </AdminLayout>
  );
}
