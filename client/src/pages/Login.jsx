import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, validateLoginInputs } from "../services/authService";
import FeedbackMessage from "../components/FeedbackMessage";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState({});   // per-field validation
  const [loading, setLoading]   = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    const validationErrors = validateLoginInputs(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      await login(email, password);
      setFeedback({ type: "success", message: "Login realizado com sucesso!" });
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card" style={{ maxWidth: "480px" }}>
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">Acesse sua conta para continuar</p>

          <form onSubmit={handleLogin} className="form-grid" style={{ marginTop: "24px" }}>
            <div className="field-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="field-group">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="actions-row">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <Link to="/cadastro">
                <button type="button" className="btn-secondary" disabled={loading}>
                  Ir para cadastro
                </button>
              </Link>
            </div>
          </form>

          <FeedbackMessage type={feedback.type} message={feedback.message} />
        </div>
      </div>
    </div>
  );
}

export default Login;