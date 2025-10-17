// src/pages/cashier/components/CashierLayout.jsx
import React from "react";
// add import for scoped CSS so rules apply
import "../../../styles/cashier.css";
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
export default function CashierLayout({ children }) {
  return (
    // ensure root has the class your CSS targets
    <div className="cashier-root cashier-layout" data-area="cashier">
      <CashierProvider>
        <div style={styles.outer}>
          <aside className="cashier-sidebar" style={styles.sidebar}>
            <Sidebar />
          </aside>

          <div style={styles.mainArea}>
            <header className="cashier-topbar" style={styles.topbar}>
              <Topbar />
            </header>

            <main style={styles.content}>
              {/* Route-specific pages render here */}
              <Outlet />
            </main>
          </div>
        </div>
      </CashierProvider>
      {children}
    </div>
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
