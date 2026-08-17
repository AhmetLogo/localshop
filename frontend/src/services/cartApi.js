import { apiClient } from "./apiClient";

const cartApi = {
  getCart: () => apiClient.get("/cart"),
  addItem: (productId, quantity) => apiClient.post("/cart/items", { productId, quantity }),
  updateQuantity: (productId, quantity) => apiClient.patch(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => apiClient.delete(`/cart/items/${productId}`),
};

export default cartApi;
