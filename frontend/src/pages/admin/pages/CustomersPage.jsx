import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
import { adminApi } from "../services/adminApi";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listCustomers().then((data) => {
      setCustomers(data || []);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  const columns = [
    { key: "name", title: "Name", render: (r) => r.name },
    { key: "phone", title: "Phone" },
    { key: "email", title: "Email" },
    { key: "orders_count", title: "Orders", render: (r) => r.orders_count || 0 },
    { key: "last_order_date", title: "Last Order", render: (r) => r.last_order_date || "-" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Customers</h2>
        <div>
          <button className="px-3 py-2 bg-blue-600 text-white rounded">Add Customer</button>
        </div>
      </div>

      <Table columns={columns} data={loading ? [] : customers} renderRowActions={(row) => (
        <div className="flex gap-2">
          <button className="text-sm px-2 py-1 border rounded">View</button>
          <button className="text-sm px-2 py-1 border rounded">Edit</button>
        </div>
      )} />
    </AdminLayout>
  );
}
