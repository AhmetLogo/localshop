const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

/**
 * Builds a response DTO where price/name always come from the current
 * Product collection, never from what the client sent or cached earlier.
 */
async function buildCartView(cart) {
  const productIds = cart.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let totalPrice = 0;
  const items = cart.items
    .map((item) => {
      const product = productMap.get(item.productId.toString());
      if (!product) return null;

      const lineTotal = product.price * item.quantity;
      totalPrice += lineTotal;

      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        quantity: item.quantity,
        lineTotal,
      };
    })
    .filter(Boolean);

  return { id: cart._id, items, totalPrice };
}

async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  return buildCartView(cart);
}

async function addItem(userId, productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Ürün bulunamadı", 404);
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find((item) => item.productId.toString() === productId);
  const desiredQuantity = (existingItem ? existingItem.quantity : 0) + Number(quantity);

  if (desiredQuantity > product.stock) {
    throw new AppError("Yetersiz stok", 400);
  }

  if (existingItem) {
    existingItem.quantity = desiredQuantity;
  } else {
    cart.items.push({ productId, quantity: Number(quantity) });
  }

  await cart.save();
  return buildCartView(cart);
}

async function updateItemQuantity(userId, productId, quantity) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Ürün bulunamadı", 404);
  }
  if (Number(quantity) > product.stock) {
    throw new AppError("Yetersiz stok", 400);
  }

  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) {
    throw new AppError("Ürün sepette bulunamadı", 404);
  }

  item.quantity = Number(quantity);
  await cart.save();
  return buildCartView(cart);
}

async function removeItem(userId, productId) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  await cart.save();
  return buildCartView(cart);
}

async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return cart;
}

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart, getOrCreateCart };
