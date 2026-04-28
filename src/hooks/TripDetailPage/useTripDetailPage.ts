import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { Balance, Expense, ImageItem, Participant, Todo, Trip } from "@/lib/types";

export function useTripDetailPageLogic(tripId: string) {
  const queryClient = useQueryClient();

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

  return {
    trip: tripQuery.data,
    isTripLoading: tripQuery.isLoading,
    participants,
    todos,
    expenses,
    balances,
    images,
    participantMap,
    handleParticipantSubmit: (payload: { name: string; email?: string }) => createParticipant.mutateAsync(payload),
    handleTodoSubmit: (payload: { title: string; assigneeParticipantId?: string }) => createTodo.mutateAsync(payload),
    handleToggleTodo: (todo: Todo) => toggleTodo.mutate(todo),
    handleExpenseSubmit: (payload: {
      paidByParticipantId: string;
      amountMinor: number;
      currencyCode: string;
      note?: string;
      splitParticipantIds: string[];
    }) => createExpense.mutateAsync(payload),
    handleImageUpload: (file: File, caption?: string) => uploadImage.mutateAsync({ file, caption }),
  };
}
