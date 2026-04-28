import { createContext, useContext, useMemo, useState } from "react";
import { clearAuth, type AuthUser, getStoredAuthUser, isAuthenticated, saveAuth } from "../lib/auth";

type AuthContextValue = {
  user: AuthUser | null;
  authenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const authenticated = isAuthenticated();

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authenticated,
      login: (token: string, nextUser: AuthUser) => {
        saveAuth(token, nextUser);
        setUser(nextUser);
      },
      logout: () => {
        clearAuth();
        setUser(null);
      },
    }),
    [user, authenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
