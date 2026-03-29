import api from "../api/axios";


import { supabase } from "../lib/supabaseClient";

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateLoginInputs(email, password) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email é obrigatório.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Formato de email inválido.";
  }

  if (!password) {
    errors.password = "Senha é obrigatória.";
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors; // empty object = valid
}


export const login = async (email, password) => {
  const response = await api.post("auth/login", {
    email,
    password,
  });

  const { access_token, refresh_token } = response.data;  
  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw new Error(error.message);

  return response.data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  const response = await api.post("auth/logout");
  console.log(response.data);
  return response.data;
};


export const cadastrar = async (email, password) => {
  const response = await api.post("auth/cadastrar", {
    email,
    password,
  });

  return response.data;
};

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}