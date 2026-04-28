import { type FormEvent, useState } from "react";

type Params = {
  onSubmit: (payload: { email: string; password: string }) => Promise<void>;
};

export function useAuthForm({ onSubmit }: Params) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
