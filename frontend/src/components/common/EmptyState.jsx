export default function EmptyState({ message = "Henüz gösterilecek bir şey yok." }) {
  return <div className="state-message state-message--empty">{message}</div>;
}
