const express = require("express");
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const { validateAddItem, validateUpdateQuantity } = require("../validators/cartValidators");

const router = express.Router();

router.use(authenticate, authorize("CUSTOMER"));

router.get("/", cartController.getCart);
router.post("/items", validate(validateAddItem), cartController.addItem);
router.patch("/items/:productId", validate(validateUpdateQuantity), cartController.updateItemQuantity);
router.delete("/items/:productId", cartController.removeItem);

module.exports = router;
