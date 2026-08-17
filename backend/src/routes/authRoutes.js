const express = require("express");
const authController = require("../controllers/authController");
const { validate } = require("../middleware/validationMiddleware");
const { validateRegister, validateLogin } = require("../validators/authValidators");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/register", authLimiter, validate(validateRegister), authController.register);
router.post("/login", authLimiter, validate(validateLogin), authController.login);

module.exports = router;
