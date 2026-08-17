import ProductCard from "./ProductCard";
import EmptyState from "../common/EmptyState";

export default function ProductList({ products }) {
  if (!products.length) {
    return <EmptyState message="Aramanızla eşleşen ürün bulunamadı." />;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
