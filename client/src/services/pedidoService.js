import api from "../api/axios";

export const criarPedido = async (payload) => {
  const response = await api.post("/pedidos", payload);
  return response.data;
};