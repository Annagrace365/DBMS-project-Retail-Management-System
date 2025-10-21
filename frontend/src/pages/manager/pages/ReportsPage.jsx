import React, { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import Card from "../components/ui/Card";
import { Bar, Pie } from "react-chartjs-2";
import api from "../services/adminApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function ReportsPage() {
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleReportClick = async (type) => {
    try {
      let data;
      if (type === "Sales") {
        data = await api.getSalesReport();
        setModalTitle("Sales Report (Last 30 Days)");
      } else if (type === "Stock") {
        data = await api.getStockReport();
        setModalTitle("Stock Report");
      } else if (type === "Customer") {
        data = await api.getCustomerReport();
        setModalTitle("Customer Report");
      }
      setModalData(data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      alert("Error fetching report. Check console.");
    }
  };

  const closeModal = () => {
    setModalData(null);
    setModalTitle("");
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Reports</h2>
      </div>

      {/* Reports Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Sales Report">
          <p className="text-sm text-gray-600">
            Generate daily, weekly, or monthly sales reports.
          </p>
          <button onClick={() => handleReportClick("Sales")} className="btn-view-report mt-3">
            View Sales Report
          </button>
        </Card>

        <Card title="Stock Report">
          <p className="text-sm text-gray-600">
            Check stock valuation, low stock items, and product turnover.
          </p>
          <button onClick={() => handleReportClick("Stock")} className="btn-view-report mt-3">
            View Stock Report
          </button>
        </Card>

        <Card title="Customer Report">
          <p className="text-sm text-gray-600">
            Analyze customer order history and purchase frequency.
          </p>
          <button onClick={() => handleReportClick("Customer")} className="btn-view-report mt-3">
            View Customer Report
          </button>
        </Card>
      </div>

      {/* Modal */}
      {modalData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "85%",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: 8,
              padding: 20,
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                border: "none",
                background: "transparent",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            <h3 style={{ marginTop: 0 }}>{modalTitle}</h3>

            {/* Sales Report */}
            {modalTitle.includes("Sales") && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p>Total Sales: ₹{modalData.total_sales}</p>
                <p>Total Orders: {modalData.total_orders}</p>
                <p><b>AI Summary:</b> {modalData.ai_summary || "AI summary unavailable"}</p>
                <div style={{ width: "400px", height: "250px" }}>
                  <Bar
                    data={{
                      labels: modalData.top_products.map((p) => p.product_id__name),
                      datasets: [{ label: "Quantity Sold", data: modalData.top_products.map((p) => p.qty_sold), backgroundColor: "#2563eb" }],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            )}

            {/* Stock Report */}
            {modalTitle.includes("Stock") && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p><b>AI Summary:</b> {modalData.ai_summary || "AI summary unavailable"}</p>
                <div style={{ width: "400px", height: "250px" }}>
                  <Pie
                    data={{
                      labels: modalData.low_stock.map((p) => p.name),
                      datasets: [{ label: "Stock Level", data: modalData.low_stock.map((p) => p.stock), backgroundColor: ["#ef4444", "#facc15", "#10b981", "#3b82f6"] }],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            )}

            {/* Customer Report */}
            {modalTitle.includes("Customer") && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p><b>AI Summary:</b> {modalData.ai_summary || "AI summary unavailable"}</p>
                <div style={{ width: "400px", height: "250px" }}>
                  <Bar
                    data={{
                      labels: modalData.top_customers.map((c) => c.name),
                      datasets: [{ label: "Total Spent (₹)", data: modalData.top_customers.map((c) => c.total_spent), backgroundColor: "#10b981" }],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
