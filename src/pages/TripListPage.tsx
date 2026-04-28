import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { getAuthEmail, isAuthenticated, logout } from "../lib/auth";
import { queryKeys } from "../lib/queryKeys";
import { Trip } from "../lib/types";
import { TripForm } from "../features/trips/TripForm";

export function TripListPage() {
  const queryClient = useQueryClient();
  const authenticated = isAuthenticated();

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

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  const email = getAuthEmail();

  return (
    <div className="app-shell">
      <header className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Trips</h1>
          <p className="text-sm text-slate-500">Plan, track, and coordinate everything in one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-brand-200 bg-brand-100 px-3 py-1 text-sm font-medium text-brand-600">{email}</span>
          <button
            className="btn-secondary"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <TripForm onSubmit={(payload) => createTrip.mutateAsync(payload)} />

      <section className="card grid gap-3">
        <h3 className="section-title">Trip List</h3>
        {tripsQuery.isLoading && <p className="text-sm text-slate-600">Loading...</p>}
        {tripsQuery.isError && <p className="error-text">Failed to load trips</p>}
        <ul className="grid gap-2">
          {(tripsQuery.data ?? []).map((trip) => (
            <li key={trip.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2">
              <Link className="font-semibold text-brand-500 hover:text-brand-600" to={`/trips/${trip.id}`}>
                {trip.title}
              </Link>
              {trip.destination ? <span className="text-slate-600"> {`- ${trip.destination}`}</span> : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
