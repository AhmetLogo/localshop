const cartService = require("../services/cartService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  sendSuccess(res, 200, cart);
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body.productId, req.body.quantity);
  sendSuccess(res, 201, cart);
});

const updateItemQuantity = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(req.user.id, req.params.productId, req.body.quantity);
  sendSuccess(res, 200, cart);
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.productId);
  sendSuccess(res, 200, cart);
});

module.exports = { getCart, addItem, updateItemQuantity, removeItem };
