import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCarrinho } from "../services/carrinhoService";
import './CarrinhoButton.css'
/**
 * CarrinhoButton
 *
 * Props:
 *  - refreshTrigger (number) — increment this from the parent whenever an item
 *    is successfully added; the button will re-fetch the cart count.
 */
function CarrinhoButton({ refreshTrigger = 0 }) {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getCarrinho();
        const items = Array.isArray(data) ? data : [];
        // sum quantities so "3×X-Bacon" counts as 3, not 1
        const total = items.reduce(
          (acc, item) => acc + (item?.quantidade || item?.quantity || item?.qtd || 1),
          0
        );
        setCount(total);
      } catch (err) {
        console.error("CarrinhoButton: erro ao buscar carrinho", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [refreshTrigger]); // re-runs whenever parent signals a new item was added

  return (
    <button
      type="button"
      className="carrinho-btn"
      onClick={() => navigate("/carrinho")}
      aria-label={`Ver carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
    >
      <span className="carrinho-btn__icon">🛒</span>

      <span className="carrinho-btn__label">Ver carrinho</span>

      {!loading && count > 0 && (
        <span className="carrinho-btn__badge">{count}</span>
      )}
    </button>
  );
}

export default CarrinhoButton;