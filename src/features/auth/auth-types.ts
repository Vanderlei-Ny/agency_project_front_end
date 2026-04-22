export type ApiUserRole =
  | "SUPERADMIN"
  | "AGENCY_ADMIN"
  | "AGENCY_MEMBER"
  | "CLIENT";

/** Persona usada na UI, roteamento e sidebar (independente do nome da role na API). */
export type AppPersona = "client" | "agency_admin" | "agency_auditor";

/** Usuário persistido na sessão (espelha GET /me e respostas de login/registro). */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: ApiUserRole;
  agencyId: string | null;
};

/**
 * Só aplica quando `role === "CLIENT"`: indica cadastro para criar agência em seguida.
 * Após criar a agência ou no login, deve ser `null`.
 */
export type ClientSignupIntent = "agency_onboarding" | null;
