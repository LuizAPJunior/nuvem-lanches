import { useEffect, useState } from "react";

// ─── Individual Toast ────────────────────────────────────────────────────────
function Toast({ id, message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on mount
    const enterTimer = requestAnimationFrame(() => setVisible(true));

    // Begin exit animation before removal
    const exitTimer = setTimeout(() => setVisible(false), 2700);

    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        ...styles.toast,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
      onClick={() => onDismiss(id)}
    >
      <span style={styles.icon}>🛒</span>
      <span style={styles.message}>{message}</span>
      <button
        type="button"
        style={styles.close}
        aria-label="Fechar notificação"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(id);
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Toast Container ─────────────────────────────────────────────────────────
export function CartToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div style={styles.container} aria-label="Notificações do carrinho">
      {toasts.map((t) => (
        <Toast key={t.id} id={t.id} message={t.message} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  container: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    pointerEvents: "none",
  },
  toast: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    background: "#1a202c",
    color: "#fff",
    borderRadius: 10,
    boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    fontSize: "0.875rem",
    fontWeight: 500,
    minWidth: 240,
    maxWidth: 340,
    cursor: "pointer",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    pointerEvents: "all",
  },
  icon: {
    fontSize: "1rem",
    flexShrink: 0,
  },
  message: {
    flex: 1,
    lineHeight: 1.4,
  },
  close: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.6)",
    cursor: "pointer",
    fontSize: "0.75rem",
    padding: 2,
    flexShrink: 0,
    lineHeight: 1,
  },
};