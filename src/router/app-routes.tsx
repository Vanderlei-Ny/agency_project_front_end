import type { ReactElement } from "react";
import type { AppPersona } from "../features/auth/auth-storage";
import { ClientAgencySelector } from "../pages/client-agency-selector";
import { ClientHomePage } from "../pages/client-home-page";
import { ClientSolicitationsPage } from "../pages/client-solicitations-page";
import { AgencyDashboardPage } from "../pages/agency-dashboard-page";
import { AgencyFormsListPage } from "../pages/agency-forms-list-page";
import { AgencySettingsPage } from "../pages/agency-settings-page";
import { AgencyAddMembersPage } from "../pages/agency-add-members-page";

export type SidebarIconKey =
  | "compass"
  | "grid"
  | "spark"
  | "chat"
  | "chart"
  | "users"
  | "wallet";

export type SidebarSection = "principal" | "operacional" | "administrativo";

export type AppRouteItem = {
  path: string;
  label: string;
  icon: SidebarIconKey;
  element: ReactElement;
  section?: SidebarSection;
};

// ========================
// ROTAS PARA AGÊNCIAS (admin): apenas telas implementadas
// ========================
export const agencyRoutes: AppRouteItem[] = [
  {
    path: "dashboard",
    label: "Painel",
    icon: "chart",
    element: <AgencyDashboardPage />,
    section: "principal",
  },
  {
    path: "solicitacoes",
    label: "Solicitações",
    icon: "chat",
    element: <AgencyFormsListPage />,
    section: "principal",
  },
  {
    path: "configuracoes",
    label: "Configurações",
    icon: "grid",
    element: <AgencySettingsPage />,
    section: "principal",
  },
  {
    path: "funcionarios",
    label: "Funcionários",
    icon: "users",
    element: <AgencyAddMembersPage />,
    section: "administrativo",
  },
];

// ========================
// ROTAS AUDITOR (AGENCY_MEMBER): só solicitações recebidas + detalhe/resposta
// ========================
export const agencyAuditorRoutes: AppRouteItem[] = [
  {
    path: "solicitacoes",
    label: "Solicitações recebidas",
    icon: "chat",
    element: <AgencyFormsListPage />,
    section: "principal",
  },
];

// ========================
// ROTAS PARA CLIENTES
// ========================
export const clientRoutes: AppRouteItem[] = [
  {
    path: "inicio",
    label: "Início",
    icon: "compass",
    element: <ClientHomePage />,
    section: "principal",
  },
  {
    path: "agencias",
    label: "Escolher agência",
    icon: "grid",
    element: <ClientAgencySelector />,
    section: "principal",
  },
  {
    path: "solicitacoes",
    label: "Minhas solicitações",
    icon: "chat",
    element: <ClientSolicitationsPage />,
    section: "principal",
  },
];

// ========================
// ORGANIZAR ROTAS POR SEÇÃO
// ========================
export function getRoutesBySection(
  routes: AppRouteItem[],
  section: SidebarSection,
): AppRouteItem[] {
  return routes.filter((route) => route.section === section);
}

export function getRoutesForPersona(persona: AppPersona): AppRouteItem[] {
  switch (persona) {
    case "client":
      return clientRoutes;
    case "agency_auditor":
      return agencyAuditorRoutes;
    case "agency_admin":
      return agencyRoutes;
  }
}

// Para compatibilidade com código existente
export const appRouteItems: AppRouteItem[] = agencyRoutes;
