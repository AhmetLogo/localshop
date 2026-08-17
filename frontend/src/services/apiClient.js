const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_STORAGE_KEY = "localshop_token";

function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

function buildQueryString(params) {
  if (!params) return "";
  const filtered = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!filtered.length) return "";
  return `?${new URLSearchParams(filtered).toString()}`;
}

async function request(path, { method = "GET", body, params, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}${buildQueryString(params)}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `İstek başarısız oldu (durum kodu: ${response.status})`;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return payload?.data;
}

export const apiClient = {
  get: (path, params, options) => request(path, { method: "GET", params, ...options }),
  post: (path, body, options) => request(path, { method: "POST", body, ...options }),
  patch: (path, body, options) => request(path, { method: "PATCH", body, ...options }),
  delete: (path, options) => request(path, { method: "DELETE", ...options }),
};

export const tokenStorage = { getToken, setToken };
