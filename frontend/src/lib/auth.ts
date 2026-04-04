import { apiFetch } from "./api";
import { getToken, setToken, removeToken } from "./storage";

export type AuthUser = {
  id: number | string;
  name?: string;
  email?: string;
  role?: string;
};

type LoginApiResponse = {
  ok?: boolean;
  data?: {
    user?: AuthUser;
    token?: string;
  };
  user?: AuthUser;
  token?: string;
  message?: string;
};

type RegisterApiResponse = {
  ok?: boolean;
  data?: unknown;
  message?: string;
};

type MeApiResponse = {
  ok?: boolean;
  data?: {
    user?: AuthUser;
  } | AuthUser;
  user?: AuthUser;
  message?: string;
};

export async function login(email: string, password: string) {
  const res = await apiFetch<LoginApiResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token = res?.data?.token || res?.token;
  const user = res?.data?.user || res?.user;

  if (!token) {
    throw new Error(res?.message || "No se pudo iniciar sesión");
  }

  setToken(token);

  return {
    token,
    user: user || null,
  };
}

export async function register(name: string, email: string, password: string) {
  const res = await apiFetch<RegisterApiResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (res?.ok === false) {
    throw new Error(res?.message || "No se pudo registrar el usuario");
  }

  return res;
}

export async function getMe() {
  const token = getToken();

  if (!token) {
    throw new Error("No hay sesión activa");
  }

  const res = await apiFetch<MeApiResponse>(
    "/api/auth/me",
    { method: "GET" },
    token
  );

  let user: AuthUser | undefined;

  if (res?.data && typeof res.data === "object" && "user" in res.data) {
    user = (res.data as { user?: AuthUser }).user;
  } else if (res?.data && typeof res.data === "object") {
    user = res.data as AuthUser;
  } else {
    user = res?.user;
  }

  if (!user) {
    throw new Error(res?.message || "No se pudo obtener la sesión");
  }

  return user;
}

export function logout() {
  removeToken();
}