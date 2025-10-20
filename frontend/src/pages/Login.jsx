// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (token && savedRole) {
      if (savedRole === "admin") navigate("/admin");
      else if (savedRole === "cashier") navigate("/cashier");
      else if (savedRole === "manager") navigate("/manager");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        identifier,
        password,
        role,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        const r = (res.data.role || role || "").toLowerCase();
        if (r === "admin") navigate("/admin");
        else if (r === "cashier") navigate("/cashier");
        else if (r === "manager") navigate("/manager");
        else navigate("/");
      } else {
        setError(res.data.message || "Invalid credentials or role");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(err.response.data.message || "Invalid username/email, password or role");
      } else if (err.response) {
        setError(`Login failed: ${err.response.data.message || err.response.statusText}`);
      } else {
        setError("Network error. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
          <option value="manager">Manager</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
