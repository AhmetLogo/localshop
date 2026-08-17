import { useEffect, useState } from "react";
import productApi from "../services/productApi";
import ProductList from "../components/product/ProductList";
import SearchInput from "../components/product/SearchInput";
import CategoryFilter from "../components/product/CategoryFilter";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await productApi.getProducts({ search: debouncedSearch, category });
        if (!cancelled) {
          setProducts(result.products);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category]);

  return (
    <div className="page">
      <h1>Ürünler</h1>

      <div className="product-filters">
        <SearchInput value={search} onChange={setSearch} />
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      {isLoading && <Loading label="Ürünler yükleniyor..." />}
      {!isLoading && error && <ErrorMessage message={error} />}
      {!isLoading && !error && <ProductList products={products} />}
    </div>
  );
}
