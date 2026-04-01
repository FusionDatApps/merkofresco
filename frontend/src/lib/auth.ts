import { apiFetch } from "./api";
import { getToken, removeToken, setToken } from "./storage";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type AuthUser = {
  id: number | string;
  name?: string;
  email: string;
  role?: string;
};

export async function login(payload: LoginPayload): Promise<string> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!data?.token) {
    throw new Error("El backend no devolvió token");
  }

  setToken(data.token);
  return data.token;
}

export async function getMe(token?: string): Promise<AuthUser> {
  const authToken = token ?? getToken();

  if (!authToken) {
    throw new Error("Token ausente");
  }

  return apiFetch<AuthUser>("/api/auth/me", { method: "GET" }, authToken);
}

export function logout(): void {
  removeToken();
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}