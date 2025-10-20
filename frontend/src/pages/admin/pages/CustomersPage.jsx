import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", orders_count: 0, last_order_date: "" });
  const [currentCustomerId, setCurrentCustomerId] = useState(null); // For edit mode

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitCustomer = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }
    try {
      if (currentCustomerId) {
        await api.updateCustomer(currentCustomerId, form);
      } else {
        await api.createCustomer(form);
      }

      const data = await api.listCustomers();
      setCustomers(Array.isArray(data) ? data : []);

      setShowModal(false);
      setCurrentCustomerId(null);
      setForm({ name: "", phone: "", address: "", orders_count: 0, last_order_date: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save customer");
    }
  };

  const handleEdit = (c) => {
    setForm({
      name: c.name,
      phone: c.phone,
      address: c.address,
      orders_count: c.orders_count || 0,
      last_order_date: c.last_order_date || "",
    });
    setCurrentCustomerId(c.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer");
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Customers</h2>
        <button
          style={{ marginLeft: "auto", padding: "8px 16px", backgroundColor: "#22c55e", color: "#fff", borderRadius: 6, cursor: "pointer" }}
          onClick={() => { setForm({ name: "", phone: "", address: "", orders_count: 0, last_order_date: "" }); setCurrentCustomerId(null); setShowModal(true); }}
        >
          + Add Customer
        </button>
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
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Actions</th>
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
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    <button style={{ marginRight: 8, padding: "4px 8px", backgroundColor: "#facc15", borderRadius: 4, cursor: "pointer" }} onClick={() => handleEdit(c)}>Edit</button>
                    <button style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "#fff", borderRadius: 4, cursor: "pointer" }} onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280" }}>No customers found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
        }}>
          <div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 8, width: 400 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{currentCustomerId ? "Edit Customer" : "Add Customer"}</h2>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Name:</label>
              <input style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="name" value={form.name} onChange={handleInputChange} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Phone:</label>
              <input style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="phone" value={form.phone} onChange={handleInputChange} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Address:</label>
              <textarea style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="address" value={form.address} onChange={handleInputChange} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Orders:</label>
              <input type="number" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="orders_count" value={form.orders_count} onChange={handleInputChange} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Last Order:</label>
              <input type="date" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="last_order_date" value={form.last_order_date} onChange={handleInputChange} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{ padding: "8px 16px", backgroundColor: "#22c55e", color: "#fff", borderRadius: 6, cursor: "pointer" }}
                onClick={submitCustomer}
              >
                {currentCustomerId ? "Update" : "Submit"}
              </button>
              <button
                style={{ padding: "8px 16px", backgroundColor: "#e5e7eb", borderRadius: 6, cursor: "pointer" }}
                onClick={() => { setShowModal(false); setCurrentCustomerId(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </AdminLayout>
  );
}
