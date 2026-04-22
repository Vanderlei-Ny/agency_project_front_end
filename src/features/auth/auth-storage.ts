import type {
  ApiUserRole,
  AppPersona,
  ClientSignupIntent,
  SessionUser,
} from "./auth-types";

const SESSION_KEY = "agency.auth.session.v1";

/** Snapshot único da sessão (evita token/role/user dessincronizados). */
export type AuthSessionV1 = {
  v: 1;
  token: string;
  user: SessionUser;
  /** Só usado com `user.role === "CLIENT"`. */
  clientSignupIntent: ClientSignupIntent;
};

export type {
  ApiUserRole,
  AppPersona,
  ClientSignupIntent,
  SessionUser,
} from "./auth-types";

export function getDefaultAppPath(persona: AppPersona): string {
  switch (persona) {
    case "client":
      return "inicio";
    case "agency_auditor":
      return "solicitacoes";
    case "agency_admin":
      return "solicitacoes";
  }
}

function isSessionUser(value: unknown): value is SessionUser {
  if (!value || typeof value !== "object") return false;
  const u = value as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.name === "string" &&
    typeof u.email === "string" &&
    typeof u.role === "string" &&
    (u.agencyId === null || typeof u.agencyId === "string")
  );
}

function parseSession(raw: string | null): AuthSessionV1 | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    if (o.v !== 1 || typeof o.token !== "string" || !isSessionUser(o.user)) {
      return null;
    }
    const intent = o.clientSignupIntent;
    const clientSignupIntent: ClientSignupIntent =
      intent === "agency_onboarding" ? "agency_onboarding" : null;
    return {
      v: 1,
      token: o.token,
      user: o.user as SessionUser,
      clientSignupIntent,
    };
  } catch {
    return null;
  }
}

function decodeJwtPayload(
  token: string,
): Partial<SessionUser> & { id?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Partial<SessionUser> & { id?: string };
  } catch {
    return null;
  }
}

function migrateLegacyKeys(): AuthSessionV1 | null {
  const token = localStorage.getItem("agency.auth.token");
  if (!token) return null;

  const roleRaw = localStorage.getItem("agency.auth.role");
  const legacyType = localStorage.getItem("agency.user.type") as
    | "agency"
    | "client"
    | null;

  const payload = decodeJwtPayload(token);
  const role =
    roleRaw === "SUPERADMIN" ||
    roleRaw === "AGENCY_ADMIN" ||
    roleRaw === "AGENCY_MEMBER" ||
    roleRaw === "CLIENT"
      ? roleRaw
      : typeof payload?.role === "string"
        ? (payload.role as ApiUserRole)
        : null;

  if (!role || !payload?.id || typeof payload.email !== "string") {
    return null;
  }

  const user: SessionUser = {
    id: payload.id,
    name: typeof payload.name === "string" ? payload.name : "",
    email: payload.email,
    role,
    agencyId:
      payload.agencyId === null || typeof payload.agencyId === "string"
        ? (payload.agencyId ?? null)
        : null,
  };

  const clientSignupIntent: ClientSignupIntent =
    role === "CLIENT" && legacyType === "agency" ? "agency_onboarding" : null;

  const session: AuthSessionV1 = {
    v: 1,
    token,
    user,
    clientSignupIntent,
  };

  persistSession(session);
  localStorage.removeItem("agency.auth.token");
  localStorage.removeItem("agency.auth.role");
  localStorage.removeItem("agency.user.type");
  return session;
}

function persistSession(session: AuthSessionV1): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function readSession(): AuthSessionV1 | null {
  const direct = parseSession(localStorage.getItem(SESSION_KEY));
  if (direct) return direct;
  return migrateLegacyKeys();
}

export function getAuthSession(): AuthSessionV1 | null {
  return readSession();
}

export function getAuthToken(): string | null {
  return readSession()?.token ?? null;
}

export function getSessionUser(): SessionUser | null {
  return readSession()?.user ?? null;
}

export function getUserRole(): ApiUserRole | null {
  return readSession()?.user.role ?? null;
}

/**
 * Grava sessão completa. Sempre use após login/registro ou refresh via /me.
 */
export function saveAuthSession(input: {
  token: string;
  user: SessionUser;
  clientSignupIntent?: ClientSignupIntent;
}): void {
  const clientSignupIntent: ClientSignupIntent =
    input.user.role === "CLIENT"
      ? (input.clientSignupIntent ?? null)
      : null;

  persistSession({
    v: 1,
    token: input.token,
    user: input.user,
    clientSignupIntent,
  });
}

export function getAppPersona(): AppPersona | null {
  const session = readSession();
  if (!session) return null;

  const { user, clientSignupIntent } = session;

  if (user.role === "CLIENT" && clientSignupIntent === "agency_onboarding") {
    return "agency_admin";
  }
  if (user.role === "CLIENT") {
    return "client";
  }
  if (user.role === "AGENCY_MEMBER") {
    return "agency_auditor";
  }
  if (user.role === "AGENCY_ADMIN" || user.role === "SUPERADMIN") {
    return "agency_admin";
  }
  return null;
}

export function clearAuthToken(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("agency.auth.token");
  localStorage.removeItem("agency.auth.role");
  localStorage.removeItem("agency.user.type");
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}
