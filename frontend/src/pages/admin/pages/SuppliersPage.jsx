import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { adminApi } from "../services/adminApi";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listSuppliers()
      .then((d) => setSuppliers(d || []))
      .catch((err) => console.error("Failed to fetch suppliers:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddSupplier = () => {
    // Open modal or navigate to add supplier page
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
        ) : suppliers.length > 0 ? (
          <table className="card-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.contact || "-"}</td>
                  <td>{s.phone || "-"}</td>
                  <td>{s.email || "-"}</td>
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
