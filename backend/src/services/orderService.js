const { Order } = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const cartService = require("./cartService");
const AppError = require("../utils/AppError");

const SELLER_ALLOWED_TRANSITIONS = {
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};

async function createOrderFromCart(customerId) {
  const cart = await cartService.getOrCreateCart(customerId);

  if (!cart.items.length) {
    throw new AppError("Sepet boş", 400);
  }

  const productIds = cart.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  // Validate stock and build seller groups using DB-sourced price, never client input.
  const groupsBySeller = new Map();

  for (const item of cart.items) {
    const product = productMap.get(item.productId.toString());
    if (!product) {
      throw new AppError("Sepetinizdeki bir ürün artık mevcut değil", 400);
    }
    if (item.quantity > product.stock) {
      throw new AppError(`${product.name} için yetersiz stok`, 400);
    }

    const sellerKey = product.sellerId.toString();
    if (!groupsBySeller.has(sellerKey)) {
      groupsBySeller.set(sellerKey, []);
    }
    groupsBySeller.get(sellerKey).push({ product, quantity: item.quantity });
  }

  // Note: MVP runs against a standalone MongoDB instance (no replica set),
  // so multi-document transactions aren't used here. Stock was already
  // re-validated against fresh product reads immediately above.
  const createdOrders = [];

  for (const [sellerId, entries] of groupsBySeller.entries()) {
    const items = entries.map(({ product, quantity }) => ({
      productId: product._id,
      productName: product.name,
      unitPrice: product.price,
      quantity,
    }));
    const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    const order = await Order.create({
      customerId,
      sellerId,
      items,
      totalPrice,
      status: "PENDING_PAYMENT",
    });

    for (const { product, quantity } of entries) {
      product.stock -= quantity;
      await product.save();
    }

    createdOrders.push(order);
  }

  await Cart.updateOne({ userId: customerId }, { items: [] });

  return createdOrders;
}

async function getCustomerOrders(customerId) {
  return Order.find({ customerId }).sort({ createdAt: -1 });
}

async function getCustomerOrderById(customerId, orderId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Sipariş bulunamadı", 404);
  }
  if (order.customerId.toString() !== customerId) {
    throw new AppError("Bu siparişe erişim yetkiniz yok", 403);
  }
  return order;
}

// Orders the customer hasn't paid for yet are not real commitments —
// sellers only see orders once payment has succeeded.
const SELLER_VISIBLE_STATUSES = ["PAID", "SHIPPED", "DELIVERED"];

async function getSellerOrders(sellerId) {
  return Order.find({ sellerId, status: { $in: SELLER_VISIBLE_STATUSES } }).sort({ createdAt: -1 });
}

async function updateOrderStatusBySeller(sellerId, orderId, newStatus) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Sipariş bulunamadı", 404);
  }
  if (order.sellerId.toString() !== sellerId) {
    throw new AppError("Bu siparişe erişim yetkiniz yok", 403);
  }

  const allowedNextStatuses = SELLER_ALLOWED_TRANSITIONS[order.status] || [];
  if (!allowedNextStatuses.includes(newStatus)) {
    throw new AppError(`Sipariş ${order.status} durumundan ${newStatus} durumuna geçemez`, 400);
  }

  order.status = newStatus;
  await order.save();
  return order;
}

async function setPaymentResult(orderId, customerId, success) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Sipariş bulunamadı", 404);
  }
  if (order.customerId.toString() !== customerId) {
    throw new AppError("Bu siparişe erişim yetkiniz yok", 403);
  }
  if (order.status !== "PENDING_PAYMENT") {
    throw new AppError(`Sipariş ödeme beklemiyor (mevcut durum: ${order.status})`, 409);
  }

  order.status = success ? "PAID" : "PAYMENT_FAILED";
  await order.save();
  return order;
}

module.exports = {
  createOrderFromCart,
  getCustomerOrders,
  getCustomerOrderById,
  getSellerOrders,
  updateOrderStatusBySeller,
  setPaymentResult,
};
