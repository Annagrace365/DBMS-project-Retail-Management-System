import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import KPI from "../components/ui/KPI";
import Card from "../components/ui/Card";
import { adminApi } from "../services/adminApi";

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
        const data = await adminApi.getKpis();
        console.log("KPIs fetched:", data); // <-- DEBUG: verify API response
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPI label="Today's Sales" value={loading ? "..." : `₹ ${kpis.todaySales}`} />
        <KPI label="Total Orders Today" value={loading ? "..." : kpis.totalOrdersToday} />
        <KPI label="Low Stock Items" value={loading ? "..." : kpis.lowStockCount} />
        <KPI label="Active Customers" value={loading ? "..." : kpis.activeCustomers} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Products */}
        <Card title="Top Products">
          {kpis.topProducts.length > 0 ? (
            <ol className="list-decimal pl-5">
              {kpis.topProducts.map((p) => (
                <li key={p.id}>
                  {p.name} — {p.qty_sold}
                </li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-gray-500">No top products</div>
          )}
        </Card>

        {/* Recent Orders */}
        <Card title="Recent Orders">
          {kpis.recentOrders.length > 0 ? (
            <ul className="text-sm">
              {kpis.recentOrders.map((o) => (
                <li key={o.id}>
                  {o.customer_name} — ₹ {o.amount} —{" "}
                  {new Date(o.order_date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No recent orders</div>
          )}
        </Card>

        {/* Alerts */}
        <Card title="Alerts">
          <ul className="text-sm">
            {kpis.lowStockCount > 0 ? (
              <li>Low stock on {kpis.lowStockCount} products</li>
            ) : (
              <li>No alerts</li>
            )}
          </ul>
        </Card>
      </div>
    </AdminLayout>
  );
}
