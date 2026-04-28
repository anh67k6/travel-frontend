import { setToken } from "./api";

const USER_EMAIL_KEY = "auth_email";
const USER_ID_KEY = "auth_user_id";

export type AuthUser = {
  email: string;
  userId: string | null;
};

export function saveAuth(token: string, user: AuthUser) {
  setToken(token);
  localStorage.setItem(USER_EMAIL_KEY, user.email);

  if (user.userId) {
    localStorage.setItem(USER_ID_KEY, user.userId);
  } else {
    localStorage.removeItem(USER_ID_KEY);
  }
}

export function clearAuth() {
  setToken(null);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

export function getStoredAuthUser(): AuthUser | null {
  const email = localStorage.getItem(USER_EMAIL_KEY);

  if (!email) {
    return null;
  }

  return {
    email,
    userId: localStorage.getItem(USER_ID_KEY),
  };
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("auth_token"));
}
