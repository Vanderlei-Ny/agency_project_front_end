import { httpClient } from "../client/axios";

type CreateAgencyPayload = {
  name: string;
  description?: string;
  phone?: string;
  iconAgency?: string;
  adminName?: string;
  adminEmail?: string;
  adminPassword?: string;
};

type CreateAgencyResponse = {
  id: string;
  name: string;
  statusAgency: boolean;
  token?: string;
};

export async function createAgency(payload: CreateAgencyPayload) {
  const { data } = await httpClient.post<CreateAgencyResponse>(
    "/agencies",
    payload,
  );
  return data;
}
