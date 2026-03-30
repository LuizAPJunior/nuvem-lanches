import api from "../api/axios";

export const getCarrinho = async () => {
  const response = await api.get("/carrinho");
  return response.data;
};

export const addItemCarrinho = async (itemId) => {
  const response = await api.post("/carrinho", {
    itemId,
  });
  return response.data;
};

export const updateQuantidade = async (id, quantidade) => {
  const response = await api.patch(`/carrinho/${id}`, {
    quantidade,
  });
  return response.data;
};

export const deleteItemCarrinho = async (id) => {
  await api.delete(`/carrinho/${id}`);
};

export const limparCarrinho = async () => {
  await api.delete("/carrinho");
};