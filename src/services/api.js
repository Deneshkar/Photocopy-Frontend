import axios from "axios";

const DEFAULT_API_ORIGIN = "http://localhost:5000";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const normalizePath = (value = "") =>
  value.replace(/\\/g, "/").replace(/^\/+/, "");

export const API_ORIGIN = trimTrailingSlash(
  import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN
);

const API = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

API.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization =
      config.headers.Authorization || `Bearer ${token}`;
  }

  return config;
});

export const buildFileUrl = (pathValue = "") => {
  if (!pathValue) {
    return "";
  }

  if (/^https?:\/\//i.test(pathValue)) {
    return pathValue;
  }

  return `${API_ORIGIN}/${normalizePath(pathValue)}`;
};

export default API;
