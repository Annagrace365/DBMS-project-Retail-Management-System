import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!api || typeof api.listSuppliers !== "function") {
          throw new Error("api.listSuppliers is not available — check adminApi export/import");
        }
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

  const handleAddSupplier = () => {
    alert("Add Supplier clicked!");
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center mb-6 w-full">
        <h2 className="text-2xl font-semibold">Suppliers</h2>
        <div className="ml-auto">
          <button onClick={handleAddSupplier} className="btn-add-supplier">
            + Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="card">
        {loading ? (
          <div className="loading">Loading suppliers...</div>
        ) : error ? (
          <div style={{ color: "red", padding: 12 }}>
            <strong>Error loading suppliers</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>{String(error)}</pre>
          </div>
        ) : suppliers.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Contact</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.supplier_id ?? s.id ?? s.name}>
                  <td>{s.name}</td>
                  <td>{s.contact}</td>
                  <td>
                    {s.products && s.products.length > 0
                      ? s.products.join(", ")
                      : "-"}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-row-action">Edit</button>
                      <button className="btn-row-action">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-sm mt-2">No suppliers found</div>
        )}
      </div>
    </AdminLayout>
  );
}
