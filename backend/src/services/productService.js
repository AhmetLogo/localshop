const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const ALLOWED_UPDATE_FIELDS = ["name", "description", "price", "stock", "category"];

async function createProduct(sellerId, payload) {
  const product = await Product.create({
    name: payload.name.trim(),
    description: payload.description.trim(),
    price: Number(payload.price),
    stock: Number(payload.stock),
    category: payload.category.trim().toLowerCase(),
    sellerId,
  });

  return product;
}

async function getSellerProducts(sellerId) {
  return Product.find({ sellerId }).sort({ createdAt: -1 });
}

async function findOwnedProduct(productId, sellerId) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Ürün bulunamadı", 404);
  }
  if (product.sellerId.toString() !== sellerId) {
    throw new AppError("Bu ürünün sahibi değilsiniz", 403);
  }
  return product;
}

async function updateProduct(productId, sellerId, payload) {
  const product = await findOwnedProduct(productId, sellerId);

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (payload[field] !== undefined) {
      product[field] = field === "category" ? String(payload[field]).trim().toLowerCase() : payload[field];
    }
  }

  await product.save();
  return product;
}

async function deleteProduct(productId, sellerId) {
  const product = await findOwnedProduct(productId, sellerId);
  await product.deleteOne();
}

async function listProducts({ search, category, page = 1, limit = 12 }) {
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.category = category.toLowerCase();
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate({ path: "sellerId", select: "name" }),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

async function getProductById(productId) {
  const product = await Product.findById(productId).populate({ path: "sellerId", select: "name" });
  if (!product) {
    throw new AppError("Ürün bulunamadı", 404);
  }
  return product;
}

module.exports = {
  createProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  listProducts,
  getProductById,
  findOwnedProduct,
};
