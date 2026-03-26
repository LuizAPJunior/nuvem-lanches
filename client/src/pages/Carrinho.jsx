import { useEffect, useState } from "react";
import {
  getCarrinho,
  updateQuantidade,
  deleteItemCarrinho,
  limparCarrinho,
} from "../services/carrinhoService";

function Carrinho() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      setErro("");
      const data = await getCarrinho();
      setItens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar o carrinho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCarrinho();
  }, []);

  const handleUpdate = async (id, action) => {
    try {
      await updateQuantidade(id, action);
      await carregarCarrinho();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar quantidade.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemCarrinho(id);
      await carregarCarrinho();
    } catch (error) {
      console.error(error);
      alert("Erro ao remover item do carrinho.");
    }
  };

  const handleLimpar = async () => {
    try {
      await limparCarrinho();
      await carregarCarrinho();
    } catch (error) {
      console.error(error);
      alert("Erro ao limpar carrinho.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2>Carrinho</h2>

      {loading && <p>Carregando carrinho...</p>}
      {erro && <p>{erro}</p>}

      {!loading && !erro && itens.length === 0 && <p>Carrinho vazio.</p>}

      {!loading &&
        !erro &&
        itens.length > 0 &&
        itens.map((item, index) => (
          <div
            key={item.id ?? index}
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p>
              <strong>Item:</strong> {item.nome || item.item?.nome || "Sem nome"}
            </p>

            <p>
              <strong>Quantidade:</strong>{" "}
              {item.quantidade || item.quantity || 1}
            </p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleUpdate(item.id, "adicionar")}
              >
                +
              </button>

              <button
                type="button"
                onClick={() => handleUpdate(item.id, "subtrair")}
              >
                -
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}

      {!loading && !erro && itens.length > 0 && (
        <button type="button" onClick={handleLimpar}>
          Limpar carrinho
        </button>
      )}
    </div>
  );
}

export default Carrinho;