import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // default export
import "./styles/index.css";
// admin overrides AFTER global css
import "./styles/admin.css";     // <-- important: load after index.css

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
