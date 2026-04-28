import { RegisterView } from "@/components/RegisterView";
import { useRegisterPageLogic } from "@/hooks/RegisterPage/useRegisterPage";

export function RegisterPage() {
  const { handleRegister } = useRegisterPageLogic();

  return <RegisterView onSubmit={handleRegister} />;
}
