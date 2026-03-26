import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../services/authService";

function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      await cadastrar(email, password);
      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao cadastrar.");
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
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="actions-row">
              <button type="submit" className="btn-primary">
                Cadastrar
              </button>

              <Link to="/">
                <button type="button" className="btn-secondary">
                  Voltar para login
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;