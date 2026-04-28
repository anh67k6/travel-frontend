import { Link } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";

type Props = {
  onSubmit: (payload: { email: string; password: string }) => Promise<void>;
};

export function LoginView({ onSubmit }: Props) {
  return (
    <div className="app-shell">
      <section className="grid justify-items-center gap-4 py-6 sm:py-10">
        <AuthForm mode="login" onSubmit={onSubmit} />
        <p className="text-sm text-slate-600">
          No account? <Link className="font-medium text-brand-600" to="/register">Register</Link>
        </p>
      </section>
    </div>
  );
}
