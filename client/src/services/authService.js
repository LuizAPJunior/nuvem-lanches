import api from "../api/axios";

export const login = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password,
  });

  return response.data;
};

export const cadastrar = async (email, password) => {
  const response = await api.post("/cadastrar", {
    email,
    password,
  });

  return response.data;
};