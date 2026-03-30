import axios from "axios";
import { supabase } from "../lib/supabaseClient";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/cadastrar') ||
      originalRequest.url.includes('/auth/');
 
    if (error.response?.status === 401 && !isAuthRequest) {
      await supabase.auth.signOut();
    }

    return Promise.reject(error);
  }
);

export default api;