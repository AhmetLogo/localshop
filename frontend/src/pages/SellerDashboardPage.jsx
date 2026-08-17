import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../services/productApi";
import orderApi from "../services/orderApi";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import OrderCard from "../components/order/OrderCard";

const NEXT_STATUS = { PAID: "SHIPPED", SHIPPED: "DELIVERED" };
const NEXT_STATUS_LABEL = { SHIPPED: "Kargoya Verildi", DELIVERED: "Teslim Edildi" };

function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productApi.getSellerProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin?")) return;
    try {
      await productApi.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <Loading label="Ürünlerin yükleniyor..." />;

  return (
    <div>
      <div className="section-header">
        <h2>Ürünlerim</h2>
        <Link to="/seller/products/new" className="btn btn--primary">
          Ürün Ekle
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {products.length === 0 ? (
        <EmptyState message="Henüz hiç ürün eklemedin." />
      ) : (
        <table className="seller-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price.toFixed(2)} ₺</td>
                <td>{product.stock}</td>
                <td className="seller-table__actions">
                  <Link to={`/seller/products/${product._id}/edit`}>Düzenle</Link>
                  <button type="button" className="btn btn--danger" onClick={() => handleDelete(product._id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderApi.getSellerOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleAdvanceStatus = async (order) => {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;

    setUpdatingOrderId(order._id);
    try {
      const updated = await orderApi.updateOrderStatus(order._id, nextStatus);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) return <Loading label="Siparişler yükleniyor..." />;

  return (
    <div>
      <h2>Gelen Siparişler</h2>

      {error && <ErrorMessage message={error} />}

      {orders.length === 0 ? (
        <EmptyState message="Henüz sipariş yok." />
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            const nextStatus = NEXT_STATUS[order.status];
            return (
              <OrderCard
                key={order._id}
                order={order}
                actions={
                  nextStatus && (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => handleAdvanceStatus(order)}
                      disabled={updatingOrderId === order._id}
                    >
                      {NEXT_STATUS_LABEL[nextStatus]} Olarak İşaretle
                    </button>
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SellerDashboardPage() {
  const [tab, setTab] = useState("products");

  return (
    <div className="page">
      <h1>Satıcı Paneli</h1>

      <div className="tabs">
        <button type="button" className={tab === "products" ? "tab tab--active" : "tab"} onClick={() => setTab("products")}>
          Ürünlerim
        </button>
        <button type="button" className={tab === "orders" ? "tab tab--active" : "tab"} onClick={() => setTab("orders")}>
          Siparişler
        </button>
      </div>

      {tab === "products" ? <SellerProducts /> : <SellerOrders />}
    </div>
  );
}
