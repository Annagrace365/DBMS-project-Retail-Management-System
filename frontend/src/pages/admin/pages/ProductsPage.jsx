import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { adminApi } from "../services/adminApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listProducts()
      .then((d) => setProducts(d || []))
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  // Add Product handler
  const handleAddProduct = () => {
    // You can implement modal or redirect to add product page
    alert("Add Product clicked!");
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center mb-6 w-full">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="ml-auto">
          <button onClick={handleAddProduct} className="btn-add-product">
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>₹ {p.price}</td>
                  <td>{p.stock}</td>
                  <td>{p.supplier_name || "-"}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-row-action">Edit</button>
                      <button className="btn-row-action">Adjust Stock</button>
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
    </AdminLayout>
  );
}
