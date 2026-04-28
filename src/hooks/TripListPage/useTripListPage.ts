import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Trip } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export function useTripListPageLogic() {
  const queryClient = useQueryClient();
  const { authenticated, user, logout } = useAuth();

  const tripsQuery = useQuery({
    queryKey: queryKeys.trips(),
    queryFn: () => api.get<Trip[]>("/api/trips"),
    enabled: authenticated,
  });

  const createTrip = useMutation({
    mutationFn: (payload: { title: string; destination?: string; startDate?: string; endDate?: string }) =>
      api.post<Trip>("/api/trips", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trips() }),
  });

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return {
    authenticated,
    user,
    trips: tripsQuery.data ?? [],
    isLoading: tripsQuery.isLoading,
    isError: tripsQuery.isError,
    handleCreateTrip: (payload: { title: string; destination?: string; startDate?: string; endDate?: string }) =>
      createTrip.mutateAsync(payload),
    handleLogout,
  };
}
