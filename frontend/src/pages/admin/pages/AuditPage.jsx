import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Table from "../components/ui/Table";
import { adminApi } from "../services/adminApi";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    adminApi.listAuditLogs?.().then((d) => setLogs(d || []));
  }, []);

  const cols = [
    { key: "user", title: "User" },
    { key: "action", title: "Action" },
    { key: "entity", title: "Entity" },
    { key: "timestamp", title: "Time" },
  ];

  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-4">Audit Log</h2>
      <Table columns={cols} data={logs} />
    </AdminLayout>
  );
}
