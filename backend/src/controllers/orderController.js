const orderService = require("../services/orderService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const createOrder = asyncHandler(async (req, res) => {
  const orders = await orderService.createOrderFromCart(req.user.id);
  sendSuccess(res, 201, orders);
});

const getCustomerOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getCustomerOrders(req.user.id);
  sendSuccess(res, 200, orders);
});

const getCustomerOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getCustomerOrderById(req.user.id, req.params.id);
  sendSuccess(res, 200, order);
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getSellerOrders(req.user.id);
  sendSuccess(res, 200, orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatusBySeller(req.user.id, req.params.id, req.body.status);
  sendSuccess(res, 200, order);
});

module.exports = {
  createOrder,
  getCustomerOrders,
  getCustomerOrderById,
  getSellerOrders,
  updateOrderStatus,
};
