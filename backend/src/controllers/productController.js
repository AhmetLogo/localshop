const productService = require("../services/productService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.user.id, req.body);
  sendSuccess(res, 201, product);
});

const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await productService.getSellerProducts(req.user.id);
  sendSuccess(res, 200, products);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.user.id, req.body);
  sendSuccess(res, 200, product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id, req.user.id);
  sendSuccess(res, 200, { message: "Ürün silindi" });
});

const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  sendSuccess(res, 200, result);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, 200, product);
});

module.exports = {
  createProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  listProducts,
  getProductById,
};
