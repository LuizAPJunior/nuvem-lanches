import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../services/authService";
import FeedbackMessage from "../components/FeedbackMessage";

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      await cadastrar(email, password);
      setFeedback({ type: "success", message: "Cadastro realizado com sucesso!" });

      setTimeout(() => {
        navigate("/");
      }, 700);
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: error.response?.data?.error || "Erro ao cadastrar.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card" style={{ maxWidth: "480px" }}>
          <h1 className="page-title">Cadastro</h1>
          <p className="page-subtitle">Crie sua conta para acessar o sistema</p>

          <form onSubmit={handleCadastro} className="form-grid" style={{ marginTop: "24px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <div className="actions-row">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>

              <Link to="/">
                <button type="button" className="btn-secondary" disabled={loading}>
                  Voltar para login
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

export default Cadastro;