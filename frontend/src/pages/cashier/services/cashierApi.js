<<<<<<< HEAD
=======
// src/pages/cashier/services/cashierApi.js
/**
 * Mock cashier API service file.
 * Replace functions with real API calls when backend is available.
 *
 * For demo purposes:
 * - saveTransaction(txn) returns the txn with the same id after a small delay.
 * - fetchProducts(query) can be implemented later.
 */








>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

<<<<<<< HEAD
// Mock save transaction (can keep as-is)
export function saveTransaction(txn) {
  return new Promise((resolve) => {
    setTimeout(() => {
=======
export function saveTransaction(txn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // simply return the passed transaction (simulate server-assigned id)
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
      resolve({ ...txn });
    }, 250);
  });
}

// Fetch all products (from admin endpoint)
export const fetchProducts = async (search = "") => {
  try {
<<<<<<< HEAD
    const res = await api.get("/admin/products/"); // your existing endpoint
    if (!search) return res.data;
    return res.data.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search))
    );
=======
    const res = await api.get("/admin/products/");
    // Filter client-side
    if (!search) return res.data;
    return res.data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

<<<<<<< HEAD
// ---- New function: fetch a product by barcode ----
export const fetchProductByBarcode = async (barcode) => {
  if (!barcode) throw new Error("Barcode is required");
  try {
    const res = await api.get(`/products/barcode/${barcode}/`);
    return res.data; // Should return { id, name, price, barcode }
  } catch (err) {
    console.error("Error fetching product by barcode:", err);
    throw err;
  }
};

export default api;
=======
export default api;

>>>>>>> 1fb7ec3f6399ddd0dfbc3498b36d96641de8f690
