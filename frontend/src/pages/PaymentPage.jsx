import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import paymentApi from "../services/paymentApi";
import ErrorMessage from "../components/common/ErrorMessage";
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  onlyDigits,
  validateCardForm,
} from "../utils/cardValidation";

const EMPTY_CARD = { cardNumber: "", cardHolder: "", expiry: "", cvv: "" };
const STATUS_LABELS = { PAID: "Ödendi", PAYMENT_FAILED: "Ödeme Başarısız" };

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderIds = location.state?.orderIds || [];

  const [card, setCard] = useState(EMPTY_CARD);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [results, setResults] = useState([]);
  const [isPaying, setIsPaying] = useState(false);

  if (!orderIds.length) {
    return (
      <div className="page">
        <h1>Ödeme</h1>
        <ErrorMessage message="Ödeme bekleyen bir sipariş yok. Sepetinden ödeme sürecini başlat." />
      </div>
    );
  }

  const updateField = (name, value) => {
    setCard((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCardNumberChange = (e) => updateField("cardNumber", formatCardNumber(e.target.value));
  const handleCardHolderChange = (e) => updateField("cardHolder", e.target.value.toUpperCase());
  const handleExpiryChange = (e) => updateField("expiry", formatExpiry(e.target.value));
  const handleCvvChange = (e) => updateField("cvv", onlyDigits(e.target.value).slice(0, 3));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validateCardForm(card);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsPaying(true);
    try {
      const paymentResults = [];
      for (const orderId of orderIds) {
        const result = await paymentApi.pay({ orderId, ...card, cardNumber: onlyDigits(card.cardNumber) });
        paymentResults.push(result);
      }
      setResults(paymentResults);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  if (results.length) {
    const allSucceeded = results.every((r) => r.success);
    return (
      <div className="page">
        <h1>Ödeme {allSucceeded ? "Başarılı" : "Sonucu"}</h1>
        <ul className="payment-results">
          {results.map((r) => (
            <li key={r.orderId} className={r.success ? "payment-results__item--success" : "payment-results__item--fail"}>
              Sipariş {r.orderId}: <strong>{STATUS_LABELS[r.status] || r.status}</strong>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--primary" onClick={() => navigate("/orders")}>
          Siparişlerimi Görüntüle
        </button>
      </div>
    );
  }

  const cardDigits = onlyDigits(card.cardNumber);
  const maskedNumber = cardDigits
    ? cardDigits.padEnd(16, "•").match(/.{1,4}/g).join(" ")
    : "•••• •••• •••• ••••";

  return (
    <div className="page">
      <h1>Ödeme (FakePay)</h1>
      <p className="hint">
        Başarılı ödeme için <code>4242 4242 4242 4242</code>, başarısız ödeme simülasyonu için{" "}
        <code>4000 0000 0000 0000</code> kullanabilirsiniz.
      </p>

      <div className="payment-layout">
        <div className={`credit-card credit-card--${card.cardNumber ? "filled" : "empty"}`}>
          <div className="credit-card__top">
            <span className="credit-card__chip" />
            <span className="credit-card__brand">{card.cardNumber ? detectCardBrand(card.cardNumber) : ""}</span>
          </div>
          <div className="credit-card__number">{maskedNumber}</div>
          <div className="credit-card__bottom">
            <div>
              <span className="credit-card__label">Kart Sahibi</span>
              <span className="credit-card__value">{card.cardHolder || "AD SOYAD"}</span>
            </div>
            <div>
              <span className="credit-card__label">Son Kul.</span>
              <span className="credit-card__value">{card.expiry || "AA/YY"}</span>
            </div>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit} noValidate>
          {submitError && <ErrorMessage message={submitError} />}

          <label>
            Kart Numarası
            <input
              type="text"
              inputMode="numeric"
              name="cardNumber"
              placeholder="0000 0000 0000 0000"
              value={card.cardNumber}
              onChange={handleCardNumberChange}
              className={fieldErrors.cardNumber ? "input--error" : ""}
              maxLength={19}
            />
            {fieldErrors.cardNumber && <span className="field-error">{fieldErrors.cardNumber}</span>}
          </label>

          <label>
            Kart Sahibi
            <input
              type="text"
              name="cardHolder"
              placeholder="AD SOYAD"
              value={card.cardHolder}
              onChange={handleCardHolderChange}
              className={fieldErrors.cardHolder ? "input--error" : ""}
            />
            {fieldErrors.cardHolder && <span className="field-error">{fieldErrors.cardHolder}</span>}
          </label>

          <div className="payment-form__row">
            <label>
              Son Kullanma Tarihi
              <input
                type="text"
                inputMode="numeric"
                name="expiry"
                placeholder="AA/YY"
                value={card.expiry}
                onChange={handleExpiryChange}
                className={fieldErrors.expiry ? "input--error" : ""}
                maxLength={5}
              />
              {fieldErrors.expiry && <span className="field-error">{fieldErrors.expiry}</span>}
            </label>

            <label>
              CVV
              <input
                type="text"
                inputMode="numeric"
                name="cvv"
                placeholder="123"
                value={card.cvv}
                onChange={handleCvvChange}
                className={fieldErrors.cvv ? "input--error" : ""}
                maxLength={3}
              />
              {fieldErrors.cvv && <span className="field-error">{fieldErrors.cvv}</span>}
            </label>
          </div>

          <button type="submit" className="btn btn--primary" disabled={isPaying}>
            {isPaying ? "İşleniyor..." : "Öde"}
          </button>
        </form>
      </div>
    </div>
  );
}
