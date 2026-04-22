import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../features/auth/auth-storage";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
