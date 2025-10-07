// src/pages/cashier/components/Topbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCashier } from "./CashierContext";

/**
 * Topbar: shows quick actions like New Sale, Search, cashier name and clock.
 * Minimal implementation so you can style or extend.
 */
export default function Topbar() {
  const navigate = useNavigate();
  const { currentCart, clearCart } = useCashier();

  const handleNewSale = () => {
    clearCart();
    navigate("/cashier/pos");
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <button onClick={handleNewSale} style={styles.button}>New Sale</button>
        <button onClick={() => navigate("/cashier/hold-invoices")} style={styles.buttonOutline}>
          Holds ({/* count */})
        </button>
      </div>

      <div style={styles.center}>
        <strong>Cashier Dashboard</strong>
      </div>

      <div style={styles.right}>
        <div style={{ marginRight: 12 }}>
          <small>Cart: {currentCart.items.length} items</small>
        </div>
        <div style={{ color: "#6b7280", fontSize: 13 }}>You</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: { display: "flex", gap: 8, alignItems: "center" },
  center: { textAlign: "center", flex: 1 },
  right: { display: "flex", gap: 12, alignItems: "center" },
  button: {
    padding: "8px 12px",
    background: "#0b5fff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  buttonOutline: {
    padding: "8px 12px",
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
  },
};
