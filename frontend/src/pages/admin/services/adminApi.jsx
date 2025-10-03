import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "/api",
  headers: { "Content-Type": "application/json" },
});

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
};
