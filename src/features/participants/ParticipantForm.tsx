import { FormEvent, useState } from "react";

type Props = {
  onSubmit: (payload: { name: string; email?: string }) => Promise<unknown>;
};

export function ParticipantForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ name, email: email || undefined });
    setName("");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <input
        className="input-base"
        placeholder="Participant name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="input-base"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <button className="btn-primary" type="submit">Add</button>
    </form>
  );
}
