const CATEGORIES = ["", "gıda", "giyim", "ev", "kozmetik", "diğer"];

const LABELS = {
  gıda: "Gıda",
  giyim: "Giyim",
  ev: "Ev",
  kozmetik: "Kozmetik",
  diğer: "Diğer",
};

export default function CategoryFilter({ value, onChange }) {
  return (
    <select className="category-filter" value={value} onChange={(e) => onChange(e.target.value)}>
      {CATEGORIES.map((category) => (
        <option key={category || "all"} value={category}>
          {category ? LABELS[category] : "Tüm kategoriler"}
        </option>
      ))}
    </select>
  );
}
