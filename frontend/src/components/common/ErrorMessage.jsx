export default function ErrorMessage({ message = "Bir şeyler ters gitti.", onRetry }) {
  return (
    <div className="state-message state-message--error">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Tekrar Dene
        </button>
      )}
    </div>
  );
}
