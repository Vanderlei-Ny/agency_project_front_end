import { getAppPersona } from "./auth-storage";

/** Chame após `saveAuthSession` para decidir a primeira rota. */
export function getNavigatePathAfterAuth(): string {
  const persona = getAppPersona();
  if (persona === "client") {
    return "/app/inicio";
  }
  if (persona === "agency_auditor" || persona === "agency_admin") {
    return "/app/solicitacoes";
  }
  return "/login";
}
