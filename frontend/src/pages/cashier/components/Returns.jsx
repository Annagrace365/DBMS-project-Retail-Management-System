// src/pages/cashier/components/Returns.jsx
import React, { useState } from "react";
import { useCashier } from "./CashierContext";

/**
 * Returns: a simple returns UI where user picks a transaction and selects items to return.
 * This is a demo flow — in real app you'd have permissions, validations, stock adjustments, and backend logic.
 */
export default function Returns() {
  const { transactions, setTransactions } = useCashier();
  const [txnId, setTxnId] = useState("");
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});

  function loadTxn() {
    const t = transactions.find((x) => x.id === txnId);
    setSelectedTxn(t || null);
    setSelectedItems({});
  }

  function toggleItem(id) {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function processReturn() {
    if (!selectedTxn) {
      alert("No transaction loaded");
      return;
    }
    const itemsToReturn = selectedTxn.cart.items.filter((it) => selectedItems[it.id]);
    if (itemsToReturn.length === 0) {
      alert("Select at least one item");
      return;
    }
    // For demo, we create a negative transaction entry and mark items returned:
    const returnTxn = {
      id: `return_${Date.now()}`,
      createdAt: new Date().toISOString(),
      cart: {
        items: itemsToReturn.map((it) => ({ ...it, qty: it.qty })),
        totals: { subtotal: 0, tax: 0, total: 0 },
      },
      payment: { method: "refund" },
      note: `Return for ${selectedTxn.id}`,
    };
    returnTxn.cart.totals = {
      subtotal: itemsToReturn.reduce((s, it) => s + it.price * it.qty, 0),
      tax: 0,
      total: itemsToReturn.reduce((s, it) => s + it.price * it.qty, 0),
    };

    setTransactions((prev) => [returnTxn, ...prev]);
    alert("Return processed: " + returnTxn.id);
    setSelectedTxn(null);
    setTxnId("");
    setSelectedItems({});
  }

  return (
    <div>
      <h1>Returns</h1>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="Enter transaction ID" style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} />
            <button onClick={loadTxn} style={{ padding: "8px 12px", borderRadius: 6, background: "#0b5fff", color: "#fff", border: "none" }}>Load</button>
          </div>

          {selectedTxn ? (
            <div style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 8 }}>
              <div><strong>Transaction:</strong> {selectedTxn.id}</div>
              <ul>
                {selectedTxn.cart.items.map((it) => (
                  <li key={it.id} style={{ marginTop: 8 }}>
                    <label>
                      <input type="checkbox" checked={!!selectedItems[it.id]} onChange={() => toggleItem(it.id)} />{" "}
                      {it.name} × {it.qty} — ₹ {(it.price * it.qty).toFixed(2)}
                    </label>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 10 }}>
                <button onClick={processReturn} style={{ padding: "8px 12px", borderRadius: 6, background: "#ef4444", color: "#fff", border: "none" }}>Process Return</button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 12, color: "#6b7280" }}>Load a transaction to return items.</div>
          )}
        </div>

        <aside style={{ width: 320 }}>
          <div style={{ padding: 12, background: "#fff", borderRadius: 8 }}>
            <h3>Recent transactions</h3>
            <ul>
              {transactions.slice(0, 6).map((t) => (
                <li key={t.id} style={{ marginTop: 8, fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{t.id}</div>
                  <div style={{ color: "#6b7280" }}>₹ {t.cart.totals.total.toFixed(2)} • {new Date(t.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
