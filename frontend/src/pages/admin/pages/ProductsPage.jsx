// src/pages/admin/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", stock: "", supplier_ids: [], newSupplierName: "", newSupplierEmail: "" });
  const [suppliers, setSuppliers] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null); // For edit mode

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const prodData = await api.listProducts();
        if (!mounted) return;
        setProducts(Array.isArray(prodData) ? prodData : []);

        const suppData = await api.listSuppliers();
        if (!mounted) return;
        setSuppliers(Array.isArray(suppData) ? suppData : []);
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

  const submitProduct = async () => {
    try {
      let supplierIds = [...form.supplier_ids];

      // Create new supplier if provided
      if (form.newSupplierName && form.newSupplierEmail) {
        const newSupplier = await api.createSupplier({ name: form.newSupplierName, email: form.newSupplierEmail });
        supplierIds = [newSupplier.supplier_id];
      }

      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        supplier_ids: supplierIds,
      };

      if (currentProductId) {
        await api.patchProduct(currentProductId, payload);
      } else {
        await api.createProduct(payload);
      }

      // Refresh products
      const data = await api.listProducts();
      setProducts(Array.isArray(data) ? data : []);

      // Reset form
      setShowModal(false);
      setCurrentProductId(null);
      setForm({ name: "", price: "", stock: "", supplier_ids: [], newSupplierName: "", newSupplierEmail: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      supplier_ids: p.suppliers?.map(s => s.supplier_id) || [],
      newSupplierName: "",
      newSupplierEmail: "",
    });
    setCurrentProductId(p.product_id);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Products</h2>
        <button
          style={{ marginLeft: "auto", padding: "8px 16px", backgroundColor: "#22c55e", color: "#fff", borderRadius: 6, cursor: "pointer" }}
          onClick={() => { setForm({ name: "", price: "", stock: "", supplier_ids: [], newSupplierName: "", newSupplierEmail: "" }); setCurrentProductId(null); setShowModal(true); }}
        >
          + Add Product
        </button>
      </div>

      <div style={{ backgroundColor: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        {loading ? (
          <div>Loading products...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error loading products: {String(error)}</div>
        ) : products.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>SKU</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Name</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Price</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Stock</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Supplier</th>
                <th style={{ padding: 8, border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.product_id}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{p.sku ?? `P-${(p.product_id ?? 0).toString().padStart(4, "0")}`}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{p.name}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>₹ {p.price?.toFixed(2)}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{p.stock ?? "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{p.supplier_name || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    <button style={{ marginRight: 8, padding: "4px 8px", backgroundColor: "#facc15", borderRadius: 4, cursor: "pointer" }} onClick={() => handleEdit(p)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280" }}>No products found</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50
        }}>
          <div style={{ backgroundColor: "#fff", padding: 24, borderRadius: 8, width: 400 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>{currentProductId ? "Edit Product" : "Add Product"}</h2>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Name:</label>
              <input style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="name" value={form.name} onChange={handleInputChange} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Price:</label>
              <input type="number" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="price" value={form.price} onChange={handleInputChange} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Stock:</label>
              <input type="number" style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }} name="stock" value={form.stock} onChange={handleInputChange} />
            </div>

            {/* Existing Supplier Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
              <label style={{ marginBottom: 4 }}>Select Existing Supplier:</label>
              <select
                style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
                value={form.supplier_ids[0] || ""}
                onChange={e => setForm({ ...form, supplier_ids: e.target.value ? [parseInt(e.target.value)] : [] })}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map(s => (
                  <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Add New Supplier */}
            <div style={{ marginBottom: 12, borderTop: "1px solid #eee", paddingTop: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Or Add New Supplier:</h3>
              <input
                style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6, marginBottom: 8 }}
                placeholder="Supplier Name"
                name="newSupplierName"
                value={form.newSupplierName}
                onChange={handleInputChange}
              />
              <input
                style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
                placeholder="Supplier Email"
                name="newSupplierEmail"
                value={form.newSupplierEmail}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{ padding: "8px 16px", backgroundColor: "#22c55e", color: "#fff", borderRadius: 6, cursor: "pointer" }}
                onClick={submitProduct}
              >
                {currentProductId ? "Update" : "Submit"}
              </button>
              <button
                style={{ padding: "8px 16px", backgroundColor: "#e5e7eb", borderRadius: 6, cursor: "pointer" }}
                onClick={() => { setShowModal(false); setCurrentProductId(null); }}
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
