import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Card from "../components/ui/Card";

export default function ReportsPage() {
  return (
    <AdminLayout>
      <h2 className="text-xl font-semibold mb-6">Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Sales Report">
          <p className="text-sm text-gray-600">
            Generate daily, weekly, or monthly sales reports.
          </p>
          <button className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">
            View Sales Report
          </button>
        </Card>

        <Card title="Stock Report">
          <p className="text-sm text-gray-600">
            Check stock valuation, low stock items, and product turnover.
          </p>
          <button className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">
            View Stock Report
          </button>
        </Card>

        <Card title="Customer Report">
          <p className="text-sm text-gray-600">
            Analyze customer order history and purchase frequency.
          </p>
          <button className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">
            View Customer Report
          </button>
        </Card>
      </div>
    </AdminLayout>
  );
}
