const { ORDER_STATUSES } = require("../models/Order");

function validateStatusUpdate(req) {
  const errors = [];
  const { status } = req.body || {};

  if (!status || !ORDER_STATUSES.includes(status)) {
    errors.push(`Durum şunlardan biri olmalıdır: ${ORDER_STATUSES.join(", ")}`);
  }

  return errors;
}

module.exports = { validateStatusUpdate };
