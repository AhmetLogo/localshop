const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const { validatePayment } = require("../validators/paymentValidators");
const { paymentLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post(
  "/pay",
  paymentLimiter,
  authenticate,
  authorize("CUSTOMER"),
  validate(validatePayment),
  paymentController.pay
);

module.exports = router;
