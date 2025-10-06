import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
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

  const columns = [
    { key: "name", title: "Supplier Name" },
    { key: "contact", title: "Contact" },
    { key: "phone", title: "Phone" },
    { key: "email", title: "Email" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Suppliers</h2>
        <button className="px-3 py-2 bg-blue-600 text-white rounded">
          Add Supplier
        </button>
      </div>

      {loading ? (
        <div>Loading suppliers...</div>
      ) : (
        <Table
          columns={columns}
          data={suppliers}
          renderRowActions={(row) => (
            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded">Edit</button>
              <button className="px-2 py-1 border rounded">Delete</button>
            </div>
          )}
        />
      )}
    </AdminLayout>
  );
}
