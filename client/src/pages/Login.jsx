import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      const mensagem =
        error.response?.data?.error || "Erro ao fazer login";
      alert(mensagem);
      console.error(error);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card" style={{ maxWidth: "480px" }}>
          <h1 className="page-title">Login</h1>
          <p className="page-subtitle">Acesse sua conta para continuar</p>

          <form onSubmit={handleLogin} className="form-grid" style={{ marginTop: "24px" }}>
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
                Entrar
              </button>

              <Link to="/cadastro">
                <button type="button" className="btn-secondary">
                  Ir para cadastro
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;