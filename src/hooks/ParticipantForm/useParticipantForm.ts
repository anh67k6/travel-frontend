import { type FormEvent, useState } from "react";

type Params = {
  onSubmit: (payload: { name: string; email?: string }) => Promise<unknown>;
};

export function useParticipantForm({ onSubmit }: Params) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ name, email: email || undefined });
    setName("");
    setEmail("");
  }

  return {
    name,
    email,
    setName,
    setEmail,
    handleSubmit,
  };
}
