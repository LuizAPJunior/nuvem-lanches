import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Dashboard</h2>
      <p>Usuário logado</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
        <Link to="/itens">
          <button type="button">Ver itens</button>
        </Link>

        <Link to="/carrinho">
          <button type="button">Ver carrinho</button>
        </Link>

        <Link to="/novo-pedido">
          <button type="button">Finalizar pedido</button>
        </Link>

        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

export default Dashboard;