import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// bootstrap styles + js (for collapse/offcanvas, etc.)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// app theme overrides
import "./styles.css";

// mount the app into #root with react strict mode
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
