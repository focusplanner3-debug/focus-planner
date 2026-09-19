import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// The planner was originally built for Claude.ai's artifact storage API.
// This shim reproduces the same get/set/delete/list shape using plain
// localStorage, so the exact same App.jsx works standalone on your PC.
if (!window.storage) {
  const ns = (key, shared) => (shared ? "shared:" : "local:") + key;

  window.storage = {
    async get(key, shared = false) {
      const raw = localStorage.getItem(ns(key, shared));
      if (raw === null) throw new Error(`Key not found: ${key}`);
      return { key, value: raw, shared };
    },
    async set(key, value, shared = false) {
      localStorage.setItem(ns(key, shared), value);
      return { key, value, shared };
    },
    async delete(key, shared = false) {
      localStorage.removeItem(ns(key, shared));
      return { key, deleted: true, shared };
    },
    async list(prefix = "", shared = false) {
      const full = ns(prefix, shared);
      const base = shared ? "shared:" : "local:";
      const keys = Object.keys(localStorage)
        .filter((k) => k.startsWith(full))
        .map((k) => k.slice(base.length));
      return { keys, prefix, shared };
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
