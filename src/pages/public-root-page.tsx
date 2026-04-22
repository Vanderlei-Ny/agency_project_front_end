import { Navigate } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import {
  getAppPersona,
  getDefaultAppPath,
  isAuthenticated,
} from "../features/auth/auth-storage";

/** `/` — marketing para visitantes; usuários logados vão direto ao app. */
export function PublicRootPage() {
  if (isAuthenticated()) {
    const persona = getAppPersona();
    if (!persona) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to={`/app/${getDefaultAppPath(persona)}`} replace />;
  }
  return <LandingPage />;
}
