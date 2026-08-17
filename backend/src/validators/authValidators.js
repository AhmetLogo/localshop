const { ROLES } = require("../models/User");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(req) {
  const errors = [];
  const { name, email, password, role } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("İsim zorunludur");
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("E-posta zorunludur");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Geçerli bir e-posta adresi girin");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Şifre zorunludur ve en az 6 karakter olmalıdır");
  }
  if (!role || !ROLES.includes(role)) {
    errors.push(`Rol şunlardan biri olmalıdır: ${ROLES.join(", ")}`);
  }

  return errors;
}

function validateLogin(req) {
  const errors = [];
  const { email, password } = req.body || {};

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("E-posta zorunludur");
  }
  if (!password || typeof password !== "string") {
    errors.push("Şifre zorunludur");
  }

  return errors;
}

module.exports = { validateRegister, validateLogin };
