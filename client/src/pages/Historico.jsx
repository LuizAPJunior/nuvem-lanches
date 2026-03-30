import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";

function Historico() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const buscarHistorico = async () => {
      try {
        setLoading(true);
        setErro("");
        const response = await api.get("/me/pedidos/historico");
        setPedidos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    };

    buscarHistorico();
  }, []);

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card">
          <PageHeader
            title="Histórico"
            subtitle="Veja os pedidos já realizados no sistema"
            showBack={true}
          />

          {loading && <p className="status-text">Carregando histórico...</p>}
          {erro && <div className="empty-state"><p>{erro}</p></div>}

          {!loading && !erro && pedidos.length === 0 && (
            <div className="empty-state">
              <p>Nenhum pedido encontrado.</p>
            </div>
          )}

          {!loading && !erro && pedidos.length > 0 && (
            <div className="list-stack">
              {pedidos.map((pedido, index) => (
                <div className="simple-card" key={pedido.id ?? index}>
                  <p className="info-row"><strong>ID:</strong> {pedido.id ?? "Sem ID"}</p>
                  <p className="info-row"><strong>Status:</strong> {pedido.status ?? "Sem status"}</p>
                  <p className="info-row"><strong>Método de pagamento:</strong> {pedido.metodo_pagamento ?? "Não informado"}</p>
                  <p className="info-row"><strong>Taxa de entrega:</strong> {pedido.taxa_entrega ?? "Não informada"}</p>
                  <p className="info-row"><strong>Observação:</strong> {pedido.observacao ?? "Sem observação"}</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/pedido/${pedido.id}`)}
                  >
                    Ver detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Historico;