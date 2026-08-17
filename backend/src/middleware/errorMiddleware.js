const { sendError } = require("../utils/apiResponse");

function notFoundHandler(req, res, next) {
  const error = new Error(`Rota bulunamadı: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (!err.isOperational) {
    console.error("[unhandled error]", err);
  }

  const message = !isProduction || err.isOperational ? err.message : "Sunucu hatası";

  sendError(res, statusCode, message);
}

module.exports = { notFoundHandler, errorHandler };
