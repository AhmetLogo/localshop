const orderService = require("./orderService");

// Luhn-valid decline test card (matches the widely used FakePay/Stripe convention).
const FAILING_TEST_CARD = "4000000000000002";

/**
 * Simulated payment gateway. Card details are used only in-memory for this
 * single check and are never persisted, logged, or echoed back.
 */
function simulateFakePayCharge(cardNumber) {
  const normalized = String(cardNumber).replace(/\s+/g, "");
  return normalized !== FAILING_TEST_CARD;
}

async function pay(customerId, { orderId, cardNumber }) {
  const success = simulateFakePayCharge(cardNumber);
  const order = await orderService.setPaymentResult(orderId, customerId, success);

  return {
    orderId: order._id,
    status: order.status,
    success,
  };
}

module.exports = { pay };
