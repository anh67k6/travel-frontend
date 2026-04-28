import { type FormEvent, useState } from "react";

type Params = {
  onSubmit: (payload: { title: string; assigneeParticipantId?: string }) => Promise<unknown>;
};

export function useToDoForm({ onSubmit }: Params) {
  const [title, setTitle] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ title });
    setTitle("");
  }

  return {
    title,
    setTitle,
    handleSubmit,
  };
}
