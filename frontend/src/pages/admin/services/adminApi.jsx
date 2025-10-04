// src/pages/admin/services/adminApi.jsx
import axios from "axios";

/**
 * Robust environment-aware base URL:
 * - Vite : import.meta.env.VITE_API_BASE
 * - CRA  : process.env.REACT_APP_API_BASE (if you later use CRA)
 * - Fallback to '/api'
 */
const getBaseUrl = () => {
  // Vite
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }

  // CRA or other bundlers that expose process.env (only available in CRA)
  if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE;
  }

  // Fallback
  return "/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore localStorage errors
  }
  return config;
}, (error) => Promise.reject(error));

// central admin API surface (extend as needed)
export const adminApi = {
  // Dashboard KPIs
  async getKpis() {
    const { data } = await api.get("/admin/kpis");
    return data;
  },

  // Customers
  async listCustomers(params) {
    const { data } = await api.get("/admin/customers", { params });
    return data;
  },
  async getCustomer(id) {
    const { data } = await api.get(`/admin/customers/${id}`);
    return data;
  },
  async createCustomer(payload) {
    const { data } = await api.post(`/admin/customers`, payload);
    return data;
  },

  // Orders
  async listOrders(params) {
    const { data } = await api.get("/admin/orders", { params });
    return data;
  },
  async createOrder(payload) {
    const { data } = await api.post("/admin/orders", payload);
    return data;
  },

  // Products
  async listProducts(params) {
    const { data } = await api.get("/admin/products", { params });
    return data;
  },
  async patchProduct(id, payload) {
    const { data } = await api.patch(`/admin/products/${id}`, payload);
    return data;
  },

  // Reports
  async getSalesReport(params) {
    const { data } = await api.get("/admin/reports/sales", { params });
    return data;
  },

  // Stubs for pages you created earlier (safe if backend not ready)
  async listSuppliers(params) {
    const { data } = await api.get("/admin/suppliers", { params });
    return data;
  },
  async listPayments(params) {
    const { data } = await api.get("/admin/payments", { params });
    return data;
  },
  async listAuditLogs(params) {
    const { data } = await api.get("/admin/audit", { params });
    return data;
  },
};

export default api;
