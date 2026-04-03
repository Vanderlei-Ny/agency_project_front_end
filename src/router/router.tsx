import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { AppLayout } from "../layouts/app-layout";
import { LoginPage } from "../pages/login-page";
import { appRouteItems } from "./app-routes";

const appChildren: RouteObject[] = [
  { index: true, element: <Navigate to="dashboard" replace /> },
  { path: "sidebar-preview", element: <div className="min-h-dvh" /> },
  ...appRouteItems.map((route) => ({
    path: route.path,
    element: route.element,
  })),
];

const routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/app",
    element: <AppLayout />,
    children: appChildren,
  },
  { path: "*", element: <Navigate to="/login" replace /> },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
