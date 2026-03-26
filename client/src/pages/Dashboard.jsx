import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card">
          <PageHeader
            title="Dashboard"
            subtitle={`Bem-vindo${user?.email ? `, ${user.email}` : ""}`}
            showBack={false}
          />

          <p className="status-text">
            Escolha uma das opções abaixo para navegar no sistema.
          </p>

          <div className="nav-grid">
            <Link to="/itens">
              <button type="button" className="btn-primary">
                Ver itens
              </button>
            </Link>

            <Link to="/carrinho">
              <button type="button" className="btn-secondary">
                Ver carrinho
              </button>
            </Link>

            <Link to="/novo-pedido">
              <button type="button" className="btn-secondary">
                Finalizar pedido
              </button>
            </Link>

            <Link to="/historico">
              <button type="button" className="btn-secondary">
                Histórico
              </button>
            </Link>

            <Link to="/perfil">
              <button type="button" className="btn-secondary">
                Perfil
              </button>
            </Link>

            <button type="button" className="btn-secondary" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;