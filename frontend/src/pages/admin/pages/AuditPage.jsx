import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";

export default function AuditPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const mockLogs = [
      { user: "Admin", action: "Created", entity: "Product: Milk 1L", timestamp: "2025-10-21 09:00:12" },
      { user: "Admin", action: "Updated", entity: "Customer: John Doe", timestamp: "2025-10-21 09:05:23" },
      { user: "System", action: "Deleted", entity: "Order: #102", timestamp: "2025-10-21 09:10:45" },
      { user: "Admin", action: "Created", entity: "Product: Camlin Notebook", timestamp: "2025-10-21 09:15:30" },
      { user: "Admin", action: "Updated", entity: "Supplier: PaperGrid Ltd.", timestamp: "2025-10-21 09:20:12" },
      { user: "System", action: "Deleted", entity: "Customer: Jane Smith", timestamp: "2025-10-21 09:25:40" },
      { user: "Admin", action: "Created", entity: "Order: #103", timestamp: "2025-10-21 09:30:18" },
      { user: "Admin", action: "Updated", entity: "Product: Pen Set", timestamp: "2025-10-21 09:35:05" },
      { user: "System", action: "Deleted", entity: "Order: #100", timestamp: "2025-10-21 09:40:22" },
      { user: "Admin", action: "Created", entity: "Customer: Alice Cooper", timestamp: "2025-10-21 09:45:33" },
      { user: "Admin", action: "Updated", entity: "Product: Paper Pack", timestamp: "2025-10-21 09:50:12" },
      { user: "System", action: "Deleted", entity: "Supplier: Stationery Co.", timestamp: "2025-10-21 09:55:47" },
      { user: "Admin", action: "Created", entity: "Order: #104", timestamp: "2025-10-21 10:00:05" },
      { user: "Admin", action: "Updated", entity: "Customer: Bob Marley", timestamp: "2025-10-21 10:05:22" },
      { user: "System", action: "Deleted", entity: "Product: Old Pen Set", timestamp: "2025-10-21 10:10:30" },
      { user: "Admin", action: "Created", entity: "Product: Sketch Book", timestamp: "2025-10-21 10:15:44" },
      { user: "Admin", action: "Updated", entity: "Supplier: Ink Masters", timestamp: "2025-10-21 10:20:51" },
      { user: "System", action: "Deleted", entity: "Customer: Charlie Brown", timestamp: "2025-10-21 10:25:37" },
      { user: "Admin", action: "Created", entity: "Order: #105", timestamp: "2025-10-21 10:30:18" },
      { user: "Admin", action: "Updated", entity: "Product: Pencil Box", timestamp: "2025-10-21 10:35:25" },
      { user: "System", action: "Deleted", entity: "Order: #101", timestamp: "2025-10-21 10:40:12" },
      { user: "Admin", action: "Created", entity: "Customer: Diana Prince", timestamp: "2025-10-21 10:45:33" },
      { user: "Admin", action: "Updated", entity: "Product: Eraser Pack", timestamp: "2025-10-21 10:50:09" },
      { user: "System", action: "Deleted", entity: "Supplier: PaperWorld", timestamp: "2025-10-21 10:55:42" },
      { user: "Admin", action: "Created", entity: "Order: #106", timestamp: "2025-10-21 11:00:11" },
      { user: "Admin", action: "Updated", entity: "Customer: Edward Norton", timestamp: "2025-10-21 11:05:28" }
    ];
    setLogs(mockLogs);
  }, []);

  return (
    <AdminLayout>
      <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Audit Log</h2>
      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          overflowX: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          padding: "10px"
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", backgroundColor: "#f3f4f6" }}>User</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", backgroundColor: "#f3f4f6" }}>Action</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", backgroundColor: "#f3f4f6" }}>Entity</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left", backgroundColor: "#f3f4f6" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.user}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.action}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.entity}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
