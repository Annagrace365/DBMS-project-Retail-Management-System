import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";
import "../../../styles/Customers.css"; // adjust path

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    orders_count: 0,
    last_order_date: "",
  });

  // Fetch customers
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

  // Modal handlers
  const handleAddCustomer = () => {
    setNewCustomer({ name: "", phone: "", address: "", orders_count: 0, last_order_date: "" });
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new or updated customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.address) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (newCustomer.id) {
        // Update existing customer
        await api.updateCustomer(newCustomer.id, newCustomer);
      } else {
        // Create new customer
        await api.createCustomer(newCustomer);
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (err) {
      console.error("Failed to save customer:", err.response || err);
      alert("Failed to save customer");
    }
  };

  // Edit & Delete handlers
  const handleEdit = (c) => {
    setNewCustomer({
      id: c.id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      orders_count: c.orders_count || 0,
      last_order_date: c.last_order_date || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.deleteCustomer(id);
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete customer:", err);
      alert("Failed to delete customer");
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Customers</h2>
        <button onClick={handleAddCustomer} className="btn-add">
          + Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading customers...</div>
        ) : customers.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Orders</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.phone || "-"}</td>
                  <td>{c.address || "-"}</td>
                  <td>{c.orders_count || 0}</td>
                  <td>
                    {c.last_order_date
                      ? new Date(c.last_order_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-row-action" onClick={() => handleEdit(c)}>
                        Edit
                      </button>
                      <button className="btn-row-action" onClick={() => handleDelete(c.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 mt-2">No customers found</div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{newCustomer.id ? "Edit Customer" : "Add New Customer"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newCustomer.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={handleChange}
              />
              <textarea
                name="address"
                placeholder="Address"
                value={newCustomer.address}
                onChange={handleChange}
              />
              <input
                type="number"
                name="orders_count"
                placeholder="Orders"
                value={newCustomer.orders_count}
                onChange={handleChange}
              />
              <input
                type="date"
                name="last_order_date"
                placeholder="Last Order"
                value={newCustomer.last_order_date}
                onChange={handleChange}
              />
              <div className="modal-buttons">
                <button type="submit" className="btn-submit">
                  {newCustomer.id ? "Update Customer" : "Add Customer"}
                </button>
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
