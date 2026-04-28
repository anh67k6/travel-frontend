import { Link } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";

type Props = {
  onSubmit: (payload: { email: string; password: string }) => Promise<void>;
};

export function RegisterView({ onSubmit }: Props) {
  return (
    <div className="app-shell">
      <section className="grid justify-items-center gap-4 py-6 sm:py-10">
        <AuthForm mode="register" onSubmit={onSubmit} />
        <p className="text-sm text-slate-600">
          Already have an account? <Link className="font-medium text-brand-600" to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
