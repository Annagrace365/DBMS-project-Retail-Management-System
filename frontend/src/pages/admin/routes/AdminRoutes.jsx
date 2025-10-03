import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage.jsx";
import CustomersPage from "../pages/CustomersPage.jsx";
import OrdersPage from "../pages/OrdersPage.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import SuppliersPage from "../pages/SuppliersPage.jsx";
import PaymentsPage from "../pages/PaymentsPage.jsx";
import ReportsPage from "../pages/ReportsPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import AuditPage from "../pages/AuditPage.jsx";


export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="customers" element={<CustomersPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="suppliers" element={<SuppliersPage />} />
      <Route path="payments" element={<PaymentsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="audit" element={<AuditPage />} />
    </Routes>
  );
}


