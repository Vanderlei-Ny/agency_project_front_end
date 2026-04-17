import type { ReactElement } from "react";
import { HomePage } from "../pages/home-page";
import { WorkspacePage } from "../pages/workspace-page";
import { ClientAgencySelector } from "../pages/client-agency-selector";

export type SidebarIconKey =
  | "compass"
  | "grid"
  | "spark"
  | "chat"
  | "chart"
  | "users"
  | "wallet";

export type AppRouteItem = {
  path: string;
  label: string;
  icon: SidebarIconKey;
  element: ReactElement;
};

// Rotas para agências
export const agencyRoutes: AppRouteItem[] = [
  {
    path: "home",
    label: "Home",
    icon: "compass",
    element: <HomePage />,
  },
  {
    path: "dashboard",
    label: "Dashboard",
    icon: "compass",
    element: (
      <WorkspacePage
        title="Dashboard"
        description="Visão geral da operação com métricas principais da agência."
      />
    ),
  },
  {
    path: "projetos",
    label: "Projetos",
    icon: "grid",
    element: (
      <WorkspacePage
        title="Projetos"
        description="Organize entregas, squads e prazos dos seus clientes em um único lugar."
      />
    ),
  },
  {
    path: "automacoes",
    label: "Automações",
    icon: "spark",
    element: (
      <WorkspacePage
        title="Automações"
        description="Configure fluxos automáticos para marketing, atendimento e operação."
      />
    ),
  },
  {
    path: "suporte",
    label: "Suporte",
    icon: "chat",
    element: (
      <WorkspacePage
        title="Suporte"
        description="Acompanhe solicitações e centralize o suporte premium da agência."
      />
    ),
  },
  {
    path: "analytics",
    label: "Analytics",
    icon: "chart",
    element: (
      <WorkspacePage
        title="Analytics"
        description="Monitore performance de campanhas com indicadores de crescimento."
      />
    ),
  },
  {
    path: "equipe",
    label: "Equipe",
    icon: "users",
    element: (
      <WorkspacePage
        title="Equipe"
        description="Gerencie permissões, membros e funções por núcleo operacional."
      />
    ),
  },
  {
    path: "financeiro",
    label: "Financeiro",
    icon: "wallet",
    element: (
      <WorkspacePage
        title="Financeiro"
        description="Controle contratos, recebimentos e indicadores financeiros da operação."
      />
    ),
  },
];

// Rotas para clientes
export const clientRoutes: AppRouteItem[] = [
  {
    path: "home",
    label: "Home",
    icon: "compass",
    element: <HomePage />,
  },
  {
    path: "agencias",
    label: "Escolha uma Agência",
    icon: "grid",
    element: <ClientAgencySelector />,
  },
];

// Para compatibilidade com código existente
export const appRouteItems: AppRouteItem[] = agencyRoutes;
