// src/pages/cashier/components/InPOS.jsx
import React, { useState } from "react";
import { useCashier } from "./CashierContext";
import mockProducts from "../services/mockProducts";

/**
 * InPOS: full POS interface (frontend-only, no backend)
 * - Search products by name / barcode
 * - Add item to cart
 * - Update qty / remove
 * - Hold invoice
 * - Complete sale (mock)
 */
export default function InPOS() {
  const { currentCart, addItemToCart, updateQty, removeItemFromCart, holdInvoice, completeSale } = useCashier();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  function handleSearch(q) {
    setQuery(q);
    if (!q) {
      setSearchResults([]);
      return;
    }
    const res = mockProducts.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || String(p.barcode).includes(q));
    setSearchResults(res.slice(0, 10));
  }

  async function handleCompleteSale() {
    const payment = { method: "cash" }; // simplified
    const saved = await completeSale(payment);
    alert(`Sale completed: ${saved.id}`);
  }

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <section style={{ flex: 1 }}>
        <h2>Point of Sale</h2>

        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Search product name or barcode..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}
          />
          {searchResults.length > 0 && (
            <div style={{ marginTop: 8, background: "#fff", borderRadius: 8, padding: 8 }}>
              {searchResults.map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: 8, borderBottom: "1px solid #eee" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>₹ {p.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <button onClick={() => addItemToCart(p)} style={styles.addBtn}>Add</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 14 }}>
          <h3>Cart</h3>
          {currentCart.items.length === 0 ? (
            <div style={{ color: "#6b7280" }}>Cart is empty</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Line</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentCart.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>
                      <input
                        value={it.qty}
                        type="number"
                        min={1}
                        onChange={(e) => updateQty(it.id, parseInt(e.target.value || "0", 10))}
                        style={{ width: 60 }}
                      />
                    </td>
                    <td>₹ {it.price.toFixed(2)}</td>
                    <td>₹ {(it.price * it.qty).toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeItemFromCart(it.id)} style={styles.removeBtn}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <aside style={{ width: 320 }}>
        <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
          <h3>Summary</h3>
          <div>Subtotal: ₹ {currentCart.totals.subtotal.toFixed(2)}</div>
          <div>Tax: ₹ {currentCart.totals.tax.toFixed(2)}</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>Total: ₹ {currentCart.totals.total.toFixed(2)}</div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => { const h = holdInvoice(); alert("Held: " + h.id); }} style={styles.holdBtn}>Hold</button>
            <button onClick={handleCompleteSale} style={styles.payBtn}>Pay</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

const styles = {
  addBtn: {
    padding: "6px 10px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  removeBtn: {
    padding: "6px 8px",
    background: "transparent",
    border: "1px solid #f87171",
    color: "#ef4444",
    borderRadius: 6,
    cursor: "pointer",
  },
  holdBtn: {
    flex: 1,
    padding: "8px 10px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  payBtn: {
    flex: 1,
    padding: "8px 10px",
    background: "#0b5fff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    marginTop: 8,
  },
};
