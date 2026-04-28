import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export function useLoginPageLogic() {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(payload: { email: string; password: string }) {
    const response = await api.post<AuthResponse>("/api/auth/login", payload);
    login(response.token, { email: response.email, userId: response.userId });
    navigate("/");
  }

  return { handleLogin };
}
