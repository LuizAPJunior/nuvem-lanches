import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { addItemCarrinho } from "../services/carrinhoService";
import PageHeader from "../components/PageHeader";
import CarrinhoButton from "../components/CarrinhoButton";
import { CartToastContainer } from "../components/CartToast";
import { useCartToast } from "../hooks/userCartToast";

function ItensPage() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Incrementing this tells CarrinhoButton to re-fetch the cart count
  const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);
  const { toasts, addToast, dismissToast } = useCartToast();

  useEffect(() => {
    const fetchItens = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/itens");
        setItens(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.error || err.message || "Erro ao buscar itens."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItens();
  }, []);

  const listaFinal = useMemo(() => {
    return [...itens];
  }, [itens]);

  const handleAddCarrinho = async (item) => {
    if (item.isDemo) {
      return;
    }

    try {
      await addItemCarrinho(item.id);
      // Signal CarrinhoButton to re-fetch the updated count
      setCartRefreshTrigger((prev) => prev + 1);
      addToast(`${item.nome} foi adicionado ao carrinho`);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card" style={{ maxWidth: "1100px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <PageHeader
              title="Itens"
              subtitle="Veja os produtos disponíveis no sistema"
              showBack={false}
            />
            {/* Cart button — always visible, top-right of the page header area */}
            <CarrinhoButton refreshTrigger={cartRefreshTrigger} />
          </div>

          {loading && <p className="status-text">Carregando itens...</p>}

          {error && (
            <div className="empty-state">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && listaFinal.length === 0 && (
            <div className="empty-state">
              <p>Nenhum item encontrado.</p>
            </div>
          )}

          {!loading && !error && listaFinal.length > 0 && (
            <div className="grid-cards">
              {listaFinal.map((item, index) => (
                <div className="info-card" key={item.id ?? index}>
                  {item.imagem_url ? (
                    <img
                      src={item.imagem_url}
                      alt={item.nome}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-fallback">
                      {item.nome ? item.nome.charAt(0).toUpperCase() : "I"}
                    </div>
                  )}

                  <div className="info-card-body">
                    {item.isDemo && <span className="badge-demo">Item ilustrativo</span>}

                    <h3>{item.nome || "Sem nome"}</h3>

                    <p className="info-row">
                      <strong>Preço:</strong>{" "}
                      R$ {item.preco ? Number(item.preco).toFixed(2) : "0,00"}
                    </p>

                    <p className="info-row">
                      <strong>Categoria:</strong>{" "}
                      {item.categoria || "Sem categoria"}
                    </p>

                    <p className="info-row">
                      <strong>Descrição:</strong>{" "}
                      {item.descricao || "Sem descrição"}
                    </p>

                    <p className="info-row">
                      <strong>Disponibilidade:</strong>{" "}
                      {item.disponibilidade ? "Disponível" : "Indisponível"}
                    </p>

                    <div className="actions-row">
                      <button
                        type="button"
                        className={item.isDemo ? "btn-secondary" : "btn-primary"}
                        onClick={() => handleAddCarrinho(item)}
                      >
                        {item.isDemo ? "Item ilustrativo" : "Adicionar ao carrinho"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
     <CartToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
    
  );
}

export default ItensPage;