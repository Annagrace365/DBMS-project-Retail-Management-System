import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi"; // default API

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

  // Add new customer
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <button
          onClick={handleAddCustomer}
          className="btn-add-customer"
        >
          + Add Customer 
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading customers...</div>
        ) : customers.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone || "-"}</td>
                  <td>{c.email || "-"}</td>
                  <td>{c.orders_count || 0}</td>
                  <td>
                    {c.last_order_date
                      ? new Date(c.last_order_date).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm mt-2">No customers found</div>
        )}
      </div>
    </AdminLayout>
  );
}
