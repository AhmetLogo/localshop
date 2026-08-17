import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productApi from "../services/productApi";
import cartApi from "../services/cartApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await productApi.getProductById(id);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setActionError(null);
    setIsAdding(true);
    try {
      await cartApi.addItem(product._id, quantity);
      await refreshCart();
      navigate("/cart");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <Loading label="Ürün yükleniyor..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const canAddToCart = isAuthenticated && user.role === "CUSTOMER" && product.stock > 0;

  return (
    <div className="page product-detail">
      <h1>{product.name}</h1>
      <p className="product-detail__category">{product.category}</p>
      <p className="product-detail__price">{product.price.toFixed(2)} ₺</p>
      <p>{product.description}</p>
      <p className="product-detail__stock">
        {product.stock > 0 ? `${product.stock} adet stokta` : "Stokta yok"}
      </p>
      {product.sellerId?.name && <p className="product-detail__seller">Satıcı: {product.sellerId.name}</p>}

      {actionError && <ErrorMessage message={actionError} />}

      {isAuthenticated && user.role === "SELLER" ? (
        <p className="hint">Satıcılar sepete ürün ekleyemez.</p>
      ) : (
        <div className="product-detail__actions">
          <input
            type="number"
            min={1}
            max={product.stock || 1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={product.stock === 0}
          />
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleAddToCart}
            disabled={!canAddToCart && isAuthenticated}
          >
            {isAdding ? "Ekleniyor..." : "Sepete Ekle"}
          </button>
        </div>
      )}
    </div>
  );
}
