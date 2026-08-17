const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Kimlik doğrulama tokenı eksik", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Token geçersiz veya süresi dolmuş", 401);
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError("Kullanıcı artık mevcut değil", 401);
  }

  req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
  next();
});

module.exports = { authenticate };
