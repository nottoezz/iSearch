import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
console.log("[api] baseURL =", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config._ts = Date.now();
  if (import.meta.env.DEV) {
    console.log(
      `[api →] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.params || {},
      config.data || ""
    );
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      const ms = Date.now() - (res.config._ts || Date.now());
      console.log(
        `[api ←] ${res.status} ${res.config.method?.toUpperCase()} ${
          res.config.baseURL
        }${res.config.url} (${ms}ms)`
      );
    }
    return res;
  },
  (err) => {
    const s = err.response?.status ?? "NETWORK";
    const cfg = err.config || {};
    console.error(
      `[api ←x] ${s} ${cfg.method?.toUpperCase()} ${cfg.baseURL || ""}${
        cfg.url || ""
      }`,
      err.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

export default api;
