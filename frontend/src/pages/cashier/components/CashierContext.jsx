// src/pages/cashier/components/CashierContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/cashierApi";

/**
 * CashierContext provides shared state for the cashier module:
 * - currentCart: items in the running POS cart
 * - heldInvoices: array of held invoice objects
 * - transactions: completed transactions (mocked)
 *
 * Actions:
 * - addItemToCart(item)
 * - removeItemFromCart(itemId)
 * - updateQty(itemId, qty)
 * - holdInvoice(name)
 * - restoreHeldInvoice(id)
 * - completeSale(paymentInfo)
 * - clearCart()
 *
 * This implementation persists cart and holds to localStorage for basic demo behaviour.
 */

const CashierContext = createContext(null);

export function CashierProvider({ children }) {
  const [currentCart, setCurrentCart] = useState({ items: [], totals: { subtotal: 0, tax: 0, total: 0 } });
  const [heldInvoices, setHeldInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Load persisted state from localStorage on mount
  useEffect(() => {
    try {
      const persistedCart = JSON.parse(localStorage.getItem("cashier_currentCart"));
      const persistedHeld = JSON.parse(localStorage.getItem("cashier_heldInvoices")) || [];
      const persistedTx = JSON.parse(localStorage.getItem("cashier_transactions")) || [];
      if (persistedCart) setCurrentCart(persistedCart);
      setHeldInvoices(persistedHeld);
      setTransactions(persistedTx);
    } catch (e) {
      console.warn("Error reading cashier local storage", e);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem("cashier_currentCart", JSON.stringify(currentCart));
  }, [currentCart]);

  useEffect(() => {
    localStorage.setItem("cashier_heldInvoices", JSON.stringify(heldInvoices));
  }, [heldInvoices]);

  useEffect(() => {
    localStorage.setItem("cashier_transactions", JSON.stringify(transactions));
  }, [transactions]);

  function recalcTotals(items) {
    const subtotal = items.reduce((s, it) => s + (it.price * it.qty), 0);
    const tax = +(subtotal * 0.05).toFixed(2); // demo 5% tax
    const total = +(subtotal + tax).toFixed(2);
    return { subtotal, tax, total };
  }

  function addItemToCart(product) {
    setCurrentCart((prev) => {
      const existing = prev.items.find((i) => i.id === product.id);
      let items;
      if (existing) {
        items = prev.items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      } else {
        items = [...prev.items, { ...product, qty: 1 }];
      }
      return { items, totals: recalcTotals(items) };
    });
  }

  function removeItemFromCart(itemId) {
    setCurrentCart((prev) => {
      const items = prev.items.filter((i) => i.id !== itemId);
      return { items, totals: recalcTotals(items) };
    });
  }

  function updateQty(itemId, qty) {
    if (qty <= 0) return removeItemFromCart(itemId);
    setCurrentCart((prev) => {
      const items = prev.items.map((i) => (i.id === itemId ? { ...i, qty } : i));
      return { items, totals: recalcTotals(items) };
    });
  }

  function clearCart() {
    setCurrentCart({ items: [], totals: { subtotal: 0, tax: 0, total: 0 } });
  }

  function holdInvoice(name = "Held sale") {
    const id = `hold_${Date.now()}`;
    const held = {
      id,
      name,
      cart: currentCart,
      createdAt: new Date().toISOString(),
    };
    setHeldInvoices((prev) => [held, ...prev]);
    clearCart();
    return held;
  }

  function restoreHeldInvoice(id) {
    const found = heldInvoices.find((h) => h.id === id);
    if (!found) return null;
    setCurrentCart(found.cart);
    setHeldInvoices((prev) => prev.filter((h) => h.id !== id));
    return found;
  }

  async function completeSale(paymentInfo = { method: "cash" }) {
    // In a real app you'd send data to backend. Here we use a mock service.
    const sale = {
      id: `txn_${Date.now()}`,
      cart: currentCart,
      payment: paymentInfo,
      createdAt: new Date().toISOString(),
    };
    // call mock api (could be replaced later)
    const saved = await api.saveTransaction(sale);
    setTransactions((prev) => [saved, ...prev]);
    clearCart();
    return saved;
  }

  // expose API
  const value = {
    currentCart,
    heldInvoices,
    transactions,
    addItemToCart,
    removeItemFromCart,
    updateQty,
    clearCart,
    holdInvoice,
    restoreHeldInvoice,
    completeSale,
    setTransactions,
  };

  return <CashierContext.Provider value={value}>{children}</CashierContext.Provider>;
}

export function useCashier() {
  const ctx = useContext(CashierContext);
  if (!ctx) {
    throw new Error("useCashier must be used within CashierProvider");
  }
  return ctx;
}
