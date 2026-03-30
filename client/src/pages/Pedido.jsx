import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPedido } from "../services/pedidoService";
import PageHeader from "../components/PageHeader";

const formatBRL = (valor) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_CONFIG = {
  pendente:    { label: "Pendente",          color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" },
  confirmado:  { label: "Confirmado",        color: "#1d4ed8", bg: "#dbeafe", dot: "#3b82f6" },
  em_preparo:  { label: "Em preparo",        color: "#6d28d9", bg: "#ede9fe", dot: "#8b5cf6" },
  saiu:        { label: "Saiu para entrega", color: "#0e7490", bg: "#cffafe", dot: "#06b6d4" },
  entregue:    { label: "Entregue",          color: "#15803d", bg: "#dcfce7", dot: "#22c55e" },
};

const PAYMENT_LABEL = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao_credito: "Cartão de crédito",
  cartao_debito: "Cartão de débito",
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 14px",
      borderRadius: 999,
      fontSize: "0.8rem",
      fontWeight: 700,
      letterSpacing: "0.03em",
      color: cfg.color,
      background: cfg.bg,
      border: `1.5px solid ${cfg.color}30`,
      textTransform: "uppercase",
    }}>
      <span style={{
        width: 7, height: 7,
        borderRadius: "50%",
        background: cfg.dot,
        display: "inline-block",
        boxShadow: `0 0 0 2px ${cfg.dot}40`,
      }} />
      {cfg.label}
    </span>
  );
}

