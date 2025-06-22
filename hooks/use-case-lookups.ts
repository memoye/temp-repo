import { getCaseLookups } from "@/data/services/case-manager";
import { useQuery } from "@tanstack/react-query";

export function useCaseLookups() {
  return useQuery({
    queryKey: ["cases-lookups"],
    queryFn: getCaseLookups,
    staleTime: Infinity,
    select: (data) => data.payload,
  });
}
