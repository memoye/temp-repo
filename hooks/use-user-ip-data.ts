// import { useQuery } from "@tanstack/react-query";
// import { getIPLookup } from "@/services/third-party";

// export const useIPData = () => {
//   const query = useQuery({
//     queryKey: ["ip-lookup"],
//     queryFn: getIPLookup,
//     refetchOnMount: false,
//     staleTime: Infinity,
//     refetchOnWindowFocus: false,
//   });
//   return { ipCountryCode: query?.data?.country_code || "NG", ...query };
// };
