import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../features/auth/AuthForm";
import { api } from "../lib/api";
import { saveAuth } from "../lib/auth";
import { AuthResponse } from "../lib/types";

export function RegisterPage() {
  const navigate = useNavigate();

  async function handleRegister(payload: { email: string; password: string }) {
    const response = await api.post<AuthResponse>("/api/auth/register", payload);
    saveAuth(response.token, response.email);
    navigate("/");
  }

  return (
    <div className="app-shell">
      <section className="grid justify-items-center gap-4 py-6 sm:py-10">
        <AuthForm mode="register" onSubmit={handleRegister} />
        <p className="text-sm text-slate-600">
          Already have an account? <Link className="font-medium text-brand-600" to="/login">Login</Link>
        </p>
      </section>
    </div>
  );
}
