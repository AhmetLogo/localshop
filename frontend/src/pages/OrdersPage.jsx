import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../services/orderApi";
import OrderCard from "../components/order/OrderCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await orderApi.getOrders();
        if (!cancelled) setOrders(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCompletePayment = (orderId) => {
    navigate("/payment", { state: { orderIds: [orderId] } });
  };

  return (
    <div className="page">
      <h1>Siparişlerim</h1>

      {isLoading && <Loading label="Siparişler yükleniyor..." />}
      {!isLoading && error && <ErrorMessage message={error} />}
      {!isLoading && !error && orders.length === 0 && <EmptyState message="Henüz siparişin yok." />}

      {!isLoading && !error && orders.length > 0 && (
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              actions={
                order.status === "PENDING_PAYMENT" && (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => handleCompletePayment(order._id)}
                  >
                    Ödemeyi Tamamla
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
