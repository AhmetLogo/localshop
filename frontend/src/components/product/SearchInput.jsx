export default function SearchInput({ value, onChange }) {
  return (
    <input
      type="search"
      className="search-input"
      placeholder="Ürün ara..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
