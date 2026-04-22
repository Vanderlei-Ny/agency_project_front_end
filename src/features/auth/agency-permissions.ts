import { getUserRole } from "./auth-storage";

/** Orçamento e envio de valores ao cliente (admin da agência). */
export function canAgencyManageFormBudget(): boolean {
  const role = getUserRole();
  return role === "AGENCY_ADMIN" || role === "SUPERADMIN";
}

/** Avanço de entrega após aprovação do cliente (admin da agência). */
export function canAgencyManageDeliveryStatus(): boolean {
  const role = getUserRole();
  return role === "AGENCY_ADMIN" || role === "SUPERADMIN";
}
