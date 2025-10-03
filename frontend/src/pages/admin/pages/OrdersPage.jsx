import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
import { adminApi } from "../services/adminApi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminApi.listOrders().then((d) => setOrders(d || []));
  }, []);

  const cols = [
    { key: "order_number", title: "Order #" },
    { key: "customer_name", title: "Customer", render: r => r.customer_name || "-" },
    { key: "total", title: "Total", render: r => `₹ ${r.total}` },
    { key: "status", title: "Status" },
    { key: "created_at", title: "Date" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div>
          <button className="px-3 py-2 bg-green-600 text-white rounded">Create Order</button>
        </div>
      </div>

      <Table columns={cols} data={orders} renderRowActions={(row) => (
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded">View</button>
          <button className="px-2 py-1 border rounded">Invoice</button>
        </div>
      )} />
    </AdminLayout>
  );
}
