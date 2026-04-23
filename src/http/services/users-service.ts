import { getAuthToken } from "../../features/auth/auth-storage";
import { httpClient } from "../client/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

type AddAgencyMemberPayload = {
  name: string;
  email: string;
  password: string;
};

type AddAgencyMemberResponse = {
  id: string;
  name: string;
  email: string;
  role: "AGENCY_MEMBER";
  agencyId: string;
  createdAt: string;
};

export async function createAgency(payload: CreateAgencyPayload) {
  const { data } = await httpClient.post<CreateAgencyResponse>(
    "/agencies",
    payload,
  );
  return data;
}

export async function listAgencyMembers(): Promise<any[]> {
  const token = getAuthToken();

  const response = await fetch(`http://localhost:3000/users/agency`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text(); 
    throw new Error(`Erro ao carregar lista [${response.status}]: ${errorText}`);
  }

  return response.json();
}

export async function addAgencyMember(payload: AddAgencyMemberPayload): Promise<AddAgencyMemberResponse> {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}/users/agency`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text(); 
    throw new Error(`Erro ao cadastrar [${response.status}]: ${errorText}`);
  }

  return response.json();
}