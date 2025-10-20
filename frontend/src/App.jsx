// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminRoutes from "./pages/admin/routes/AdminRoutes.jsx";
import RequireAuth from "./pages/admin/components/RequireAuth.jsx"; // <-- updated path
import CashierRoutes from "./pages/cashier/routes/CashierRoutes.jsx";
import ManagerRoutes from "./pages/manager/routes/AdminRoutes.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protect all /admin/* routes */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminRoutes />
            </RequireAuth>
          }
        />
        {/* <Route path="/admin/customers" 
        element={
        <CustomersPage />
        } 
        /> */}


        <Route
          path="/cashier/*"
          element={
              <CashierRoutes />
          }
        />


        <Route
          path="/manager/*"
          element={
              <ManagerRoutes />
          }
        />
      </Routes>

    </Router>
  );
}

export default App;
