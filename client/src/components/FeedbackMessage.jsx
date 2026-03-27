function FeedbackMessage({ type = "info", message = "" }) {
  if (!message) return null;

  const styles = {
    info: {
      background: "rgba(59, 130, 246, 0.12)",
      border: "1px solid rgba(59, 130, 246, 0.35)",
      color: "#93c5fd",
    },
    success: {
      background: "rgba(34, 197, 94, 0.12)",
      border: "1px solid rgba(34, 197, 94, 0.35)",
      color: "#86efac",
    },
    error: {
      background: "rgba(239, 68, 68, 0.12)",
      border: "1px solid rgba(239, 68, 68, 0.35)",
      color: "#fca5a5",
    },
  };

  return (
    <div
      style={{
        ...styles[type],
        padding: "12px 14px",
        borderRadius: "12px",
        marginTop: "16px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      {message}
    </div>
  );
}

export default FeedbackMessage;