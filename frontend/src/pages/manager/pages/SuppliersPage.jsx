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



  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Suppliers</h2>

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
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.supplier_id ?? s.id ?? s.name}>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{s.name}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>{s.contact || "-"}</td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {s.products && s.products.length > 0 ? s.products.join(", ") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280", marginTop: 8 }}>No suppliers found</div>
        )}
      </div>
    </AdminLayout>
  );
}
