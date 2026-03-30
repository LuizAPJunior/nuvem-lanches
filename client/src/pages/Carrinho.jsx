import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCarrinho,
  updateQuantidade,
  deleteItemCarrinho,
  limparCarrinho,
} from "../services/carrinhoService";
import { criarPedido } from "../services/pedidoService";
import PageHeader from "../components/PageHeader";

const TAXA_ENTREGA = 5.0;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getNomeItem = (item) =>
  item?.nome || item?.item?.nome || item?.itens?.nome ||
  item?.produto?.nome || item?.item_nome || "Sem nome";

const getImagemItem = (item) =>
  item?.imagem_url || item?.item?.imagem_url || item?.itens?.imagem_url ||
  item?.produto?.imagem_url || item?.item_imagem_url || "";

const getQuantidadeItem = (item) =>
  item?.quantidade || item?.quantity || item?.qtd || 1;

const getPrecoItem = (item) =>
  item.itens['preco'];

const formatBRL = (valor) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─── CartItem com atualização otimista + debounce ─────────────────────────────
function CartItem({ item, onRemove, onQuantityChange }) {
  const [localQty, setLocalQty] = useState(getQuantidadeItem(item));
  const confirmedQtyRef = useRef(getQuantidadeItem(item)); // ← useRef instead of useState
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const debounceTimer = useRef(null);

  const scheduleSync = useCallback(
    (newQty) => {
      setSyncing(true);
      setSyncError(false);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        try {
          await updateQuantidade(item.id, newQty);
          confirmedQtyRef.current = newQty;
          onQuantityChange(item.id, newQty); // ← notify parent on success
          setSyncing(false);
        } catch (error) {
          setLocalQty(confirmedQtyRef.current);
          onQuantityChange(item.id, confirmedQtyRef.current); // ← revert parent too
          setSyncing(false);
          setSyncError(true);
          setTimeout(() => setSyncError(false), 3000);
        }
      }, 600);
    },
    [item.id, onQuantityChange]
  );

  const handleAdd = () => {
    const newQty = localQty + 1;
    setLocalQty(newQty);
    scheduleSync(newQty);
  };

  const handleSubtract = () => {
    if (localQty <= 1) return;
    const newQty = localQty - 1;
    setLocalQty(newQty);
    scheduleSync(newQty);
  };

  const nome = getNomeItem(item);
  const imagem = getImagemItem(item);
  const preco = getPrecoItem(item);

  return (
    <div className="info-card">
      {imagem ? (
        <img src={imagem} alt={nome} className="product-image" />
      ) : (
        <div className="product-image-fallback">
          {nome.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="info-card-body">
        <h3>{nome}</h3>

        <p className="info-row">
          <strong>Preço unitário:</strong> {formatBRL(preco)}
        </p>

        <p className="info-row">
          <strong>Subtotal:</strong>{" "}
          <span style={{ opacity: syncing ? 0.5 : 1, transition: "opacity 0.2s" }}>
            {formatBRL(preco * localQty)}
          </span>
          {syncing && (
            <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "#888" }}>
              salvando…
            </span>
          )}
          {syncError && (
            <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "#e53e3e" }}>
              erro — quantidade revertida
            </span>
          )}
        </p>

        <div className="actions-row" style={{ alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSubtract}
            disabled={localQty <= 1}
          >
            −
          </button>

          <span
            style={{
              minWidth: 28,
              textAlign: "center",
              fontWeight: 600,
              opacity: syncing ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {localQty}
          </span>

          <button type="button" className="btn-primary" onClick={handleAdd}>
            +
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ marginLeft: "auto" }}
            onClick={() => onRemove(item.id)}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página Carrinho ──────────────────────────────────────────────────────────
function Carrinho() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Campos do pedido
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [quantiaDinheiro, setQuantiaDinheiro] = useState("");
  const [observacao, setObservacao] = useState("");
  const [criandoPedido, setCriandoPedido] = useState(false);
  const [erroPedido, setErroPedido] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
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
    carregarCarrinho();
  }, []);

    const handleQuantityChange = useCallback((id, newQty) => {
  setItens((prev) =>
    prev.map((item) => item.id === id ? { ...item, quantidade: newQty } : item)
  );
}, []);

  const handleDelete = async (id) => {
    try {
      await deleteItemCarrinho(id);
      setItens((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLimpar = async () => {
    try {
      await limparCarrinho();
      setItens([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmarPedido = async () => {
    setErroPedido("");
    setCriandoPedido(true);
    try {
     const data = await criarPedido({
        taxa_entrega: TAXA_ENTREGA,
        metodo_pagamento: metodoPagamento,
        observacao: observacao || null,
        quantia_dinheiro:
          metodoPagamento === "dinheiro" ? Number(quantiaDinheiro) : null,
      });
      console.log("DATA: ", data);
      
      navigate(`/pedido/${data.pedido_id}`);
    } catch (error) {
      console.error(error);
      setErroPedido(
        error.response?.data?.error || "Erro ao criar pedido. Tente novamente."
      );
      setCriandoPedido(false);
    }
  };



  const subtotal = itens.reduce(
    (acc, item) => acc + getPrecoItem(item) * getQuantidadeItem(item),
    0
  );
  const total = subtotal + TAXA_ENTREGA;

  const podePedir =
    itens.length > 0 &&
    (metodoPagamento !== "dinheiro" || quantiaDinheiro !== "");

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="page-card" style={{ maxWidth: "1000px" }}>
          <PageHeader
            title="Carrinho"
            subtitle="Confira os itens e finalize seu pedido"
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
              <p>Seu carrinho está vazio.</p>
            </div>
          )}

          {!loading && !erro && itens.length > 0 && (
            <>
              {/* Itens */}
              <div className="grid-cards">
                {itens.map((item, index) => (
                  <CartItem
                    key={item.id ?? index}
                    item={item}
                    onRemove={handleDelete}
                    onQuantityChange={handleQuantityChange} 
                  />
                ))}
              </div>

              {/* Resumo de valores */}
              <div style={styles.summaryBox}>
                <div style={styles.row}>
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                <div style={styles.row}>
                  <span>Taxa de entrega</span>
                  <span>{formatBRL(TAXA_ENTREGA)}</span>
                </div>
                <div style={{ ...styles.row, ...styles.totalRow }}>
                  <span>Total</span>
                  <span>{formatBRL(total)}</span>
                </div>
              </div>

              {/* ── Formulário de pagamento ────────────────────────────── */}
              <div style={styles.formSection}>
                <p style={styles.formTitle}>Pagamento</p>

                <div style={styles.formGrid}>
                  {/* Método de pagamento */}
                  <label style={styles.label}>
                    Método de pagamento
                    <select
                      value={metodoPagamento}
                      onChange={(e) => {
                        setMetodoPagamento(e.target.value);
                        setQuantiaDinheiro("");
                      }}
                      disabled={criandoPedido}
                      style={styles.select}
                    >
                      <option value="pix">Pix</option>
                      <option value="dinheiro">Dinheiro</option>
                      <option value="cartao_credito">Cartão de crédito</option>
                    </select>
                  </label>

                  {/* Quantia — só aparece para dinheiro */}
                  {metodoPagamento === "dinheiro" && (
                    <label style={styles.label}>
                      Troco para quanto?
                      <input
                        type="number"
                        step="0.01"
                        min={total}
                        placeholder={`Mínimo ${formatBRL(total)}`}
                        value={quantiaDinheiro}
                        onChange={(e) => setQuantiaDinheiro(e.target.value)}
                        disabled={criandoPedido}
                      />
                    </label>
                  )}

                  {/* Observação */}
                  <label style={{ ...styles.label, gridColumn: "1 / -1" }}>
                    Observação (opcional)
                    <textarea
                      placeholder="Ex: sem cebola, tocar o interfone..."
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      rows={2}
                      disabled={criandoPedido}
                    />
                  </label>
                </div>
              </div>

              {/* Erro ao criar pedido */}
              {erroPedido && (
                <p style={{ color: "#e53e3e", fontSize: "0.85rem", marginTop: 8 }}>
                  {erroPedido}
                </p>
              )}

              {/* Ações */}
              <div className="actions-row" style={{ marginTop: 20, gap: 12 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleLimpar}
                  disabled={criandoPedido}
                >
                  Limpar carrinho
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleConfirmarPedido}
                  disabled={!podePedir || criandoPedido}
                >
                  {criandoPedido ? "Criando pedido…" : "Confirmar pedido →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  summaryBox: {
    marginTop: 24,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    color: "#ffffff",
  },
  totalRow: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: 10,
    marginTop: 4,
    fontWeight: 700,
    fontSize: "1.1rem",
    color: "#ffffff",
  },
  formSection: {
    marginTop: 24,
    borderTop: "1px solid #e2e8f0",
    paddingTop: 16,
  },
  formTitle: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#ffffff",
    marginBottom: 14,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#ffffff",
  },
  select: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #cbd5e0",
    fontSize: "0.9rem",
    color: "#2d3748",
    background: "#fff",
  },
};

export default Carrinho;