import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
import { adminApi } from "../services/adminApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    adminApi.listProducts().then((d)=>setProducts(d || []));
  }, []);

  const columns = [
    { key: "sku", title: "SKU" },
    { key: "name", title: "Name" },
    { key: "price", title: "Price", render: r => `₹ ${r.price}` },
    { key: "stock", title: "Stock" },
    { key: "supplier", title: "Supplier", render: r => r.supplier_name || "-" },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div>
          <button className="px-3 py-2 bg-blue-600 text-white rounded">Add Product</button>
        </div>
      </div>

      <Table columns={columns} data={products} renderRowActions={(row)=>(
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded">Edit</button>
          <button className="px-2 py-1 border rounded">Adjust Stock</button>
        </div>
      )} />
    </AdminLayout>
  );
}
