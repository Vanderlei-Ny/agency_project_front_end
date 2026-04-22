import { httpClient } from "../client/axios";
import { apiRoutes } from "../routes";
import type { SessionUser } from "../../features/auth/auth-types";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthTokenResponse = {
  token: string;
  user: SessionUser;
};

/** GET /me com token explícito (não depende da sessão já gravada). */
export async function fetchSessionUser(token: string): Promise<SessionUser> {
  const { data } = await httpClient.get<SessionUser>("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

/** Login + confirmação do usuário no servidor (fonte de verdade). */
export async function loginAndLoadSession(
  payload: LoginPayload,
): Promise<AuthTokenResponse> {
  const { data } = await httpClient.post<AuthTokenResponse>(
    apiRoutes.auth.login,
    payload,
  );
  const user = await fetchSessionUser(data.token);
  return { token: data.token, user };
}

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

/** Cadastro (API cria sempre role CLIENT) + /me para sessão consistente. */
export async function registerAndLoadSession(
  payload: RegisterPayload,
): Promise<{ token: string; user: SessionUser }> {
  const { data } = await httpClient.post<AuthTokenResponse>(
    apiRoutes.auth.registerClient,
    payload,
  );
  const user = await fetchSessionUser(data.token);
  return { token: data.token, user };
}
