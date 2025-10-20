import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

export default function DashboardPage() {
  const [kpis, setKpis] = useState({
    todaySales: 0,
    totalOrdersToday: 0,
    lowStockCount: 0,
    activeCustomers: 0,
    topProducts: [],
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchKpis = async () => {
      try {
        const data = await admin.getKpis();
        if (!mounted) return;

        setKpis({
          todaySales: data.todaySales ?? 0,
          totalOrdersToday: data.totalOrdersToday ?? 0,
          lowStockCount: data.lowStockCount ?? 0,
          activeCustomers: data.activeCustomers ?? 0,
          topProducts: data.topProducts ?? [],
          recentOrders: data.recentOrders ?? [],
        });
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchKpis();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout>
      {/* KPI Cards */}
      <div className="dashboard-grid kpi-grid mb-6">
        <div className="kpi-card">
          <div className="kpi-label">Today's Sales</div>
          <div className="kpi-value">{loading ? "..." : `₹ ${kpis.todaySales}`}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Orders Today</div>
          <div className="kpi-value">{loading ? "..." : kpis.totalOrdersToday}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Low Stock Items</div>
          <div className="kpi-value">{loading ? "..." : kpis.lowStockCount}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Customers</div>
          <div className="kpi-value">{loading ? "..." : kpis.activeCustomers}</div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="dashboard-grid cards-grid gap-4">
        {/* Top Products */}
        <div className="card">
          <div className="card-title">Top Products</div>
          {kpis.topProducts.length > 0 ? (
            <table className="card-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty Sold</th>
                </tr>
              </thead>
              <tbody>
                {kpis.topProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.qty_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-gray-500 mt-2">No top products</div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-title">Recent Orders</div>
          {kpis.recentOrders.length > 0 ? (
            <table className="card-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {kpis.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.customer_name}</td>
                    <td>₹ {o.amount}</td>
                    <td>{new Date(o.order_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-sm text-gray-500 mt-2">No recent orders</div>
          )}
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="card-title">Alerts</div>
          <ul className="text-sm mt-2">
            {kpis.lowStockCount > 0 ? (
              <li className="alert">Low stock on {kpis.lowStockCount} products</li>
            ) : (
              <li>No alerts</li>
            )}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
