const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticate, authorize("CUSTOMER"));

router.post("/", orderController.createOrder);
router.get("/", orderController.getCustomerOrders);
router.get("/:id", orderController.getCustomerOrderById);

module.exports = router;
