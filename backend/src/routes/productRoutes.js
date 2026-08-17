const express = require("express");
const productController = require("../controllers/productController");
const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const { validate } = require("../middleware/validationMiddleware");
const { validateCreateProduct, validateUpdateProduct } = require("../validators/productValidators");

const router = express.Router();

// Public catalog
router.get("/", productController.listProducts);
router.get("/:id", productController.getProductById);

// Seller-only management
router.post(
  "/",
  authenticate,
  authorize("SELLER"),
  validate(validateCreateProduct),
  productController.createProduct
);
router.patch(
  "/:id",
  authenticate,
  authorize("SELLER"),
  validate(validateUpdateProduct),
  productController.updateProduct
);
router.delete("/:id", authenticate, authorize("SELLER"), productController.deleteProduct);

module.exports = router;
