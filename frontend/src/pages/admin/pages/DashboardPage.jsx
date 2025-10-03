import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import KPI from "../components/ui/KPI";
import Card from "../components/ui/Card";
import { adminApi } from "../services/adminApi";

export default function DashboardPage() {
  const [kpis, setKpis] = useState({
    todaySales: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    adminApi.getKpis().then((data) => {
      if (!mounted) return;
      setKpis(data);
      setLoading(false);
    }).catch(()=>setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPI label="Today's Sales" value={loading ? "..." : `₹ ${kpis.todaySales}`} />
        <KPI label="Pending Orders" value={loading ? "..." : kpis.pendingOrders} />
        <KPI label="Low Stock Items" value={loading ? "..." : kpis.lowStockCount} />
        <KPI label="Active Customers" value={loading ? "..." : kpis.activeCustomers || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Top Products">
          {kpis.topProducts && kpis.topProducts.length ? (
            <ol className="list-decimal pl-5">
              {kpis.topProducts.map((p) => (
                <li key={p.id}>{p.name} — {p.qty_sold}</li>
              ))}
            </ol>
          ) : (
            <div className="text-sm text-gray-500">No data</div>
          )}
        </Card>

        <Card title="Recent Orders">
          <div className="text-sm text-gray-500">Quick list of recent orders will appear here.</div>
        </Card>

        <Card title="Alerts">
          <ul className="text-sm">
            <li>Low stock on 3 products</li>
            <li>2 failed payments</li>
          </ul>
        </Card>
      </div>
    </AdminLayout>
  );
}
