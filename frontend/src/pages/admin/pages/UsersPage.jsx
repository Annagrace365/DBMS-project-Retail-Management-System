import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/adminApi";

/**
 * UsersPage.jsx
 * - Lists users
 * - Add user (modal)
 * - Edit user (modal)
 * - Delete user (confirm)
 *
 * Expects adminApi methods:
 * - api.listUsers()
 * - api.createUser(payload)
 * - api.updateUser(id, payload)
 * - api.deleteUser(id)
 */

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // editingUser doubles as "add" when .isNew === true
  const [editingUser, setEditingUser] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // fetch list
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.listUsers();
      // Accept different shapes: if backend returns {user:...} or list directly
      setUsers(Array.isArray(data) ? data : data.users || data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Failed to fetch users. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // open add modal
  const openAdd = () =>
    setEditingUser({
      username: "",
      email: "",
      role: "cashier",
      password: "",
      isNew: true,
    });

  // open edit modal (clone)
  const openEdit = (u) => setEditingUser({ ...u, password: "", isNew: false });

  const closeModal = () => setEditingUser(null);

  // client-side validation (simple)
  const validateUserPayload = (payload) => {
    if (!payload.username || payload.username.trim().length < 2) {
      return "Username must be at least 2 characters.";
    }
    if (!payload.email || !payload.email.includes("@")) {
      return "Enter a valid email.";
    }
    if (!payload.role) {
      return "Select a role.";
    }
    if (payload.isNew && (!payload.password || payload.password.length < 4)) {
      return "Password (min 4 chars) is required for new users.";
    }
    return null;
  };

  // create or update
  const saveUser = async () => {
    if (!editingUser) return;
    const payload = {
      username: editingUser.username,
      email: editingUser.email,
      role: editingUser.role,
    };
    // include password only if provided
    if (editingUser.password && editingUser.password.trim() !== "") {
      payload.password = editingUser.password;
    }
    const validationError = validateUserPayload({ ...payload, isNew: editingUser.isNew });
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    try {
      if (editingUser.isNew) {
        await api.createUser(payload);
        alert("User created.");
      } else {
        await api.updateUser(editingUser.id, payload);
        alert("User updated.");
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Failed to save user:", err);
      // show server message if available
      const msg = err?.response?.data?.message || err?.response?.data || err.message || "Save failed";
      alert("Failed to save user: " + JSON.stringify(msg));
    } finally {
      setSaving(false);
    }
  };

  // delete
  const confirmDelete = (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    doDelete(id);
  };

  const doDelete = async (id) => {
    setDeletingUserId(id);
    try {
      await api.deleteUser(id);
      alert("User deleted.");
      await fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
      const msg = err?.response?.data?.message || err.message || "Delete failed";
      alert("Failed to delete user: " + JSON.stringify(msg));
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600 }}>Users</h2>
        <button
          onClick={openAdd}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          + Add User
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {loading ? (
          <div>Loading users...</div>
        ) : users && users.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 10, border: "1px solid #e5e7eb", textAlign: "left" }}>ID</th>
                <th style={{ padding: 10, border: "1px solid #e5e7eb", textAlign: "left" }}>Username</th>
                <th style={{ padding: 10, border: "1px solid #e5e7eb", textAlign: "left" }}>Email</th>
                <th style={{ padding: 10, border: "1px solid #e5e7eb", textAlign: "left" }}>Role</th>
                <th style={{ padding: 10, border: "1px solid #e5e7eb", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: 10, border: "1px solid #f1f5f9" }}>{u.id}</td>
                  <td style={{ padding: 10, border: "1px solid #f1f5f9" }}>{u.username}</td>
                  <td style={{ padding: 10, border: "1px solid #f1f5f9" }}>{u.email}</td>
                  <td style={{ padding: 10, border: "1px solid #f1f5f9" }}>{u.role}</td>
                  <td style={{ padding: 10, border: "1px solid #f1f5f9" }}>
                    <button
                      onClick={() => openEdit(u)}
                      style={{
                        marginRight: 8,
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        border: "1px solid #eab308",
                        background: "#fef3c7",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(u.id, u.username)}
                      disabled={deletingUserId === u.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: deletingUserId === u.id ? "not-allowed" : "pointer",
                        border: "none",
                        background: "#ef4444",
                        color: "#fff",
                      }}
                    >
                      {deletingUserId === u.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#6b7280", marginTop: 8 }}>No users found</div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {editingUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 560,
              maxWidth: "95%",
              background: "#fff",
              borderRadius: 8,
              padding: 20,
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                right: 18,
                top: 14,
                border: "none",
                background: "transparent",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            <h3 style={{ marginTop: 0 }}>{editingUser.isNew ? "Add User" : "Edit User"}</h3>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Username</label>
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }}
              />
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }}
              >
                <option value="admin">admin</option>
                <option value="manager">manager</option>
                <option value="cashier">cashier</option>
                <option value="customer">customer</option>
              </select>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
                Password {editingUser.isNew ? "(required)" : "(leave blank to keep existing)"}
              </label>
              <input
                type="password"
                value={editingUser.password}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }}
                placeholder={editingUser.isNew ? "Set a password" : "New password (optional)"}
              />
            </div>

            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "8px 12px",
                  marginRight: 8,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
