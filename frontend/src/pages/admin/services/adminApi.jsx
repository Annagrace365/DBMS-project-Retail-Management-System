import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically (if using Token auth)
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Token ${token}`;
      }
    } catch (e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- Customers CRUD ----------------
api.listCustomers = async function (params) {
  const { data } = await api.get("/admin/customers/", { params });
  return data;
};

api.createCustomer = async function (payload) {
  const { data } = await api.post("/admin/customers/", payload);
  return data;
};

// NEW: Update customer
api.updateCustomer = async function (id, payload) {
  const { data } = await api.patch(`/admin/customers/${id}/update/`, payload);
  return data;
};

// Delete customer
api.deleteCustomer = async function (id) {
  const { data } = await api.delete(`/admin/customers/${id}/`);
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

api.createOrder = async function (payload) {
  // payload = { customer_id, order_date, amount, items: [{ product_id, quantity }] }
  const { data } = await api.post("/admin/orders/create/", payload);
  return data;
};

// ---------------- Products ----------------
api.listProducts = async function (params) {
  const { data } = await api.get("/admin/products/", { params });
  return data;
};

api.patchProduct = async function (id, payload) {
  const { data } = await api.patch(`/admin/products/${id}/`, payload);
  return data;
};
// Create a new product
api.createProduct = async function (payload) {
  // payload = { name, price, stock, supplier_ids: [] }
  const { data } = await api.post("/admin/products/create/", payload);
  return data;
};
api.patchProduct = async (id, payload) => {
  const { data } = await api.patch(`/admin/products/${id}/`, payload);
  return data;
};

// ---------------- Suppliers ----------------
api.listSuppliers = async function (params) {
  const { data } = await api.get("/admin/suppliers/", { params });
  return data;
};

api.createSupplier = async (payload) => (await api.post("/admin/suppliers/create/", payload)).data; // <-- NEW
// ---------------- Order-Supplier Assignment ----------------
api.addOrderSupplier = async function (orderId, supplierIds) {
  const { data } = await api.post(`/admin/orders/${orderId}/suppliers/`, { supplier_ids: supplierIds });
  return data;
};
// Patch supplier
api.patchSupplier = async (id, payload) => {
  const { data } = await api.patch(`/admin/suppliers/${id}/update/`, payload);
  return data;
};

// Delete supplier
api.deleteSupplier = async (id) => {
  const { data } = await api.delete(`/admin/suppliers/${id}/`);
  return data;
};


// ---------------- Payments ----------------
api.listPayments = async function (params) {
  const { data } = await api.get("/admin/payments/", { params });
  return data;
};

// ---------------- KPIs ----------------
api.getKpis = async function () {
  const { data } = await api.get("/admin/kpis/");
  return data;
};

export default api;
