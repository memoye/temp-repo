import { makeExternalRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { IPLookupResponse } from "@/types/common";

export async function getIPLookup() {
  const response = await makeExternalRequest<IPLookupResponse>("https://ipapi.co/json", {
    method: "GET",
  });
  return response;
}

export const useIPData = () => {
  const query = useQuery({
    queryKey: ["ip-lookup"],
    queryFn: getIPLookup,
    refetchOnMount: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  return { ipCountryCode: query?.data?.country_code || "NG", ...query };
};
