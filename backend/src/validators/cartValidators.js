const mongoose = require("mongoose");

function validateAddItem(req) {
  const errors = [];
  const { productId, quantity } = req.body || {};

  if (!productId || !mongoose.isValidObjectId(productId)) {
    errors.push("Geçerli bir ürün id'si girilmelidir");
  }
  if (quantity === undefined || Number.isNaN(Number(quantity)) || Number(quantity) <= 0) {
    errors.push("Adet 0'dan büyük olmalıdır");
  }

  return errors;
}

function validateUpdateQuantity(req) {
  const errors = [];
  const { quantity } = req.body || {};

  if (quantity === undefined || Number.isNaN(Number(quantity)) || Number(quantity) <= 0) {
    errors.push("Adet 0'dan büyük olmalıdır");
  }

  return errors;
}

module.exports = { validateAddItem, validateUpdateQuantity };
