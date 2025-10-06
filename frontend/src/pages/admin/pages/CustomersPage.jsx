import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
import api from "../services/adminApi"; // use default api

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.listCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    { key: "name", title: "Name", render: (r) => r.name },
    { key: "phone", title: "Phone" },
    { key: "email", title: "Email" },
    { key: "orders_count", title: "Orders", render: (r) => r.orders_count || 0 },
    { key: "last_order_date", title: "Last Order", render: (r) => r.last_order_date || "-" },
  ];

  // Example: addCustomer handler (optional)
  const handleAddCustomer = async () => {
    const name = prompt("Enter customer name:");
    if (!name) return;
    const phone = prompt("Enter phone:");
    const email = prompt("Enter email:");

    try {
      await api.createCustomer({ name, phone, email });
      fetchCustomers(); // refresh table
    } catch (err) {
      console.error("Failed to add customer:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Customers</h2>
        
      </div>

      <Table
        columns={columns}
        data={loading ? [] : customers}
        
      />
    </AdminLayout>
  );
}
