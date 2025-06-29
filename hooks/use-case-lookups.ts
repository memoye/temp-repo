import { CasesManager } from "@/services/case-manager";
import { useQuery } from "@tanstack/react-query";

export function useCaseLookups() {
  return useQuery({
    queryKey: ["cases-lookups"],
    queryFn: CasesManager.lookups.getStatuses,
    staleTime: Infinity,
    select: (data) => data.payload,
  });
}
