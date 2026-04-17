import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { RootLayout } from "../layouts/root-layout";
import { AppLayout } from "../layouts/app-layout";
import { LoginPage } from "../pages/login-page";
import { SignupPage } from "../pages/signup-page";
import { CreateAgencyPage } from "../pages/create-agency-page";
import { AgenciesListPage } from "../pages/agencies-list-page";
import { agencyRoutes, clientRoutes } from "./app-routes";
import { getUserType } from "../features/auth/auth-storage";

// Obter rotas baseado no tipo de usuário
function getAppRoutes(): RouteObject[] {
  const userType = getUserType();
  const routes = userType === "client" ? clientRoutes : agencyRoutes;

  return [
    { index: true, element: <Navigate to="home" replace /> },
    { path: "sidebar-preview", element: <div className="min-h-dvh" /> },
    ...routes.map((route) => ({
      path: route.path,
      element: route.element,
    })),
  ];
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/create-agency", element: <CreateAgencyPage /> },
      { path: "/agencies-list", element: <AgenciesListPage /> },
      {
        path: "/app",
        element: <AppLayout />,
        children: getAppRoutes(),
      },
      { path: "*", element: <Navigate to="/login" replace /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
