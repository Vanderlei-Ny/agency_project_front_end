import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { RootLayout } from "../layouts/root-layout";
import { AppLayout } from "../layouts/app-layout";
import { LoginPage } from "../pages/login-page";
import { SignupHubPage } from "../pages/signup-hub-page";
import { SignupClientPage } from "../pages/signup-client-page";
import { SignupAgencyPage } from "../pages/signup-agency-page";
import { CreateAgencyPage } from "../pages/create-agency-page";
import { AgenciesListPage } from "../pages/agencies-list-page";
import { ClientFormPage } from "../pages/client-form-page";
import { ClientSolicitationDetailPage } from "../pages/client-solicitation-detail-page";
import { ClientBudgetReviewPage } from "../pages/client-budget-review-page";
import { AgencyDashboardPage } from "../pages/agency-dashboard-page";
import { AgencyFormDetailPage } from "../pages/agency-form-detail-page";
import { ClientAgencySelector } from "../pages/client-agency-selector";
import { ClientHomePage } from "../pages/client-home-page";
import { PublicRootPage } from "../pages/public-root-page";
import { AgencySettingsPage } from "../pages/agency-settings-page";
import { AgencyAddMembersPage } from "../pages/agency-add-members-page";
import { SolicitacoesEntryPage } from "../pages/solicitacoes-entry-page";
import { AppIndexRedirect } from "../pages/app-index-redirect";
import { RouteGuard } from "../components/route-guard";
import { PrivateRoute } from "../components/private-route";

function appAreaRoutes(): RouteObject[] {
  return [
    { index: true, element: <AppIndexRedirect /> },
    {
      path: "inicio",
      element: (
        <RouteGuard allowedPersonas={["client"]}>
          <ClientHomePage />
        </RouteGuard>
      ),
    },
    {
      path: "dashboard",
      element: (
        <RouteGuard allowedPersonas={["agency_admin", "agency_auditor"]}>
          <AgencyDashboardPage />
        </RouteGuard>
      ),
    },
    { path: "sidebar-preview", element: <div className="min-h-dvh" /> },
    {
      path: "agencias",
      element: (
        <RouteGuard allowedPersonas={["client"]}>
          <ClientAgencySelector />
        </RouteGuard>
      ),
    },
    {
      path: "solicitacoes",
      element: (
        <RouteGuard
          allowedPersonas={["client", "agency_admin", "agency_auditor"]}
        >
          <SolicitacoesEntryPage />
        </RouteGuard>
      ),
    },
    {
      path: "configuracoes",
      element: (
        <RouteGuard allowedPersonas={["agency_admin", "agency_auditor"]}>
          <AgencySettingsPage />
        </RouteGuard>
      ),
    },
    {
      path: "funcionarios",
      element: (
        <RouteGuard allowedPersonas={["agency_admin", "agency_auditor"]}>
          <AgencyAddMembersPage />
        </RouteGuard>
      ),
    },
    {
      path: "nova-solicitacao",
      element: (
        <RouteGuard allowedPersonas={["client"]}>
          <ClientFormPage />
        </RouteGuard>
      ),
    },
    {
      path: "solicitacao/:formId/revisar",
      element: (
        <RouteGuard allowedPersonas={["client"]}>
          <ClientBudgetReviewPage />
        </RouteGuard>
      ),
    },
    {
      path: "solicitacao/:formId",
      element: (
        <RouteGuard allowedPersonas={["client"]}>
          <ClientSolicitationDetailPage />
        </RouteGuard>
      ),
    },
    {
      path: "solicitacoes/:formId",
      element: (
        <RouteGuard allowedPersonas={["agency_admin", "agency_auditor"]}>
          <AgencyFormDetailPage />
        </RouteGuard>
      ),
    },
  ];
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <PublicRootPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupHubPage /> },
      { path: "/signup/client", element: <SignupClientPage /> },
      { path: "/signup/agency", element: <SignupAgencyPage /> },
      {
        path: "/create-agency",
        element: (
          <PrivateRoute>
            <RouteGuard allowedPersonas={["agency_admin"]}>
              <CreateAgencyPage />
            </RouteGuard>
          </PrivateRoute>
        ),
      },
      {
        path: "/agencies-list",
        element: (
          <PrivateRoute>
            <RouteGuard allowedPersonas={["client"]}>
              <AgenciesListPage />
            </RouteGuard>
          </PrivateRoute>
        ),
      },
      {
        path: "/app",
        element: (
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        ),
        children: appAreaRoutes(),
      },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}