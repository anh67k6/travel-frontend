import { type FormEvent, useState } from "react";

type ExpensePayload = {
  paidByParticipantId: string;
  amountMinor: number;
  currencyCode: string;
  note?: string;
  splitParticipantIds: string[];
};

type Params = {
  onSubmit: (payload: ExpensePayload) => Promise<unknown>;
};

export function useExpenseForm({ onSubmit }: Params) {
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

  return {
    paidByParticipantId,
    amountMinor,
    currencyCode,
    note,
    selectedSet,
    setPaidByParticipantId,
    setAmountMinor,
    setCurrencyCode,
    setNote,
    handleSubmit,
    toggleParticipant,
  };
}
