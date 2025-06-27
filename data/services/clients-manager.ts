import { authCall as callBackend } from "@/lib/api";
import type { Client } from "@/types/clients";
import type { ApiResponse } from "@/types/common";

const base = `/clients/api/v${process.env.NEXT_PUBLIC_API_VERSION}`;

export async function getClients(query?: Record<string, any>) {
  return callBackend<ApiResponse<Client[]>>(base, {
    query: query as any,
    resultMode: "onlySuccessWithException",
  });
}
