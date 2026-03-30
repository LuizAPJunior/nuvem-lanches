import { useState } from "react";
import { criarPedido } from "../services/pedidoService";
import PageHeader from "../components/PageHeader";
import FeedbackMessage from "../components/FeedbackMessage";

function NovoPedido() {
  const [taxaEntrega, setTaxaEntrega] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [observacao, setObservacao] = useState("");
  const [quantiaDinheiro, setQuantiaDinheiro] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    const payload = {
      taxa_entrega: Number(taxaEntrega),
      metodo_pagamento: metodoPagamento,
      observacao: observacao || null,
      quantia_dinheiro:
        metodoPagamento === "dinheiro" ? Number(quantiaDinheiro) : null,
    };

    try {
      await criarPedido(payload);
      setFeedback({ type: "success", message: "Pedido criado com sucesso!" });
      setTaxaEntrega("");
      setMetodoPagamento("pix");
      setObservacao("");
      setQuantiaDinheiro("");
    } catch (error) {
      console.error(error);
      const mensagem =
        error.response?.data?.error || "Erro ao criar pedido.";
      setFeedback({ type: "error", message: mensagem });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card">
          <PageHeader
            title="Finalizar Pedido"
            subtitle="Preencha os dados finais para concluir a compra"
            showBack={true}
          />

          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="number"
              step="0.01"
              placeholder="Taxa de entrega"
              value={taxaEntrega}
              onChange={(e) => setTaxaEntrega(e.target.value)}
              required
              disabled={loading}
            />

            <select
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              disabled={loading}
            >
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao_credito">Cartão</option>
            </select>

            <textarea
              placeholder="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows="4"
              disabled={loading}
            />

            {metodoPagamento === "dinheiro" && (
              <input
                type="number"
                step="0.01"
                placeholder="Quantia em dinheiro"
                value={quantiaDinheiro}
                onChange={(e) => setQuantiaDinheiro(e.target.value)}
                required
                disabled={loading}
              />
            )}

            <div className="actions-row">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Criando pedido..." : "Criar pedido"}
              </button>
            </div>
          </form>
          <FeedbackMessage type={feedback.type} message={feedback.message} />
        </div>
      </div>
    </div>
  );
}

export default NovoPedido;