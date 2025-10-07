// src/pages/cashier/services/cashierApi.js
/**
 * Mock cashier API service file.
 * Replace functions with real API calls when backend is available.
 *
 * For demo purposes:
 * - saveTransaction(txn) returns the txn with the same id after a small delay.
 * - fetchProducts(query) can be implemented later.
 */

export function saveTransaction(txn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // simply return the passed transaction (simulate server-assigned id)
      resolve({ ...txn });
    }, 250);
  });
}

// placeholder for other APIs
export function fetchProducts(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 150);
  });
}
