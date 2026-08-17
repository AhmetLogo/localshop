import { apiClient } from "./apiClient";

const authApi = {
  register: (payload) => apiClient.post("/auth/register", payload, { auth: false }),
  login: (payload) => apiClient.post("/auth/login", payload, { auth: false }),
};

export default authApi;
