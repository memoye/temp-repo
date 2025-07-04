import { Clients } from "@/services/clients-manager";
import { Connect } from "@/services/connect";
import { useQueries } from "@tanstack/react-query";

export function useEventAttendees() {
  const [usersQuery, clientsQuery] = useQueries({
    queries: [
      {
        queryKey: ["users"],
        queryFn: () => Connect.users.getAll(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 10 * 60 * 1000,
      },
      {
        queryKey: ["clients"],
        queryFn: () => Clients.getAll(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: 10 * 60 * 1000,
      },
    ],
  });

  const usersOptions = usersQuery.data?.payload
    .filter((user) => Boolean(user.userId))
    .map((user) => ({
      id: user.userId,
      name: user.name || `${user?.firstName ?? ""} ${user?.surName ?? ""}`,
      email: user.email,
      type: "Staff",
    }));

  const clientsOptions = clientsQuery.data?.payload
    .filter((user) => Boolean(user.id))
    .map((client) => ({
      id: client.id,
      name: client.name || `${client?.firstName ?? ""} ${client?.surName ?? ""}`,
      email: client.email,
      type: "Client",
    }));

  return {
    usersOptions,
    clientsOptions,
    attendeesOptions: [...(usersOptions || []), ...(clientsOptions || [])],
    isLoading: usersQuery.isLoading || clientsQuery.isLoading,
    isError: usersQuery.isError || clientsQuery.isError,
    error: usersQuery.error || clientsQuery.error,
    isFetching: usersQuery.isFetching || clientsQuery.isFetching,
    isStale: usersQuery.isStale || clientsQuery.isStale,
  };
}
