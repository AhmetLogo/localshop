const mongoose = require("mongoose");

const CARD_NUMBER_LENGTH = 16;
const CVV_LENGTH = 3;

function onlyDigits(value) {
  return String(value).replace(/\D/g, "");
}

function luhnCheck(cardNumber) {
  const digits = onlyDigits(cardNumber);
  if (digits.length !== CARD_NUMBER_LENGTH) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isValidExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(String(value).trim());
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

function isValidCardHolder(value) {
  return /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s'.-]{3,}$/.test(String(value).trim());
}

function isValidCVV(value) {
  return new RegExp(`^\\d{${CVV_LENGTH}}$`).test(String(value).trim());
}

function validatePayment(req) {
  const errors = [];
  const { orderId, cardNumber, cardHolder, expiry, cvv } = req.body || {};

  if (!orderId || !mongoose.isValidObjectId(orderId)) {
    errors.push("Geçerli bir sipariş id'si girilmelidir");
  }
  if (!cardNumber || !luhnCheck(cardNumber)) {
    errors.push("Geçerli bir kart numarası girilmelidir");
  }
  if (!cardHolder || !isValidCardHolder(cardHolder)) {
    errors.push("Geçerli bir kart sahibi adı girilmelidir");
  }
  if (!expiry || !isValidExpiry(expiry)) {
    errors.push("Son kullanma tarihi geçersiz veya süresi dolmuş (AA/YY)");
  }
  if (!cvv || !isValidCVV(cvv)) {
    errors.push(`CVV ${CVV_LENGTH} haneli olmalıdır`);
  }

  return errors;
}

module.exports = { validatePayment };
