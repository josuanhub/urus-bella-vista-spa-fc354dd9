import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Hook ───────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

// ─── Config por tipo ─────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle,
    bar: "bg-[#00D4AA]",
    iconClass: "text-[#00D4AA]",
    border: "border-[#00D4AA]/30",
    bg: "bg-[#00D4AA]/10",
    label: "Éxito",
  },
  error: {
    icon: XCircle,
    bar: "bg-red-500",
    iconClass: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10",
    label: "Error",
  },
  warning: {
    icon: AlertCircle,
    bar: "bg-amber-400",
    iconClass: "text-amber-400",
    border: "border-amber-400/30",
    bg: "bg-amber-400/10",
    label: "Aviso",
  },
  info: {
    icon: Info,
    bar: "bg-[#6C63FF]",
    iconClass: "text-[#6C63FF]",
    border: "border-[#6C63FF]/30",
    bg: "bg-[#6C63FF]/10",
    label: "Info",
  },
};

const AUTO_DISMISS = 4000;
const MAX_TOASTS = 3;

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingRef = useRef(AUTO_DISMISS);

  const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
  const Icon = cfg.icon;

  const startDismiss = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 350);
    }, remainingRef.current);

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.max(
        0,
        ((remainingRef.current - elapsed) / AUTO_DISMISS) * 100
      );
      setProgress(pct);
    }, 30);
  }, [toast.id, onRemove]);

  const pauseDismiss = () => {
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
    remainingRef.current -= Date.now() - startTimeRef.current;
  };

  const resumeDismiss = useCallback(() => {
    startTimeRef.current = Date.now();
    startDismiss();
  }, [startDismiss]);

  useEffect(() => {
    // Entrada
    const raf = requestAnimationFrame(() => setVisible(true));
    startDismiss();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [startDismiss]);

  const handleClose = () => {
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 350);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={pauseDismiss}
      onMouseLeave={resumeDismiss}
      className={[
        "relative w-full max-w-sm overflow-hidden rounded-xl border",
        "shadow-2xl shadow-black/50 backdrop-blur-sm cursor-default select-none",
        cfg.border,
        cfg.bg,
        "transition-all duration-350 ease-out",
        visible && !leaving
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-8 scale-95",
      ].join(" ")}
      style={{ transition: "opacity 350ms, transform 350ms, scale 350ms" }}
    >
      {/* Progress bar */}
      <div
        className={`absolute top-0 left-0 h-[2px] ${cfg.bar} transition-all`}
        style={{ width: `${progress}%`, transition: "width 30ms linear" }}
      />

      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <div className={`mt-0.5 shrink-0 ${cfg.iconClass}`}>
          <Icon size={20} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-white leading-tight mb-0.5">
              {toast.title}
            </p>
          )}
          {toast.message && (
            <p className="text-xs text-white/70 leading-snug break-words">
              {toast.message}
            </p>
          )}
          {!toast.title && !toast.message && (
            <p className="text-sm font-medium text-white">{cfg.label}</p>
          )}
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Cerrar notificación"
          className="shrink-0 mt-0.5 text-white/40 hover:text-white/80 transition-colors rounded-md p-0.5
                     focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    ({ type = "info", title = "", message = "" } = {}) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const next = [...prev, { id, type, title, message }];
        // Mantener máximo MAX_TOASTS — eliminar los más viejos
        return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
      });
      return id;
    },
    []
  );

  // Helpers de conveniencia
  const success = useCallback(
    (title, message) => add({ type: "success", title, message }),
    [add]
  );
  const error = useCallback(
    (title, message) => add({ type: "error", title, message }),
    [add]
  );
  const warning = useCallback(
    (title, message) => add({ type: "warning", title, message }),
    [add]
  );
  const info = useCallback(
    (title, message) => add({ type: "info", title, message }),
    [add]
  );

  return (
    <ToastContext.Provider value={{ add, remove, success, error, warning, info }}>
      {children}

      {/* Portal-like container */}
      <div
        aria-label="Notificaciones"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-3 w-[calc(100vw-2rem)] sm:w-80 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;