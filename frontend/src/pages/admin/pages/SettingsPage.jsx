import React from "react";
import AdminLayout from "../components/layout/AdminLayout";

export default function SettingsPage() {
<<<<<<< HEAD
  const handleAction = (type) => {
    // Placeholder: implement edit/manage/configure functionality
    alert(`${type} clicked!`);
=======

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
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
  };

  return (
    <AdminLayout>
      {/* Page Header */}
<<<<<<< HEAD
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* System Parameters */}
        <section className="card">
          <h3 className="text-lg font-medium">System Parameters</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure tax rates, currency, and low-stock thresholds.
          </p>
          <button
            className="btn-settings-action mt-3"
            onClick={() => handleAction("Edit Parameters")}
          >
            Edit Parameters
          </button>
        </section>
        <br></br>
        {/* Role Management */}
        <section className="card">
          <h3 className="text-lg font-medium">Role Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add or update user roles (Admin, Staff, Inventory Manager).
          </p>
          <button
            className="btn-settings-action mt-3"
            onClick={() => handleAction("Manage Roles")}
          >
            Manage Roles
          </button>
        </section>
        <br></br>
        {/* Device Integration */}
        <section className="card">
          <h3 className="text-lg font-medium">Device Integration</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage barcode scanner and printer settings.
          </p>
          <button
            className="btn-settings-action mt-3"
            onClick={() => handleAction("Configure Devices")}
          >
            Configure Devices
          </button>
        </section>
      </div>
=======
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
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
    </AdminLayout>
  );
}
