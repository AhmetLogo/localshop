const AppError = require("../utils/AppError");

function authorize(...allowedRoles) {
  return function roleHandler(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError("Bu işlemi yapma yetkiniz yok", 403);
    }
    next();
  };
}

module.exports = { authorize };
