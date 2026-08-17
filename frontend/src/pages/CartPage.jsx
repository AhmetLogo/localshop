import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "../services/cartApi";
import orderApi from "../services/orderApi";
import { useCart } from "../context/CartContext";
import CartItemRow from "../components/cart/CartItemRow";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

export default function CartPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    setError(null);
    setUpdatingProductId(productId);
    try {
      await cartApi.updateQuantity(productId, quantity);
      await refreshCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleRemove = async (productId) => {
    setError(null);
    setUpdatingProductId(productId);
    try {
      await cartApi.removeItem(productId);
      await refreshCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleCheckout = async () => {
    setError(null);
    setIsCheckingOut(true);
    try {
      const orders = await orderApi.createOrder();
      await refreshCart();
      navigate("/payment", { state: { orderIds: orders.map((o) => o._id) } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const items = cart?.items || [];

  return (
    <div className="page">
      <h1>Sepetim</h1>

      {error && <ErrorMessage message={error} />}

      {items.length === 0 ? (
        <EmptyState message="Sepetin boş." />
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                isUpdating={updatingProductId === item.productId}
              />
            ))}
          </div>

          <div className="cart-summary">
            <span>Toplam: {cart.totalPrice.toFixed(2)} ₺</span>
            <button type="button" className="btn btn--primary" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? "Sipariş oluşturuluyor..." : "Siparişi Tamamla"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
