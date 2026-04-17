import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../features/auth/auth-storage";

export function AppLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
