import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentSupplier, setCurrentSupplier] = useState({ name: "", contact: "", supplier_id: null });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.listSuppliers();
        if (!mounted) return;
        setSuppliers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        setError(err.response?.data || err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  // ---------- Modal handlers ----------
  const openAddModal = () => {
    setModalMode("add");
    setCurrentSupplier({ name: "", contact: "", supplier_id: null });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setModalMode("edit");
    setCurrentSupplier({ ...supplier });
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        const data = await api.createSupplier({ name: currentSupplier.name, email: currentSupplier.contact });
        setSuppliers((prev) => [...prev, { supplier_id: data.supplier_id, name: data.name, contact: currentSupplier.contact, products: [] }]);
        alert("Supplier added successfully");
      } else if (modalMode === "edit") {
        await api.patchSupplier(currentSupplier.supplier_id, { name: currentSupplier.name, email: currentSupplier.contact });
        setSuppliers((prev) =>
          prev.map((s) =>
            s.supplier_id === currentSupplier.supplier_id
              ? { ...s, name: currentSupplier.name, contact: currentSupplier.contact }
              : s
          )
        );
        alert("Supplier updated successfully");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  // ---------- Delete ----------
  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await api.deleteSupplier(supplierId);
      setSuppliers((prev) => prev.filter((s) => s.supplier_id !== supplierId));
      alert("Supplier deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete supplier");
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Suppliers</h2>
        <button
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            backgroundColor: "#22c55e",
            color: "#fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
          onClick={openAddModal}
        >
          + Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <div>Loading suppliers...</div>
        ) : error ? (
          <div style={{ color: "red", padding: 12 }}>
            <strong>Error loading suppliers</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{String(error)}</pre>
          </div>
        ) : suppliers.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Supplier Name</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Contact</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Products</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.supplier_id}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{s.name}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{s.contact || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {s.products && s.products.length > 0 ? s.products.join(", ") : "-"}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    <button
                      style={{
                        marginRight: 8,
                        padding: "4px 8px",
                        backgroundColor: "#facc15",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => openEditModal(s)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => handleDeleteSupplier(s.supplier_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280", marginTop: 8 }}>No suppliers found</div>
        )}
      </div>

      {/* ---------- Modal ---------- */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 8, width: 400 }}>
            <h3>{modalMode === "add" ? "Add Supplier" : "Edit Supplier"}</h3>
            <form onSubmit={handleModalSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label>Name:</label>
                <input
                  type="text"
                  value={currentSupplier.name}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, name: e.target.value })}
                  style={{ width: "100%", padding: 8, marginTop: 4 }}
                  required
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>Contact (Email):</label>
                <input
                  type="email"
                  value={currentSupplier.contact}
                  onChange={(e) => setCurrentSupplier({ ...currentSupplier, contact: e.target.value })}
                  style={{ width: "100%", padding: 8, marginTop: 4 }}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "6px 12px", borderRadius: 4, backgroundColor: "#22c55e", color: "#fff", cursor: "pointer" }}
                >
                  {modalMode === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
