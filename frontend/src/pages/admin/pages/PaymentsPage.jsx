import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";
import "../../../styles/Customers.css"; // reuse modal CSS

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    supplier_ids: [],
  });
  const [suppliers, setSuppliers] = useState([]);

  // Fetch products and suppliers
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const prodData = await api.listProducts();
      setProducts(Array.isArray(prodData) ? prodData : []);

      const suppData = await api.listSuppliers();
      setSuppliers(suppData || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSupplierChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => parseInt(o.value));
    setForm((prev) => ({ ...prev, supplier_ids: options }));
  };

  const handleAddProduct = () => {
    setForm({ id: null, name: "", price: "", stock: "", supplier_ids: [] });
    setModalOpen(true);
  };

  const handleEdit = (p) => {
    setForm({
      id: p.product_id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      supplier_ids: p.suppliers?.map((s) => s.supplier_id) || [],
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.patchProduct(form.id, {
          name: form.name,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          supplier_ids: form.supplier_ids,
        });
      } else {
        await api.createProduct({
          name: form.name,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          supplier_ids: form.supplier_ids,
        });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button onClick={handleAddProduct} className="btn-add">
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div style={{ color: "red", padding: 12 }}>
            <strong>Error loading products</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{String(error)}</pre>
          </div>
        ) : products.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Suppliers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}>
                  <td>{p.sku ?? `P-${(p.product_id ?? 0).toString().padStart(4, "0")}`}</td>
                  <td>{p.name}</td>
                  <td>₹ {p.price?.toFixed(2)}</td>
                  <td>{p.stock ?? "-"}</td>
                  <td>{p.suppliers?.map((s) => s.name).join(", ") || "-"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-row-action" onClick={() => handleEdit(p)}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 mt-2">No products found</div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{form.id ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-3">
                <label className="mb-1">Name:</label>
                <input
                  className="border p-2 rounded"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1">Price:</label>
                <input
                  className="border p-2 rounded"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1">Stock:</label>
                <input
                  className="border p-2 rounded"
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="mb-1">Suppliers:</label>
                <select
                  multiple
                  className="border p-2 rounded h-24"
                  value={form.supplier_ids}
                  onChange={handleSupplierChange}
                >
                  {suppliers.map((s) => (
                    <option key={s.supplier_id} value={s.supplier_id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {form.id ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseModal}
                >
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
