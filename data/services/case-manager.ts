import { authCall as callBackend } from "@/lib/api";
import type { CaseItem, CaseLookups } from "@/types/cases";
import type { ApiResponse, PaginatedRequestParams } from "@/types/common";

const base = `/cases/api/v${process.env.NEXT_PUBLIC_API_VERSION}`;

export async function getCases(query?: Partial<PaginatedRequestParams>) {
  return callBackend<ApiResponse<CaseItem[]>>(base, {
    query: query as any,
    resultMode: "onlySuccessWithException",
  });
}

export async function getCaseLookups() {
  return callBackend<ApiResponse<CaseLookups>>(`${base}/lookups/statuses`);
}
