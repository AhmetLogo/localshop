import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <h3>{product.name}</h3>
      <p className="product-card__category">{product.category}</p>
      <p className="product-card__price">{product.price.toFixed(2)} ₺</p>
      <p className="product-card__stock">{product.stock > 0 ? `${product.stock} adet stokta` : "Stokta yok"}</p>
      {product.sellerId?.name && <p className="product-card__seller">Satıcı: {product.sellerId.name}</p>}
    </Link>
  );
}
