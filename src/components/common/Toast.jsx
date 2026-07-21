import React, { useEffect, memo } from 'react';

export const Toast = memo(function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return <div className="cc-toast">{message}</div>;
});

export const ToastContainer = memo(function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="cc-toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
});
