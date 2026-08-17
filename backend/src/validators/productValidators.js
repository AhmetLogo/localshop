function validateCreateProduct(req) {
  const errors = [];
  const { name, description, price, stock, category } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Ürün adı zorunludur");
  }
  if (!description || typeof description !== "string" || !description.trim()) {
    errors.push("Açıklama zorunludur");
  }
  if (price === undefined || price === null || Number.isNaN(Number(price)) || Number(price) < 0) {
    errors.push("Fiyat zorunludur ve 0'dan küçük olamaz");
  }
  if (stock === undefined || stock === null || Number.isNaN(Number(stock)) || Number(stock) < 0) {
    errors.push("Stok zorunludur ve 0'dan küçük olamaz");
  }
  if (!category || typeof category !== "string" || !category.trim()) {
    errors.push("Kategori zorunludur");
  }

  return errors;
}

function validateUpdateProduct(req) {
  const errors = [];
  const { price, stock } = req.body || {};

  if (price !== undefined && (Number.isNaN(Number(price)) || Number(price) < 0)) {
    errors.push("Fiyat 0'dan küçük olamaz");
  }
  if (stock !== undefined && (Number.isNaN(Number(stock)) || Number(stock) < 0)) {
    errors.push("Stok 0'dan küçük olamaz");
  }

  return errors;
}

module.exports = { validateCreateProduct, validateUpdateProduct };
