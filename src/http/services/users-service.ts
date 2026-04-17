import { httpClient } from "../client/axios";
import { apiRoutes } from "../routes";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    agencyId: string | null;
  };
};

export async function registerUser(payload: RegisterPayload) {
  const { data } = await httpClient.post<RegisterResponse>(
    apiRoutes.auth.registerClient,
    payload,
  );
  return data;
}

type CreateAgencyPayload = {
  name: string;
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
};

type CreateAgencyResponse = {
  id: string;
  name: string;
  statusAgency: boolean;
};

export async function createAgency(payload: CreateAgencyPayload) {
  const { data } = await httpClient.post<CreateAgencyResponse>(
    "/admin/agencies",
    payload,
  );
  return data;
}
