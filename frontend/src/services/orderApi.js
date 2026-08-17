import { apiClient } from "./apiClient";

const orderApi = {
  createOrder: () => apiClient.post("/orders"),
  getOrders: () => apiClient.get("/orders"),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  getSellerOrders: () => apiClient.get("/seller/orders"),
  updateOrderStatus: (id, status) => apiClient.patch(`/seller/orders/${id}/status`, { status }),
};

export default orderApi;
