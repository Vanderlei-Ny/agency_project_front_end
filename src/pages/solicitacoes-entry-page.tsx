import { getAppPersona } from "../features/auth/auth-storage";
import { AgencyFormsListPage } from "./agency-forms-list-page";
import { ClientSolicitationsPage } from "./client-solicitations-page";

/** Mesma rota `/app/solicitacoes`: cliente vê as próprias; agência vê as recebidas. */
export function SolicitacoesEntryPage() {
  const persona = getAppPersona();
  if (persona === "client") {
    return <ClientSolicitationsPage />;
  }
  return <AgencyFormsListPage />;
}
