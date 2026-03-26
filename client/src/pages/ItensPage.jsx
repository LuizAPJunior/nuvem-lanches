import { useEffect, useState } from "react";
import api from "../api/axios";
import { addItemCarrinho } from "../services/carrinhoService";
import "./ItensPage.css";

export default function ItensPage() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItens = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/itens");
        setItens(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message || "Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    };

    fetchItens();
  }, []);

  const handleAddCarrinho = async (itemId) => {
    try {
      await addItemCarrinho(itemId);
      alert("Item adicionado ao carrinho!");
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar item ao carrinho.");
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-inner">
          <span className="header-tag">Cardápio</span>
          <h1 className="header-title">Itens</h1>
          <p className="header-sub">dados vindos da API /itens</p>
        </div>
        <div className="header-line" />
      </header>

      <main className="main">
        {loading && (
          <div className="state-box loading-box">
            <div className="spinner" />
            <p>Carregando itens...</p>
          </div>
        )}

        {error && (
          <div className="state-box error-box">
            <span className="error-icon">✕</span>
            <p className="error-title">Erro na requisição</p>
            <p className="error-msg">{error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && itens.length === 0 && (
          <div className="state-box empty-box">
            <span className="empty-icon">∅</span>
            <p>Nenhum item encontrado.</p>
          </div>
        )}

        {!loading && !error && itens.length > 0 && (
          <>
            <p className="result-count">{itens.length} item(ns) retornado(s)</p>
            <ul className="grid">
              {itens.map((item, idx) => (
                <li key={item.id ?? idx} className="card">
                  <div className="card-index">#{idx + 1}</div>

                  <div className="card-body">
                    <div className="card-row">
                      <span className="card-key">Nome</span>
                      <span className="card-val">{item.nome || "Sem nome"}</span>
                    </div>

                    <div className="card-row">
                      <span className="card-key">Preço</span>
                      <span className="card-val">
                        R$ {item.preco ? Number(item.preco).toFixed(2) : "0,00"}
                      </span>
                    </div>

                    <div className="card-row">
                      <span className="card-key">Categoria</span>
                      <span className="card-val">{item.categoria || "Sem categoria"}</span>
                    </div>

                    <div className="card-row">
                      <span className="card-key">Descrição</span>
                      <span className="card-val">{item.descricao || "Sem descrição"}</span>
                    </div>

                    <div className="card-row">
                      <span className="card-key">Disponível</span>
                      <span className="card-val">
                        {item.disponibilidade ? "Sim" : "Não"}
                      </span>
                    </div>

                    <div className="card-row">
                      <span className="card-key">Imagem</span>
                      <span className="card-val">
                        {item.imagem_url ? "Disponível" : "Sem imagem"}
                      </span>
                    </div>

                    <div style={{ marginTop: "12px" }}>
                      <button
                        className="retry-btn"
                        type="button"
                        onClick={() => handleAddCarrinho(item.id)}
                      >
                        Adicionar ao carrinho
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}