import { api } from "@/lib/api";
import { Client } from "@/types/clients";
import { PaginatedRequestParams } from "@/types/common";

const config = { service: "clients", requireAuth: true } as const;

class ClientsService {
  // Main operations
  async getAll(params?: Partial<PaginatedRequestParams>) {
    return api.get<(Client & { id: string; name: string; clientType: number })[]>("/", {
      ...config,
      params,
    });
  }
}
export const Clients = new ClientsService();
