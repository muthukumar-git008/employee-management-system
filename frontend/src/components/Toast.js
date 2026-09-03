import React, { useEffect } from 'react';

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => onDismiss(), 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`} role="status">
      <span className="toast-dot" />
      <span>{toast.message}</span>
    </div>
  );
}
