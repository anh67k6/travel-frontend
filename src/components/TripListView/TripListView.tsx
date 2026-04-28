import { Link } from "react-router-dom";
import { TripForm } from "@/components/TripForm";
import type { Trip } from "@/lib/types";

type Props = {
  email?: string;
  trips: Trip[];
  isLoading: boolean;
  isError: boolean;
  onCreateTrip: (payload: { title: string; destination?: string; startDate?: string; endDate?: string }) => Promise<unknown>;
  onLogout: () => void;
};

export function TripListView({ email, trips, isLoading, isError, onCreateTrip, onLogout }: Props) {
  return (
    <div className="app-shell">
      <header className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Trips</h1>
          <p className="text-sm text-slate-500">Plan, track, and coordinate everything in one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-brand-200 bg-brand-100 px-3 py-1 text-sm font-medium text-brand-600">{email}</span>
          <button className="btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <TripForm onSubmit={onCreateTrip} />

      <section className="card grid gap-3">
        <h3 className="section-title">Trip List</h3>
        {isLoading && <p className="text-sm text-slate-600">Loading...</p>}
        {isError && <p className="error-text">Failed to load trips</p>}
        <ul className="grid gap-2">
          {trips.map((trip) => (
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
