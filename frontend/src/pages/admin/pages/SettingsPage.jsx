import React from "react";
import AdminLayout from "../components/layout/AdminLayout";

export default function SettingsPage() {
  const handleAction = (type) => {
    // Placeholder: implement edit/manage/configure functionality
    alert(`${type} clicked!`);
  };

  return (
    <AdminLayout>
      {/* Page Header */}
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
    </AdminLayout>
  );
}
