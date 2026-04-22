import { Navigate } from "react-router-dom";
import {
  getAppPersona,
  getDefaultAppPath,
} from "../features/auth/auth-storage";

export function AppIndexRedirect() {
  const persona = getAppPersona();
  if (!persona) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={getDefaultAppPath(persona)} replace />;
}
