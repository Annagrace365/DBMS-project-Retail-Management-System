// src/pages/cashier/components/CashierLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { CashierProvider } from "./CashierContext";

/**
 * CashierLayout: global shell for the cashier module.
 * - Renders Sidebar and Topbar persistently
 * - Wraps children with CashierProvider so pages share cart/session state
 * - Renders <Outlet /> where route-specific pages mount
 */
export default function CashierLayout() {
  return (
    <CashierProvider>
      <div style={styles.outer}>
        <aside style={styles.sidebar}>
          <Sidebar />
        </aside>

        <div style={styles.mainArea}>
          <header style={styles.topbar}>
            <Topbar />
          </header>

          <main style={styles.content}>
            {/* Route-specific pages render here */}
            <Outlet />
          </main>
        </div>
      </div>
    </CashierProvider>
  );
}

const styles = {
  outer: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
  },
  sidebar: {
    width: 260,
    borderRight: "1px solid #e6e9ef",
    background: "#ffffff",
  },
  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    borderBottom: "1px solid #e6e9ef",
    background: "#fff",
    padding: "12px 20px",
  },
  content: {
    padding: 20,
    flex: 1,
    overflowY: "auto",
  },
};
