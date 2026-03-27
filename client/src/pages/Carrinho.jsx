import { useEffect, useState } from "react";
import {
  getCarrinho,
  updateQuantidade,
  deleteItemCarrinho,
  limparCarrinho,
} from "../services/carrinhoService";
import PageHeader from "../components/PageHeader";

function Carrinho() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      setErro("");
      const data = await getCarrinho();
      console.log("DADOS DO CARRINHO:", data);
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
      alert("Erro ao remover item.");
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

  const getNomeItem = (item) => {
    return (
      item?.nome ||
      item?.item?.nome ||
      item?.itens?.nome ||
      item?.produto?.nome ||
      item?.item_nome ||
      "Sem nome"
    );
  };

  const getImagemItem = (item) => {
    return (
      item?.imagem_url ||
      item?.item?.imagem_url ||
      item?.itens?.imagem_url ||
      item?.produto?.imagem_url ||
      item?.item_imagem_url ||
      ""
    );
  };

  const getQuantidadeItem = (item) => {
    return item?.quantidade || item?.quantity || item?.qtd || 1;
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card" style={{ maxWidth: "1000px" }}>
          <PageHeader
            title="Carrinho"
            subtitle="Confira os itens adicionados antes de finalizar o pedido"
            showBack={true}
          />

          {loading && <p className="status-text">Carregando carrinho...</p>}
          {erro && (
            <div className="empty-state">
              <p>{erro}</p>
            </div>
          )}

          {!loading && !erro && itens.length === 0 && (
            <div className="empty-state">
              <p>Carrinho vazio.</p>
            </div>
          )}

          {!loading && !erro && itens.length > 0 && (
            <>
              <div className="grid-cards">
                {itens.map((item, index) => {
                  const nome = getNomeItem(item);
                  const imagem = getImagemItem(item);
                  const quantidade = getQuantidadeItem(item);

                  return (
                    <div className="info-card" key={item.id ?? index}>
                      {imagem ? (
                        <img
                          src={imagem}
                          alt={nome}
                          className="product-image"
                        />
                      ) : (
                        <div className="product-image-fallback">
                          {nome.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="info-card-body">
                        <h3>{nome}</h3>

                        <p className="info-row">
                          <strong>Quantidade:</strong> {quantidade}
                        </p>

                        <div className="actions-row">
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleUpdate(item.id, "adicionar")}
                          >
                            +
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleUpdate(item.id, "subtrair")}
                          >
                            -
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleDelete(item.id)}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="actions-row" style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleLimpar}
                >
                  Limpar carrinho
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrinho;