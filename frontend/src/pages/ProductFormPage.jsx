import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "../services/productApi";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

const EMPTY_FORM = { name: "", description: "", price: "", stock: "", category: "" };

export default function ProductFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;
    async function fetchProduct() {
      try {
        const product = await productApi.getProductById(id);
        if (!cancelled) {
          setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
          });
        }
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
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (isEditMode) {
        await productApi.updateProduct(id, payload);
      } else {
        await productApi.createProduct(payload);
      }
      navigate("/seller");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading label="Ürün yükleniyor..." />;

  return (
    <div className="page">
      <h1>{isEditMode ? "Ürünü Düzenle" : "Ürün Ekle"}</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}

        <label>
          Ad
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Açıklama
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>

        <label>
          Fiyat (₺)
          <input type="number" name="price" min={0} step="0.01" value={form.price} onChange={handleChange} required />
        </label>

        <label>
          Stok
          <input type="number" name="stock" min={0} step="1" value={form.stock} onChange={handleChange} required />
        </label>

        <label>
          Kategori
          <input type="text" name="category" value={form.category} onChange={handleChange} required />
        </label>

        <button type="submit" className="btn btn--primary" disabled={isSaving}>
          {isSaving ? "Kaydediliyor..." : "Ürünü Kaydet"}
        </button>
      </form>
    </div>
  );
}
