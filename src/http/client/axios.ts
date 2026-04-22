import axios from "axios";
import { emitUnauthorizedEvent } from "../../features/auth/auth-events";
import { clearAuthToken, getAuthToken } from "../../features/auth/auth-storage";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  // Não enviar token em requisições de autenticação (login/register)
  const isAuthRoute = config.url?.includes("/auth/");

  if (isAuthRoute) {
    return config;
  }

  // Permite passar Authorization manualmente (ex.: bootstrap /me antes de persistir sessão)
  const existing = config.headers?.Authorization;
  if (typeof existing === "string" && existing.length > 0) {
    return config;
  }

  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthToken();
      emitUnauthorizedEvent();
    }

    return Promise.reject(error);
  },
);
