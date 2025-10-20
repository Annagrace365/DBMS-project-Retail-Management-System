// src/pages/cashier/services/cashierApi.js
/**
 * Mock cashier API service file.
 * Replace functions with real API calls when backend is available.
 *
 * For demo purposes:
 * - saveTransaction(txn) returns the txn with the same id after a small delay.
 * - fetchProducts(query) can be implemented later.
 */








import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

export function saveTransaction(txn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // simply return the passed transaction (simulate server-assigned id)
      resolve({ ...txn });
    }, 250);
  });
}

// Fetch all products (from admin endpoint)
export const fetchProducts = async (search = "") => {
  try {
    const res = await api.get("/admin/products/");
    // Filter client-side
    if (!search) return res.data;
    return res.data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

export default api;

