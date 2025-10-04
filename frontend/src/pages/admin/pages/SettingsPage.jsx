import React from "react";
import AdminLayout from "../components/layout/AdminLayout";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-6">Settings</h2>

      <div className="space-y-4">
        <section className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium">System Parameters</h3>
          <p className="text-sm text-gray-600">
            Configure tax rates, currency, and low-stock thresholds.
          </p>
          <button className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">
            Edit Parameters
          </button>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium">Role Management</h3>
          <p className="text-sm text-gray-600">
            Add or update user roles (Admin, Staff, Inventory Manager).
          </p>
          <button className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">
            Manage Roles
          </button>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium">Device Integration</h3>
          <p className="text-sm text-gray-600">
            Manage barcode scanner and printer settings.
          </p>
          <button className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">
            Configure Devices
          </button>
        </section>
      </div>
    </AdminLayout>
  );
}
