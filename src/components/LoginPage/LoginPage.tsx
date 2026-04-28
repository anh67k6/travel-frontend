import { LoginView } from "@/components/LoginView";
import { useLoginPageLogic } from "@/hooks/LoginPage/useLoginPage";

export function LoginPage() {
  const { handleLogin } = useLoginPageLogic();

  return <LoginView onSubmit={handleLogin} />;
}
