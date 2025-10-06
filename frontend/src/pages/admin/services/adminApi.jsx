// src/pages/admin/services/adminApi.jsx
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically if present (for protected endpoints)
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

export const adminApi = {
  // Dashboard KPIs — ignore token
  async getKpis() {
    const { data } = await api.get("/admin/kpis", {
      headers: { Authorization: undefined }, // do NOT send token
    });
    return data;
  },


  // Products
  async listProducts(params) {
    const { data } = await api.get("/admin/products/", { params }); // trailing slash
    return data;
  },
  async patchProduct(id, payload) {
    const { data } = await api.patch(`/admin/products/${id}/`, payload);
    return data;
  },

  // Reports
  async getSalesReport(params) {
    const { data } = await api.get("/admin/reports/sales", { params });
    return data;
  },

  // Other stubs
  async listSuppliers(params) {
  const { data } = await api.get("/admin/suppliers/", { params });
  return data;
 },
  async listPayments(params) {
  const { data } = await api.get("/admin/payments/", { params });
  return data;
},
  async listAuditLogs(params) {
    const { data } = await api.get("/admin/audit", { params });
    return data;
  },
};



export default api;


// ---------------- Customers CRUD ----------------
// ---------------- Customers CRUD ----------------
api.listCustomers = async function (params) {
  // params can include { search: "Alice" }
  const { data } = await api.get("/admin/customers/", { params });
  return data;
};


// ---------------- Orders ----------------
api.listOrders = async function (params) {
  const { data } = await api.get("/admin/orders/", { params });
  return data;
};

api.getOrder = async function (id) {
  const { data } = await api.get(`/admin/orders/${id}/`);
  return data;
};