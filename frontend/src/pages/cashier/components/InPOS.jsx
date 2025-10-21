<<<<<<< HEAD
import React, { useState } from "react";
import { useCashier } from "./CashierContext";
import { fetchProducts, fetchProductByBarcode } from "../services/cashierApi";
import BarcodeScannerPage from "./BarcodeScannerPage"; // Import BarcodeScannerPage component

=======
// src/pages/cashier/components/InPOS.jsx
import React, { useState } from "react";
import { useCashier } from "./CashierContext";
// removed mockProducts import and use backend fetch
import { fetchProducts } from "../services/cashierApi";

/**
 * InPOS: full POS interface (frontend-only, no backend)
 * - Search products by name / barcode
 * - Add item to cart
 * - Update qty / remove
 * - Hold invoice
 * - Complete sale (mock)
 */
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
export default function InPOS() {
  const {
    currentCart,
    addItemToCart,
    updateQty,
    removeItemFromCart,
    holdInvoice,
    completeSale,
  } = useCashier();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [manualItem, setManualItem] = useState({ name: "", price: "" });

<<<<<<< HEAD
  // Search products by name or barcode
=======
  // --------- CHANGED: search now queries the DB and maps results to cart shape ----------
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
  async function handleSearch(q) {
    setQuery(q);
    if (!q) {
      setSearchResults([]);
      return;
    }

    try {
<<<<<<< HEAD
      const products = await fetchProducts(q);
      const mapped = products.map((p) => ({
        id: p.product_id,
        barcode: p.barcode || "",
        name: p.name,
        price: parseFloat(p.price),
      }));
=======
      // fetchProducts will call your backend endpoint (e.g. /api/admin/products/)
      const products = await fetchProducts(q); // fetchProducts may filter server-side or return all
      // Map backend product shape to the shape expected by the cart functions
      // backend product fields: product_id, sku, name, price, stock
      const mapped = products.map((p) => ({
        id: p.product_id,          // matches original mockProducts.id
        barcode: p.sku || "",      // preserve barcode field used in original search logic
        name: p.name,
        price: parseFloat(p.price), // ensure number
      }));
      // Filter by query (in case backend returns all); keep original behavior (name or barcode)
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
      const res = mapped.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          String(p.barcode).includes(q)
      );
      setSearchResults(res.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch products", err);
<<<<<<< HEAD
      setSearchResults([]);
    }
  }

  // Handle scanned barcode and add product automatically
  const handleBarcodeScanned = async (barcode) => {
    if (!barcode) return;
    try {
      const product = await fetchProductByBarcode(barcode); // backend API
      if (product && product.id) {
        addItemToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          barcode: product.barcode,
        });
      } else {
        alert(`Product not found for scanned barcode: ${barcode}`);
      }
    } catch (err) {
      console.error("Error fetching product by barcode", err);
      alert(`Product not found for scanned barcode: ${barcode}`);
    }
  };

  async function handleCompleteSale() {
    const payment = { method: "cash" };
=======
      // fallback to empty results if fetch fails
      setSearchResults([]);
    }
  }
  // -------------------------------------------------------------------------------

  async function handleCompleteSale() {
    const payment = { method: "cash" }; // simplified
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
    const saved = await completeSale(payment);
    alert(`Sale completed: ${saved.id}`);
  }

  return (
<<<<<<< HEAD
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      {/* Left Side: POS & Cart */}
=======
    <div style={{ display: "flex", gap: 20 }}>
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
      <section style={{ flex: 1 }}>
        <h2>Point of Sale</h2>

        {/* Search Bar */}
        <div style={{ marginBottom: 12 }}>
          <input
            placeholder="Search product name or barcode..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
            }}
          />
          {searchResults.length > 0 && (
            <div
              style={{
                marginTop: 8,
                background: "#fff",
                borderRadius: 8,
                padding: 8,
              }}
            >
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 8,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      ₹ {p.price.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <button onClick={() => addItemToCart(p)} style={styles.addBtn}>
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Item Entry */}
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#f9fafb",
          }}
        >
          <h4>Manually Add Item</h4>
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Item name"
              value={manualItem.name}
              onChange={(e) =>
                setManualItem({ ...manualItem, name: e.target.value })
              }
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
              }}
            />
            <input
              type="number"
              placeholder="Price"
              value={manualItem.price}
              onChange={(e) =>
                setManualItem({ ...manualItem, price: e.target.value })
              }
              style={{
                width: 120,
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
              }}
            />
            <button
              onClick={() => {
                if (!manualItem.name || !manualItem.price) {
                  alert("Enter valid name and price");
                  return;
                }
                const item = {
                  id: "manual_" + Date.now(),
                  name: manualItem.name,
                  price: parseFloat(manualItem.price),
                };
                addItemToCart(item);
                setManualItem({ name: "", price: "" });
              }}
              style={styles.addBtn}
            >
              Add
            </button>
          </div>
        </div>

        {/* Cart Display */}
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
                        onChange={(e) =>
<<<<<<< HEAD
                          updateQty(it.id, parseInt(e.target.value || "0", 10))
=======
                          updateQty(
                            it.id,
                            parseInt(e.target.value || "0", 10)
                          )
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
                        }
                        style={{ width: 60 }}
                      />
                    </td>
                    <td>₹ {it.price.toFixed(2)}</td>
                    <td>₹ {(it.price * it.qty).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => removeItemFromCart(it.id)}
                        style={styles.removeBtn}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

<<<<<<< HEAD
      {/* Right Side: Summary + Barcode Scanner */}
      <aside
        style={{
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        {/* Payment / Summary */}
=======
      {/* Summary Sidebar */}
      <aside style={{ width: 320 }}>
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
        <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
          <h3>Summary</h3>
          <div>Subtotal: ₹ {currentCart.totals.subtotal.toFixed(2)}</div>
          <div>Tax: ₹ {currentCart.totals.tax.toFixed(2)}</div>
          <div style={{ fontWeight: 700, marginTop: 8 }}>
            Total: ₹ {currentCart.totals.total.toFixed(2)}
          </div>
<<<<<<< HEAD
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={() => holdInvoice()} style={styles.holdBtn}>
=======

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                const h = holdInvoice();
                alert("Held: " + h.id);
              }}
              style={styles.holdBtn}
            >
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
              Hold
            </button>
            <button onClick={handleCompleteSale} style={styles.payBtn}>
              Pay
            </button>
          </div>
        </div>
<<<<<<< HEAD

        {/* Barcode Scanner with onScan */}
        <div style={{ flex: 1 }}>
          <BarcodeScannerPage onScan={handleBarcodeScanned} />
        </div>
=======
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
      </aside>
    </div>
  );
}

const styles = {
<<<<<<< HEAD
  addBtn: { padding: "6px 10px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  removeBtn: { padding: "6px 8px", background: "transparent", border: "1px solid #f87171", color: "#ef4444", borderRadius: 6, cursor: "pointer" },
  holdBtn: { flex: 1, padding: "8px 10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  payBtn: { flex: 1, padding: "8px 10px", background: "#0b5fff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", marginTop: 8 },
=======
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
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
};
