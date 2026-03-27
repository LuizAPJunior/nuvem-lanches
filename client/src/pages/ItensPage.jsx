import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { addItemCarrinho } from "../services/carrinhoService";
import PageHeader from "../components/PageHeader";

function ItensPage() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itensExtras = [
    {
      id: "demo-feijoada",
      nome: "Feijoada Completa",
      preco: 32.9,
      categoria: "Comida brasileira",
      descricao: "Prato ilustrativo com arroz, farofa e couve.",
      disponibilidade: true,
      imagem_url: "https://placehold.co/600x400/13151a/b5f542?text=Feijoada",
      isDemo: true,
    },
    {
      id: "demo-moqueca",
      nome: "Moqueca Baiana",
      preco: 36.5,
      categoria: "Comida brasileira",
      descricao: "Prato ilustrativo com peixe, arroz e pirão.",
      disponibilidade: true,
      imagem_url: "https://placehold.co/600x400/13151a/b5f542?text=Moqueca",
      isDemo: true,
    },
    {
      id: "demo-baiao",
      nome: "Baião de Dois",
      preco: 27.9,
      categoria: "Comida brasileira",
      descricao: "Prato ilustrativo típico nordestino com queijo coalho.",
      disponibilidade: true,
      imagem_url: "https://placehold.co/600x400/13151a/b5f542?text=Baiao+de+Dois",
      isDemo: true,
    },
  ];

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
    return [...itens, ...itensExtras];
  }, [itens]);

  const handleAddCarrinho = async (item) => {
    if (item.isDemo) {
      alert("Esse item é ilustrativo no front e ainda não existe no banco.");
      return;
    }

    try {
      await addItemCarrinho(item.id);
      alert("Item adicionado ao carrinho!");
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar item ao carrinho.");
    }
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card" style={{ maxWidth: "1100px" }}>
          <PageHeader
            title="Itens"
            subtitle="Veja os produtos disponíveis no sistema"
            showBack={true}
          />

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
    </div>
  );
}

export default ItensPage;