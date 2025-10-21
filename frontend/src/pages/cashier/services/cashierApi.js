import axios from "axios";

// Create an Axios instance for making API calls
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Your backend base URL
  headers: { "Content-Type": "application/json" },
});

// Mock save transaction (this can remain as is)
export function saveTransaction(txn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...txn }); // Simply returns the passed transaction
    }, 250);
  });
}

// Fetch all products (from the admin endpoint)
export const fetchProducts = async (search = "") => {
  try {
    const res = await api.get("/admin/products/"); // Fetch products from your backend

    if (!search) return res.data; // Return all products if no search query

    // Filter products client-side based on name or barcode matching search term
    return res.data.filter((p) => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search))
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err; // Rethrow error for handling in components
  }
};

// Fetch product by barcode (new function)
export const fetchProductByBarcode = async (barcode) => {
  if (!barcode) throw new Error("Barcode is required"); // Ensure barcode is passed

  try {
    const res = await api.get(`/products/barcode/${barcode}/`); // API endpoint to fetch product by barcode
    return res.data; // Return the product details
  } catch (err) {
    console.error("Error fetching product by barcode:", err);
    throw err; // Rethrow error for handling in components
  }
};

export default api;
