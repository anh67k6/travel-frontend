import { type FormEvent, useState } from "react";
import type { Participant } from "../../lib/types";

type Props = {
  participants: Participant[];
  onSubmit: (payload: {
    paidByParticipantId: string;
    amountMinor: number;
    currencyCode: string;
    note?: string;
    splitParticipantIds: string[];
  }) => Promise<unknown>;
};

export function ExpenseForm({ participants, onSubmit }: Props) {
  const [paidByParticipantId, setPaidByParticipantId] = useState("");
  const [amountMinor, setAmountMinor] = useState("0");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [note, setNote] = useState("");
  const [selectedSet, setSelectedSet] = useState<Set<string>>(() => new Set());

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({
      paidByParticipantId,
      amountMinor: Number(amountMinor),
      currencyCode,
      note: note || undefined,
      splitParticipantIds: Array.from(selectedSet),
    });
    setAmountMinor("0");
    setNote("");
    setSelectedSet(new Set());
  }

  function toggleParticipant(id: string) {
    setSelectedSet((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <h4 className="section-title">Add Expense</h4>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Paid by</span>
        <select
          className="input-base"
          value={paidByParticipantId}
          onChange={(e) => setPaidByParticipantId(e.target.value)}
          required
        >
          <option value="">Select</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Amount (minor unit)</span>
        <input
          className="input-base"
          type="number"
          min={1}
          value={amountMinor}
          onChange={(e) => setAmountMinor(e.target.value)}
          required
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Currency</span>
        <input
          className="input-base"
          value={currencyCode}
          onChange={(e) => setCurrencyCode(e.target.value)}
          maxLength={10}
          required
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Note</span>
        <input className="input-base" value={note} onChange={(e) => setNote(e.target.value)} />
      </label>

      <div className="grid gap-2 rounded-xl border border-surface-200 bg-surface-50 p-3">
        <p className="text-sm font-medium text-slate-700">Split among:</p>
        <div className="grid gap-1">
          {participants.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                className="h-4 w-4 rounded border-surface-200 text-accent-500 focus:ring-accent-300"
                type="checkbox"
                checked={selectedSet.has(p.id)}
                onChange={() => toggleParticipant(p.id)}
              />
              {p.name}
            </label>
          ))}
        </div>
      </div>

      <button className="btn-primary w-full sm:w-fit" type="submit">Save expense</button>
    </form>
  );
}
