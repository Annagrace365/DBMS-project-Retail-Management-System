import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
import { adminApi } from "../services/adminApi";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listPayments()
      .then((d) => setPayments(d || []))
      .catch((err) => console.error("Failed to fetch payments:", err))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "order_number", title: "Order #" },
    { key: "customer_name", title: "Customer" },
    { key: "amount", title: "Amount", render: (r) => `₹ ${r.amount}` },
    { key: "mode", title: "Mode" },
    { key: "date", title: "Date" },
  ];

  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">Payments</h2>

      {loading ? (
        <div>Loading payments...</div>
      ) : (
        <Table
          columns={columns}
          data={payments}
          renderRowActions={(row) => (
            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded">View</button>
              <button className="px-2 py-1 border rounded">Refund</button>
            </div>
          )}
        />
      )}
    </AdminLayout>
  );
}
