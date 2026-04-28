import { Navigate } from "react-router-dom";
import { TripListView } from "@/components/TripListView";
import { useTripListPageLogic } from "@/hooks/TripListPage/useTripListPage";

export function TripListPage() {
  const { authenticated, user, trips, isLoading, isError, handleCreateTrip, handleLogout } = useTripListPageLogic();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TripListView
      email={user?.email}
      trips={trips}
      isLoading={isLoading}
      isError={isError}
      onCreateTrip={handleCreateTrip}
      onLogout={handleLogout}
    />
  );
}
