import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Mock save transaction (can keep as-is)
export function saveTransaction(txn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...txn });
    }, 250);
  });
}

// Fetch all products (from admin endpoint)
export const fetchProducts = async (search = "") => {
  try {
    const res = await api.get("/admin/products/"); // your existing endpoint
    if (!search) return res.data;
    return res.data.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search))
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

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
