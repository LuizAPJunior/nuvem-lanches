import { useEffect, useState } from "react";
import api from "../api/axios";

function Historico() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

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
    <div style={{ padding: "24px" }}>
      <h2>Histórico de Pedidos</h2>

      {loading && <p>Carregando histórico...</p>}
      {erro && <p>{erro}</p>}

      {!loading && !erro && pedidos.length === 0 && (
        <p>Nenhum pedido encontrado.</p>
      )}

      {!loading &&
        !erro &&
        pedidos.length > 0 &&
        pedidos.map((pedido, index) => (
          <div
            key={pedido.id ?? index}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p><strong>ID:</strong> {pedido.id ?? "Sem ID"}</p>
            <p><strong>Status:</strong> {pedido.status ?? "Sem status"}</p>
            <p><strong>Método de pagamento:</strong> {pedido.metodo_pagamento ?? "Não informado"}</p>
            <p><strong>Taxa de entrega:</strong> {pedido.taxa_entrega ?? "Não informada"}</p>
            <p><strong>Observação:</strong> {pedido.observacao ?? "Sem observação"}</p>
          </div>
        ))}
    </div>
  );
}

export default Historico;