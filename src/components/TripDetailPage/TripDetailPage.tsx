import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TripDetailView } from "@/components/TripDetailView";
import { useTripDetailPageLogic } from "@/hooks/TripDetailPage/useTripDetailPage";

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!tripId) {
    return <p>Missing trip id</p>;
  }

  const {
    trip,
    isTripLoading,
    participants,
    todos,
    expenses,
    balances,
    images,
    participantMap,
    handleParticipantSubmit,
    handleTodoSubmit,
    handleToggleTodo,
    handleExpenseSubmit,
    handleImageUpload,
  } = useTripDetailPageLogic(tripId);

  return (
    <TripDetailView
      trip={trip}
      isTripLoading={isTripLoading}
      participants={participants}
      todos={todos}
      expenses={expenses}
      balances={balances}
      images={images}
      participantMap={participantMap}
      onParticipantSubmit={handleParticipantSubmit}
      onTodoSubmit={handleTodoSubmit}
      onToggleTodo={handleToggleTodo}
      onExpenseSubmit={handleExpenseSubmit}
      onImageUpload={handleImageUpload}
    />
  );
}
