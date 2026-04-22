import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import type { AppPersona } from "../features/auth/auth-types";
import {
  getAppPersona,
  getDefaultAppPath,
} from "../features/auth/auth-storage";
import { useToast } from "../features/toast/toast-context";

interface RouteGuardProps {
  children: ReactNode;
  allowedPersonas: AppPersona[];
}

export function RouteGuard({ children, allowedPersonas }: RouteGuardProps) {
  const persona = getAppPersona();
  const { addToast } = useToast();

  useEffect(() => {
    if (persona && !allowedPersonas.includes(persona)) {
      const message =
        persona === "client"
          ? "Esta área é exclusiva da equipe da agência."
          : persona === "agency_auditor"
            ? "Esta área é exclusiva do administrador da agência."
            : "Esta área é exclusiva para clientes.";

      addToast(message, "error");
    }
  }, [persona, allowedPersonas, addToast]);

  if (!persona) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedPersonas.includes(persona)) {
    const path = getDefaultAppPath(persona);
    return <Navigate to={`/app/${path}`} replace />;
  }

  return <>{children}</>;
}
