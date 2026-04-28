import { type FormEvent, useState } from "react";

type TripPayload = {
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
};

type Params = {
  onSubmit: (payload: TripPayload) => Promise<unknown>;
};

export function useTripForm({ onSubmit }: Params) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit({
        title,
        destination: destination || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setTitle("");
      setDestination("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
    }
  }

  return {
    title,
    destination,
    startDate,
    endDate,
    error,
    setTitle,
    setDestination,
    setStartDate,
    setEndDate,
    handleSubmit,
  };
}
