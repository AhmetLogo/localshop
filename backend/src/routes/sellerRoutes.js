const express = require("express");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const { validateStatusUpdate } = require("../validators/orderValidators");

const router = express.Router();

router.use(authenticate, authorize("SELLER"));

router.get("/products", productController.getSellerProducts);
router.get("/orders", orderController.getSellerOrders);
router.patch("/orders/:id/status", validate(validateStatusUpdate), orderController.updateOrderStatus);

module.exports = router;
