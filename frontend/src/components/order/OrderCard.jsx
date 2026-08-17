const STATUS_LABELS = {
  PENDING_PAYMENT: "Ödeme Bekleniyor",
  PAID: "Ödendi",
  PAYMENT_FAILED: "Ödeme Başarısız",
  SHIPPED: "Kargoya Verildi",
  DELIVERED: "Teslim Edildi",
};

export default function OrderCard({ order, actions }) {
  return (
    <div className="order-card">
      <div className="order-card__header">
        <span className="order-card__id">Sipariş #{order._id.slice(-6).toUpperCase()}</span>
        <span className={`order-status order-status--${order.status.toLowerCase()}`}>
          {STATUS_LABELS[order.status] || order.status}
        </span>
      </div>

      <ul className="order-card__items">
        {order.items.map((item) => (
          <li key={item.productId}>
            {item.productName} × {item.quantity} — {(item.unitPrice * item.quantity).toFixed(2)} ₺
          </li>
        ))}
      </ul>

      <div className="order-card__footer">
        <span>Toplam: {order.totalPrice.toFixed(2)} ₺</span>
        <span>{new Date(order.createdAt).toLocaleDateString("tr-TR")}</span>
      </div>

      {actions}
    </div>
  );
}
