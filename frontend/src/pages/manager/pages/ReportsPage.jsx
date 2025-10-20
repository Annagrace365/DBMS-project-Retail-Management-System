import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Card from "../components/ui/Card";

export default function ReportsPage() {
  const handleReportClick = (type) => {
    // Placeholder: implement report generation or navigation
    alert(`View ${type} Report clicked!`);
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Reports</h2>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Report */}
        <Card title="Sales Report">
          <p className="text-sm text-gray-600">
            Generate daily, weekly, or monthly sales reports.
          </p>
          <button
            onClick={() => handleReportClick("Sales")}
            className="btn-view-report mt-3"
          >
            View Sales Report
          </button>
        </Card>
        <br></br>
        {/* Stock Report */}
        <Card title="Stock Report">
          <p className="text-sm text-gray-600">
            Check stock valuation, low stock items, and product turnover.
          </p>
          <button
            onClick={() => handleReportClick("Stock")}
            className="btn-view-report mt-3"
          >
            View Stock Report
          </button>
        </Card>
        <br></br>
        {/* Customer Report */}
        <Card title="Customer Report">
          <p className="text-sm text-gray-600">
            Analyze customer order history and purchase frequency.
          </p>
          <button
            onClick={() => handleReportClick("Customer")}
            className="btn-view-report mt-3"
          >
            View Customer Report
          </button>
        </Card>
      </div>
    </AdminLayout>
  );
}
