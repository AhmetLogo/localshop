const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Çok fazla giriş denemesi yapıldı, lütfen daha sonra tekrar deneyin." },
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Çok fazla ödeme denemesi yapıldı, lütfen daha sonra tekrar deneyin." },
});

module.exports = { generalLimiter, authLimiter, paymentLimiter };
