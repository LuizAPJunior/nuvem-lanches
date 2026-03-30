import { useState, useCallback } from "react";

const TOAST_DURATION_MS = 3000;

/**
 * useCartToast
 *
 * Returns:
 *  - toasts       → array of { id, message } to render in <CartToastContainer>
 *  - addToast(msg) → call this whenever an item is added to the cart
 *  - dismissToast  → passed straight to <CartToastContainer onDismiss={...}>
 */
export function useCartToast() {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message }]);
      setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast]
  );

  return { toasts, addToast, dismissToast };
}