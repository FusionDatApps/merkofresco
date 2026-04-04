import { apiFetch } from "./api";
import { getToken, removeToken, setToken } from "./storage";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  ok: boolean;
  data: {
    user?: unknown;
    token: string;
  };
};

export type AuthUser = {
  id: number | string;
  name?: string;
  email: string;
  role?: string;
};

export async function login(payload: LoginPayload): Promise<string> {
  const response = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const token = response?.data?.token;

  if (!token) {
    throw new Error("El backend no devolvió token válido");
  }

  setToken(token);
  return token;
}

export async function getMe(token?: string): Promise<AuthUser> {
  const authToken = token ?? getToken();

  if (!authToken) {
    throw new Error("Token ausente");
  }

  const response = await apiFetch<{ ok: boolean; data: AuthUser }>(
    "/api/auth/me",
    { method: "GET" },
    authToken
  );

  if (!response?.data) {
    throw new Error("El backend no devolvió usuario válido");
  }

  return response.data;
}

export function logout(): void {
  removeToken();
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}