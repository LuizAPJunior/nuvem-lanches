import api from "../api/axios";
import { supabase } from "../lib/supabaseClient";

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const TELEFONE_REGEX = /^\d{11}$/;

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

export function validateCadastroInputs(email, password, nome, endereco, telefone) {
  const errors = {};

  if (!nome.trim()) {
    errors.nome = "Nome é obrigatório.";
  }

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

  if (!endereco.trim()) {
    errors.endereco = "Endereço é obrigatório.";
  }

  if (!telefone.trim()) {
    errors.telefone = "Telefone é obrigatório.";
  } else if (!TELEFONE_REGEX.test(telefone)) {
    errors.telefone = "Telefone inválido. Use o formato: 85987123456 (11 dígitos, sem espaços ou caracteres especiais).";
  }

  return errors; // empty object = valid
}

// ─── Auth functions ───────────────────────────────────────────────────────────

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

export const cadastrar = async (email, password, nome, endereco, telefone) => {
  const response = await api.post("auth/cadastrar", {
    email,
    password,
    nome,
    endereco,
    telefone,
  });

  return response.data;
};

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}