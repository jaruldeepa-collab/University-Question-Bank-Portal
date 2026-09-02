import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = "info", duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (msg, duration) =>
        addToast({ message: msg, type: "success", duration }),
      error: (msg, duration) =>
        addToast({ message: msg, type: "error", duration }),
      info: (msg, duration) =>
        addToast({ message: msg, type: "info", duration }),
      warning: (msg, duration) =>
        addToast({ message: msg, type: "warning", duration }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-in ${
              t.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-800"
                : t.type === "error"
                ? "bg-red-950/90 text-red-100 border-red-800"
                : t.type === "warning"
                ? "bg-amber-950/90 text-amber-100 border-amber-800"
                : "bg-slate-900/90 text-slate-100 border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {t.type === "success"
                  ? "✅"
                  : t.type === "error"
                  ? "⚠️"
                  : t.type === "warning"
                  ? "⚡️"
                  : "ℹ️"}
              </span>
              <p className="text-xs font-semibold leading-relaxed">
                {t.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook helper
import { useMemo } from "react";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
