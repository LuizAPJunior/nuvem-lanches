import { useState } from "react";
import { criarPedido } from "../services/pedidoService";
import PageHeader from "../components/PageHeader";

function NovoPedido() {
  const [taxaEntrega, setTaxaEntrega] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [observacao, setObservacao] = useState("");
  const [quantiaDinheiro, setQuantiaDinheiro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      taxa_entrega: Number(taxaEntrega),
      metodo_pagamento: metodoPagamento,
      observacao: observacao || null,
      quantia_dinheiro:
        metodoPagamento === "dinheiro" ? Number(quantiaDinheiro) : null,
    };

    try {
      await criarPedido(payload);
      alert("Pedido criado com sucesso!");
      setTaxaEntrega("");
      setMetodoPagamento("pix");
      setObservacao("");
      setQuantiaDinheiro("");
    } catch (error) {
      console.error(error);
      const mensagem =
        error.response?.data?.error || "Erro ao criar pedido.";
      alert(mensagem);
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
            />

            <select
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
            >
              <option value="pix">Pix</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao_credito">Cartão de crédito</option>
              <option value="cartao_debito">Cartão de débito</option>
            </select>

            <textarea
              placeholder="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows="4"
            />

            {metodoPagamento === "dinheiro" && (
              <input
                type="number"
                step="0.01"
                placeholder="Quantia em dinheiro"
                value={quantiaDinheiro}
                onChange={(e) => setQuantiaDinheiro(e.target.value)}
                required
              />
            )}

            <div className="actions-row">
              <button type="submit" className="btn-primary">
                Criar pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovoPedido;