const paymentService = require("../services/paymentService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const pay = asyncHandler(async (req, res) => {
  const { orderId, cardNumber } = req.body;
  const result = await paymentService.pay(req.user.id, { orderId, cardNumber });
  sendSuccess(res, 200, result);
});

module.exports = { pay };
