import { setToken } from "./api";

const USER_EMAIL_KEY = "auth_email";

export function saveAuth(token: string, email: string) {
  setToken(token);
  localStorage.setItem(USER_EMAIL_KEY, email);
}

export function logout() {
  setToken(null);
  localStorage.removeItem(USER_EMAIL_KEY);
}

export function getAuthEmail(): string | null {
  return localStorage.getItem(USER_EMAIL_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem("auth_token"));
}
