import { useAuthForm } from "@/hooks/AuthForm/useAuthForm";

type Props = {
  mode: "login" | "register";
  onSubmit: (payload: { email: string; password: string }) => Promise<void>;
};

export function AuthForm({ mode, onSubmit }: Props) {
  const { email, password, error, loading, setEmail, setPassword, handleSubmit } = useAuthForm({ onSubmit });

  return (
    <form onSubmit={handleSubmit} className="card mx-auto grid w-full max-w-md gap-3 border-t-4 border-t-brand-500">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{mode === "login" ? "Login" : "Register"}</h2>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Email</span>
        <input
          className="input-base"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        <span>Password</span>
        <input
          className="input-base"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </label>
      {error && <p className="error-text">{error}</p>}
      <button className="btn-primary mt-1 w-full" type="submit" disabled={loading}>
        {loading ? "Submitting..." : mode === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}
