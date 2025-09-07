import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const add = useCallback(
    (msg, { type = "success", duration = 1800 } = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, msg, type }]);
      if (duration > 0) {
        setTimeout(() => remove(id), duration);
      }
    },
    [remove]
  );

  const value = useMemo(
    () => ({ addToast: add, removeToast: remove }),
    [add, remove]
  );

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-wrap">
          {toasts.map(({ id, msg, type }) => (
            <div key={id} className={`toast-item ${type}`}>
              <span>{msg}</span>
              <button
                className="toast-close"
                onClick={() => remove(id)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
