import axios from "axios";

type ApiErrorBody = {
  message?: string;
};

/** Extrai mensagem legível de falhas do backend (axios) ou de Error genérico. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }
    if (error.response?.status === 401) {
      return "E-mail ou senha incorretos.";
    }
    if (error.response?.status === 409) {
      return data?.message ?? "Este e-mail já está cadastrado.";
    }
    if (error.code === "ERR_NETWORK") {
      return "Não foi possível conectar ao servidor. Verifique se a API está rodando e a URL em VITE_API_URL.";
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
