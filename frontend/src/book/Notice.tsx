interface NoticeProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

// A failure that needs action now. The only place the error colour appears.
export function Notice({ message, actionLabel, onAction }: NoticeProps) {
  return (
    <div className="notice" role="alert">
      <p>{message}</p>
      {actionLabel && (
        <button type="button" className="book-action book-action-quiet" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
