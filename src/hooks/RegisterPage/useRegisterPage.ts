import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export function useRegisterPageLogic() {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleRegister(payload: { email: string; password: string }) {
    const response = await api.post<AuthResponse>("/api/auth/register", payload);
    login(response.token, { email: response.email, userId: response.userId });
    navigate("/");
  }

  return { handleRegister };
}
