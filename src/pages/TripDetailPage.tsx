import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { isAuthenticated } from "../lib/auth";
import { queryKeys } from "../lib/queryKeys";
import type { Balance, Expense, ImageItem, Participant, Todo, Trip } from "../lib/types";
import { ParticipantForm } from "../features/participants/ParticipantForm";
import { TodoForm } from "../features/todos/TodoForm";
import { ExpenseForm } from "../features/expenses/ExpenseForm";
import { ImageUploadForm } from "../features/images/ImageUploadForm";

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const queryClient = useQueryClient();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!tripId) {
    return <p>Missing trip id</p>;
  }

  const tripQuery = useQuery({
    queryKey: queryKeys.trip(tripId),
    queryFn: () => api.get<Trip>(`/api/trips/${tripId}`),
  });

  const participantsQuery = useQuery({
    queryKey: queryKeys.participants(tripId),
    queryFn: () => api.get<Participant[]>(`/api/trips/${tripId}/participants`),
  });

  const todosQuery = useQuery({
    queryKey: queryKeys.todos(tripId),
    queryFn: () => api.get<Todo[]>(`/api/trips/${tripId}/todos`),
  });

  const expensesQuery = useQuery({
    queryKey: queryKeys.expenses(tripId),
    queryFn: () => api.get<Expense[]>(`/api/trips/${tripId}/expenses`),
  });

  const balancesQuery = useQuery({
    queryKey: queryKeys.balances(tripId),
    queryFn: () => api.get<Balance[]>(`/api/trips/${tripId}/balances`),
  });

  const imagesQuery = useQuery({
    queryKey: queryKeys.images(tripId),
    queryFn: () => api.get<ImageItem[]>(`/api/trips/${tripId}/images`),
  });

  const createParticipant = useMutation({
    mutationFn: (payload: { name: string; email?: string }) =>
      api.post<Participant>(`/api/trips/${tripId}/participants`, payload),
    onSuccess: (participant) => {
      queryClient.setQueryData<Participant[]>(queryKeys.participants(tripId), (previous) => {
        if (!previous) {
          return [participant];
        }

        if (previous.some((item) => item.id === participant.id)) {
          return previous;
        }

        return [...previous, participant];
      });
    },
  });

  const createTodo = useMutation({
    mutationFn: (payload: { title: string; assigneeParticipantId?: string }) =>
      api.post<Todo>(`/api/trips/${tripId}/todos`, payload),
    onSuccess: (todo) => {
      queryClient.setQueryData<Todo[]>(queryKeys.todos(tripId), (previous) => {
        if (!previous) {
          return [todo];
        }

        if (previous.some((item) => item.id === todo.id)) {
          return previous;
        }

        return [...previous, todo];
      });
    },
  });

  const toggleTodo = useMutation({
    mutationFn: (todo: Todo) =>
      api.patch<Todo>(`/api/trips/${tripId}/todos/${todo.id}`, { completed: !todo.completed }),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(queryKeys.todos(tripId), (previous) => {
        if (!previous) {
          return [updatedTodo];
        }

        return previous.map((item) => (item.id === updatedTodo.id ? updatedTodo : item));
      });
    },
  });

  const createExpense = useMutation({
    mutationFn: (payload: {
      paidByParticipantId: string;
      amountMinor: number;
      currencyCode: string;
      note?: string;
      splitParticipantIds: string[];
    }) => api.post<Expense>(`/api/trips/${tripId}/expenses`, payload),
    onSuccess: (expense) => {
      queryClient.setQueryData<Expense[]>(queryKeys.expenses(tripId), (previous) => {
        if (!previous) {
          return [expense];
        }

        if (previous.some((item) => item.id === expense.id)) {
          return previous;
        }

        return [...previous, expense];
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.balances(tripId) });
    },
  });

  const uploadImage = useMutation({
    mutationFn: async ({ file, caption }: { file: File; caption?: string }) => {
      const presigned = await api.post<{ uploadUrl: string; storageKey: string }>(
        `/api/trips/${tripId}/images/presign`,
        { fileName: file.name, mimeType: file.type || "application/octet-stream" }
      );

      const uploadResponse = await fetch(presigned.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      return api.post<ImageItem>(`/api/trips/${tripId}/images/complete`, {
        storageKey: presigned.storageKey,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        caption,
      });
    },
    onSuccess: (image) => {
      queryClient.setQueryData<ImageItem[]>(queryKeys.images(tripId), (previous) => {
        if (!previous) {
          return [image];
        }

        if (previous.some((item) => item.id === image.id)) {
          return previous;
        }

        return [...previous, image];
      });
    },
  });

  const participants = participantsQuery.data ?? [];
  const todos = todosQuery.data ?? [];
  const expenses = expensesQuery.data ?? [];
  const balances = balancesQuery.data ?? [];
  const images = imagesQuery.data ?? [];

  const participantMap = useMemo(
    () => new Map(participants.map((participant) => [participant.id, participant.name])),
    [participants]
  );

  const handleParticipantSubmit = (payload: { name: string; email?: string }) =>
    createParticipant.mutateAsync(payload);
  const handleTodoSubmit = (payload: { title: string; assigneeParticipantId?: string }) =>
    createTodo.mutateAsync(payload);
  const handleExpenseSubmit = (payload: {
    paidByParticipantId: string;
    amountMinor: number;
    currencyCode: string;
    note?: string;
    splitParticipantIds: string[];
  }) => createExpense.mutateAsync(payload);
  const handleImageUpload = (file: File, caption?: string) =>
    uploadImage.mutateAsync({ file, caption });

  return (
    <div className="app-shell">
      <Link className="btn-secondary w-fit" to="/">
        ← Back to trips
      </Link>

      <section className="card grid gap-2">
        {tripQuery.isLoading ? (
          <p className="text-sm text-slate-600">Loading trip...</p>
        ) : (
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{tripQuery.data?.title}</h1>
        )}
        {tripQuery.data?.destination && <p className="text-sm text-slate-600">Destination: {tripQuery.data.destination}</p>}
      </section>

      <section className="card grid gap-3">
        <h3 className="section-title">Participants</h3>
        <ParticipantForm onSubmit={handleParticipantSubmit} />
        <ul className="grid gap-2">
          {participants.map((p) => (
            <li key={p.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
              {p.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="card grid gap-3">
        <h3 className="section-title">Todo List</h3>
        <TodoForm onSubmit={handleTodoSubmit} />
        <ul className="grid gap-2">
          {todos.map((todo) => (
            <li key={todo.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  className="h-4 w-4 rounded border-surface-200 text-accent-500 focus:ring-accent-300"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo.mutate(todo)}
                />
                {todo.title}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="card grid gap-4">
        <ExpenseForm participants={participants} onSubmit={handleExpenseSubmit} />

        <div className="grid gap-2">
          <h4 className="section-title">Expenses</h4>
          <ul className="grid gap-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
                {expense.amountMinor} {expense.currencyCode} paid by {participantMap.get(expense.paidByParticipantId) ?? "Unknown"}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-2">
          <h4 className="section-title">Balances</h4>
          <ul className="grid gap-2">
            {balances.map((balance) => (
              <li key={balance.participantId} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
                {participantMap.get(balance.participantId) ?? balance.participantId}: {balance.netMinor}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card grid gap-4">
        <ImageUploadForm onUpload={handleImageUpload} />
        <div className="grid gap-2">
          <h4 className="section-title">Images</h4>
          <ul className="grid gap-2">
            {images.map((image) => (
              <li key={image.id} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-slate-700">
                {image.storageKey} ({image.sizeBytes} bytes)
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
