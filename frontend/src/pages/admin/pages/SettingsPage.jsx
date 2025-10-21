import React from "react";
import AdminLayout from "../components/layout/AdminLayout";

export default function SettingsPage() {

  // Placeholder functions for device actions
  const handleTestScanner = () => {
    alert("Testing barcode scanner... Scan a barcode now.");
  };

  const handlePrintTestPage = () => {
    alert("Printing test page...");
    // Example: window.print() could be used for demo
    window.print();
  };

  const handleConfigureDevices = () => {
    alert("Opening device configuration panel...");
    // Here you could navigate to a config page or open a modal
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>Device Settings</h2>
      </div>

      {/* Device Integration Section */}
      <section style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", backgroundColor: "#ffffff" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "500" }}>Device Integration</h3>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
          Manage barcode scanner and printer settings.
        </p>

        <div style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            style={{ padding: "8px 16px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            onClick={handleTestScanner}
          >
            Test Scanner
          </button>

          <button
            style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            onClick={handlePrintTestPage}
          >
            Print Test Page
          </button>

          <button
            style={{ padding: "8px 16px", backgroundColor: "#f59e0b", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            onClick={handleConfigureDevices}
          >
            Configure Devices
          </button>
        </div>
      </section>
    </AdminLayout>
  );
}
