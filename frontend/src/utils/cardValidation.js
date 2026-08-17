export function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

const CARD_NUMBER_LENGTH = 16;
const CVV_LENGTH = 3;

export function formatCardNumber(value) {
  const digits = onlyDigits(value).slice(0, CARD_NUMBER_LENGTH);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function luhnCheck(cardNumber) {
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

export function detectCardBrand(cardNumber) {
  const digits = onlyDigits(cardNumber);
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  return "Kart";
}

export function isValidExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
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

export function isValidCardHolder(value) {
  return /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s'.-]{3,}$/.test(value.trim());
}

export function isValidCVV(value) {
  return new RegExp(`^\\d{${CVV_LENGTH}}$`).test(value);
}

export function validateCardForm({ cardNumber, cardHolder, expiry, cvv }) {
  const errors = {};

  if (!luhnCheck(cardNumber)) {
    errors.cardNumber = "Geçerli bir kart numarası girin";
  }
  if (!isValidCardHolder(cardHolder)) {
    errors.cardHolder = "Kart sahibinin adını soyadını girin";
  }
  if (!isValidExpiry(expiry)) {
    errors.expiry = "Son kullanma tarihi geçersiz veya süresi dolmuş (AA/YY)";
  }
  if (!isValidCVV(cvv)) {
    errors.cvv = `CVV ${CVV_LENGTH} haneli olmalıdır`;
  }

  return errors;
}
