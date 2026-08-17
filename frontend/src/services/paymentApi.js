import { apiClient } from "./apiClient";

const paymentApi = {
  pay: (payload) => apiClient.post("/payments/pay", payload),
};

export default paymentApi;
