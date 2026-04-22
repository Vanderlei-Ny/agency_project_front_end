import { httpClient } from "../client/axios";
import { apiRoutes } from "../routes";

export interface AgencyData {
  id: string;
  name: string;
  description?: string | null;
  phone?: string | null;
  statusAgency: boolean;
  numberOfStars: number;
  iconAgency?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function listAgencies() {
  const { data } = await httpClient.get(apiRoutes.agencies.list);
  return data;
}

export async function getMyAgency() {
  const { data } = await httpClient.get<AgencyData>("/agency/me");
  return data;
}

export async function updateMyAgency(input: {
  name?: string;
  description?: string | null;
  phone?: string | null;
  iconAgency?: string;
}) {
  const { data } = await httpClient.patch<AgencyData>("/agency/me", input);
  return data;
}
