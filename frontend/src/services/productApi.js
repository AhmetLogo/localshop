import { apiClient } from "./apiClient";

const productApi = {
  getProducts: (params) => apiClient.get("/products", params, { auth: false }),
  getProductById: (id) => apiClient.get(`/products/${id}`, undefined, { auth: false }),
  getSellerProducts: () => apiClient.get("/seller/products"),
  createProduct: (payload) => apiClient.post("/products", payload),
  updateProduct: (id, payload) => apiClient.patch(`/products/${id}`, payload),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

export default productApi;
