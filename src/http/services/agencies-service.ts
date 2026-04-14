import { httpClient } from "../client/axios";
import { apiRoutes } from "../routes";

export async function listAgencies() {
  const { data } = await httpClient.get(apiRoutes.agencies.list);
  return data;
}
