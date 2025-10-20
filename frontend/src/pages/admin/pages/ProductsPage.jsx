import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", stock: "", supplier_ids: [] });
  const [suppliers, setSuppliers] = useState([]);
  const [currentProductId, setCurrentProductId] = useState(null); // For edit mode

  // Fetch products and suppliers
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

  const handleSupplierChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(o => parseInt(o.value));
    setForm({ ...form, supplier_ids: options });
  };

  const submitProduct = async () => {
    try {
      if (currentProductId) {
        // Edit product
        await api.patchProduct(currentProductId, {
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        });
      } else {
        // Create product
        await api.createProduct({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        });
      }

      setShowModal(false);
      setCurrentProductId(null);
      setForm({ name: "", price: "", stock: "", supplier_ids: [] });

      // Refresh products table
      const data = await api.listProducts();
      setProducts(Array.isArray(data) ? data : []);
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
    });
    setCurrentProductId(p.product_id);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center mb-6 w-full">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="ml-auto">
          <button
            onClick={() => { setForm({ name: "", price: "", stock: "", supplier_ids: [] }); setCurrentProductId(null); setShowModal(true); }}
            className="btn-add"
          >
            + Add Product
          </button>
        </div>
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
          <table className="card-table w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">SKU</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Supplier</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}>
                  <td className="p-2 border">{p.sku ?? `P-${(p.product_id ?? 0).toString().padStart(4, "0")}`}</td>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">₹ {p.price?.toFixed(2)}</td>
                  <td className="p-2 border">{p.stock ?? "-"}</td>
                  <td className="p-2 border">{p.supplier_name || "-"}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="px-2 py-1 bg-green-400 rounded hover:bg-green-500">Adjust Stock</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm mt-2">No products found</div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{currentProductId ? "Edit Product" : "Add Product"}</h2>

            <div className="flex flex-col mb-3">
              <label className="mb-1">Name:</label>
              <input
                className="border p-2 rounded"
                name="name"
                value={form.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col mb-3">
              <label className="mb-1">Price:</label>
              <input
                type="number"
                className="border p-2 rounded"
                name="price"
                value={form.price}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col mb-3">
              <label className="mb-1">Stock:</label>
              <input
                type="number"
                className="border p-2 rounded"
                name="stock"
                value={form.stock}
                onChange={handleInputChange}
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
                {suppliers.map(s => (
                  <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="btn-add"
                onClick={submitProduct}
              >
                {currentProductId ? "Update" : "Submit"}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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