function Pedido() {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        setErro("");
        const data = await getPedido(id);
        console.log("DATA PEDIDO:", data);
        setPedido(data ?? null);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar o pedido.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  // Normaliza os itens do pedido vindos da API
  const itens = pedido?.pedido_itens ?? pedido?.itens ?? pedido?.items ?? [];

  return (
    <div style={shell}>
      <div style={container}>
        <div style={card}>
          <PageHeader
            title="Meu Pedido"
            subtitle="Acompanhe o status do seu pedido"
            showBack={true}
          />

          {loading && (
            <p style={{ textAlign: "center", color: "#94a3b8", padding: "32px 0" }}>
              Carregando pedido...
            </p>
          )}

          {erro && (
            <div style={{ textAlign: "center", color: "#f87171", padding: "32px 0" }}>
              <p>{erro}</p>
            </div>
          )}

          {!loading && !erro && !pedido && (
            <div style={{ textAlign: "center", color: "#94a3b8", padding: "32px 0" }}>
              <p>Nenhum pedido ativo no momento.</p>
            </div>
          )}

          {!loading && !erro && pedido && (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

              {/* ── Cabeçalho ── */}
              <div style={sectionHeader}>
                <div>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                    Pedido
                  </p>
                  <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
                    #{pedido.id}
                  </p>
                  {pedido.created_at && (
                    <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: 4 }}>
                      {new Date(pedido.created_at).toLocaleString("pt-BR", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <StatusBadge status={pedido.status} />
              </div>

              {/* ── Lista de Itens ── */}
              <section style={sectionBlock}>
                <p style={sectionLabel}>Itens do pedido</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {itens.map((item, index) => {
                    const nome = item.item_nome || item?.itens?.nome || item?.item?.nome || "Sem nome";
                    const imagem = item?.itens?.imagem_url || item?.item?.imagem_url || item?.imagem_url || "";
                    const quantidade = item.quantidade ?? item.quantity ?? 1;
                    const precoUnit = item.preco_unidade ?? item.preco ?? item?.itens?.preco ?? item?.item?.preco ?? 0;
                    const subtotalItem = item.subtotal ?? precoUnit * quantidade;
                    const isLast = index === itens.length - 1;

                    return (
                      <div
                        key={item.id ?? index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          padding: "14px 0",
                          borderBottom: isLast ? "none" : "1px solid #334155",
                        }}
                      >
                        {/* Imagem ou inicial */}
                        {imagem ? (
                          <img
                            src={imagem}
                            alt={nome}
                            style={{
                              width: 52, height: 52,
                              borderRadius: 10,
                              objectFit: "cover",
                              flexShrink: 0,
                              border: "1px solid #334155",
                            }}
                          />
                        ) : (
                          <div style={{
                            width: 52, height: 52,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #f97316, #ea580c)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 800, fontSize: "1.2rem",
                            flexShrink: 0,
                          }}>
                            {nome.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Nome + Quantidade × Preço unit */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {nome}
                          </p>
                          <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {quantidade} × {formatBRL(precoUnit)}
                          </p>
                        </div>

                        {/* Subtotal do item */}
                        <p style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem", flexShrink: 0 }}>
                          {formatBRL(subtotalItem)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── Resumo financeiro ── */}
              <section style={{ ...sectionBlock, background: "#0f172a", borderRadius: 12, padding: "18px 20px", marginTop: 4 }}>
                <p style={sectionLabel}>Resumo</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Subtotal dos itens */}
                  <div style={rowStyle}>
                    <span style={rowLabel}>
                      Subtotal ({itens.length} {itens.length === 1 ? "item" : "itens"})
                    </span>
                    <span style={rowValue}>{formatBRL(pedido.total_itens ?? pedido.subtotal ?? 0)}</span>
                  </div>

                  {/* Taxa de entrega */}
                  <div style={rowStyle}>
                    <span style={rowLabel}>Taxa de entrega</span>
                    <span style={rowValue}>{formatBRL(pedido.taxa_entrega ?? 5)}</span>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1.5px dashed #334155", margin: "4px 0" }} />

                  {/* Total */}
                  <div style={rowStyle}>
                    <span style={{ ...rowLabel, fontWeight: 800, fontSize: "1.05rem", color: "#ffffff" }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#ea580c" }}>
                      {formatBRL(pedido.total)}
                    </span>
                  </div>
                </div>
              </section>

              {/* ── Pagamento ── */}
              <section style={{ ...sectionBlock, marginTop: 4 }}>
                <p style={sectionLabel}>Pagamento</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={rowStyle}>
                    <span style={rowLabel}>Método</span>
                    <span style={{ ...rowValue, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: 6,
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#93c5fd",
                        background: "#1e3a5f",
                        letterSpacing: "0.02em",
                      }}>
                        {PAYMENT_LABEL[pedido.metodo_pagamento] ?? pedido.metodo_pagamento}
                      </span>
                    </span>
                  </div>

                  {pedido.metodo_pagamento === "dinheiro" && pedido.quantia_dinheiro != null && (
                    <div style={rowStyle}>
                      <span style={rowLabel}>Troco para</span>
                      <span style={rowValue}>{formatBRL(pedido.quantia_dinheiro)}</span>
                    </div>
                  )}

                  {pedido.troco != null && pedido.troco > 0 && (
                    <div style={rowStyle}>
                      <span style={rowLabel}>Troco</span>
                      <span style={{ ...rowValue, color: "#4ade80", fontWeight: 700 }}>
                        {formatBRL(pedido.troco)}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* ── Observação ── */}
              {pedido.observacao && (
                <section style={{ ...sectionBlock, marginTop: 4 }}>
                  <p style={sectionLabel}>Observação</p>
                  <p style={{ fontSize: "0.9rem", color: "#cbd5e1", fontStyle: "italic", lineHeight: 1.6 }}>
                    "{pedido.observacao}"
                  </p>
                </section>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Styles ── */
const shell = {
  minHeight: "100vh",
  background: "#0f172a",
};

const container = {
  maxWidth: 600,
  margin: "0 auto",
  padding: "24px 16px",
};

const card = {
  background: "#1e293b",
  borderRadius: 16,
  boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
  overflow: "hidden",
  padding: "24px 24px",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  paddingBottom: 20,
  borderBottom: "1px solid #334155",
  marginBottom: 4,
};

const sectionBlock = {
  paddingTop: 18,
  paddingBottom: 18,
  borderBottom: "1px solid #334155",
};

const sectionLabel = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: 12,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const rowLabel = {
  fontSize: "0.9rem",
  color: "#94a3b8",
  fontWeight: 500,
};

const rowValue = {
  fontSize: "0.9rem",
  color: "#ffffff",
  fontWeight: 600,
};

export default Pedido;