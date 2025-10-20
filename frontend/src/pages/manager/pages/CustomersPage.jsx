import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.listCustomers();
        if (!mounted) return;
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data || err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Customers</h2>
      </div>

      <div style={{ backgroundColor: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <div>Loading customers...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error loading customers: {String(error)}</div>
        ) : customers.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Name</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Phone</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Address</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Orders</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{c.name}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{c.phone || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{c.address || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{c.orders_count || 0}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280" }}>No customers found</div>
        )}
      </div>
    </AdminLayout>
  );
}
