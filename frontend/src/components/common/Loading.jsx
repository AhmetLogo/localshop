export default function Loading({ label = "Yükleniyor..." }) {
  return (
    <div className="state-message state-message--loading">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
