import { httpClient } from "../client/axios";
import { apiRoutes } from "../routes";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "SUPERADMIN" | "AGENCY_ADMIN" | "AGENCY_MEMBER" | "CLIENT";
    agencyId: string | null;
  };
};

export async function login(payload: LoginPayload) {
  const { data } = await httpClient.post<LoginResponse>(
    apiRoutes.auth.login,
    payload,
  );
  return data;
}
