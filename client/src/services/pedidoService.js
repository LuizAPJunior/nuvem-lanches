import api from "../api/axios";
 
export const criarPedido = async (payload) => {
  const response = await api.post("/pedidos", payload);
  return response.data;
};
 

export const getPedido = async (pedido_id) => {
  const response = await api.get(`/pedidos/${pedido_id}`);
  console.log(response.data);
  
  return response.data;
};