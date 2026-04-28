import { FormEvent, useState } from "react";

type TripPayload = {
  title: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
};

type Props = {
  onSubmit: (payload: TripPayload) => Promise<unknown>;
};

export function TripForm({ onSubmit }: Props) {
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

  return (
    <form onSubmit={handleSubmit} className="card grid w-full gap-3">
      <h3 className="section-title">Create Trip</h3>
      <input
        className="input-base"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="input-base"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Start date</span>
        <input className="input-base" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>End date</span>
        <input className="input-base" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </label>
      {error && <p className="error-text">{error}</p>}
      <button className="btn-primary w-full sm:w-fit" type="submit">Create</button>
    </form>
  );
}
