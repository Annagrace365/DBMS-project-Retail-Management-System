// src/pages/cashier/routes/CashierRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CashierLayout from "../components/CashierLayout";
import CashierIndex from "../components/CashierIndex";
import InPOS from "../components/InPOS";
import HoldInvoices from "../components/HoldInvoices";
import Transactions from "../components/Transactions";
import Returns from "../components/Returns";
import OrdersPage from "../components/OrdersPage";
import ProfilePage from "../components/ProfilePage";
<<<<<<< HEAD
=======
import BarcodeScannerPage from "../components/BarcodeScannerPage"; // ✅ new import
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690


/**
 * CashierRoutes: Mounts CashierLayout as the parent route and defines child routes.
 * The layout contains Sidebar/Topbar and an <Outlet /> where the child pages render.
 */
export default function CashierRoutes() {
  return (
    <Routes>
      {/* Parent route: CashierLayout includes Sidebar/Topbar and Outlet */}
      <Route path="/" element={<CashierLayout />}>
        {/* index -> /cashier  */}
        <Route index element={<CashierIndex />} />
        <Route path="dashboard" element={<CashierIndex />} />

        {/* POS / billing */}
        <Route path="pos" element={<InPOS />} />
        <Route path="billing" element={<InPOS />} />

<<<<<<< HEAD
=======
        {/* ✅ Barcode Scanner */}
        <Route path="barcode-scanner" element={<BarcodeScannerPage />} />


>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
        {/* Holds */}
        <Route path="hold-invoices" element={<HoldInvoices />} />

        {/* Transactions */}
        <Route path="transactions" element={<Transactions />} />

        {/* Returns */}
        <Route path="returns" element={<Returns />} />

        {/* Orders */}
        <Route path="orders" element={<OrdersPage />} />

        {/* Profile */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* If someone goes to /cashier/* unknown path (non-matching top-level),
          redirect to /cashier (dashboard). */}
      <Route path="*" element={<Navigate to="/cashier" replace />} />
    </Routes>
  );
}
