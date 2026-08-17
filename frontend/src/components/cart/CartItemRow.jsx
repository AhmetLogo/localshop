export default function CartItemRow({ item, onQuantityChange, onRemove, isUpdating }) {
  return (
    <div className="cart-item">
      <div className="cart-item__info">
        <h3>{item.name}</h3>
        <p>{item.price.toFixed(2)} ₺ / adet</p>
      </div>

      <div className="cart-item__quantity">
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          disabled={isUpdating || item.quantity >= item.stock}
        >
          +
        </button>
      </div>

      <div className="cart-item__total">{item.lineTotal.toFixed(2)} ₺</div>

      <button
        type="button"
        className="btn btn--danger"
        onClick={() => onRemove(item.productId)}
        disabled={isUpdating}
      >
        Kaldır
      </button>
    </div>
  );
}
