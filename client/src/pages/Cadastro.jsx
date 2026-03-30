import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../services/authService";
import FeedbackMessage from "../components/FeedbackMessage";

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!nome.trim()) {
      errors.nome = "Nome é obrigatório.";
    }

    if (!email.trim()) {
      errors.email = "Email é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Formato de email inválido.";
    }

    if (!password) {
      errors.password = "Senha é obrigatória.";
    } else if (password.length < 8) {
      errors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    if (!endereco.trim()) {
      errors.endereco = "Endereço é obrigatório.";
    }

    if (!telefone.trim()) {
      errors.telefone = "Telefone é obrigatório.";
    } else if (!/^\d{11}$/.test(telefone)) {
      errors.telefone = "Telefone inválido. Use o formato: 85987123456 (11 dígitos, sem espaços ou caracteres especiais).";
    }

    return errors;
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await cadastrar(email, password, nome, endereco, telefone);
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

            <div>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.nome && <span className="field-error">{fieldErrors.nome}</span>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                disabled={loading}
              />
              {fieldErrors.endereco && <span className="field-error">{fieldErrors.endereco}</span>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Telefone (ex: 85987123456)"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value.replace(/\D/g, ""))}
                maxLength={11}
                disabled={loading}
              />
              {fieldErrors.telefone && <span className="field-error">{fieldErrors.telefone}</span>}
            </div>

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