import axios from "axios";

// Base URL of your Django backend
const API_BASE = "http://127.0.0.1:8000/";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example API calls
export const getCustomers = async () => {
  return await api.get("/api/customers/"); // endpoint to fetch customers
};

export const getOrders = async () => {
  return await api.get("/api/orders/");
};
