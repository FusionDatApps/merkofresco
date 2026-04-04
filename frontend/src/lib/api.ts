"use client";

export const API_URL = "http://localhost:4000";

type ErrorPayload = {
  message?: string;
  error?: string;
  details?: string;
};

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const payload = data as ErrorPayload;

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  if (typeof payload.details === "string" && payload.details.trim()) {
    return payload.details;
  }

  return null;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const backendMessage = extractErrorMessage(data);

    if (backendMessage) {
      throw new Error(backendMessage);
    }

    if (response.status === 400) {
      throw new Error("Solicitud inválida");
    }

    if (response.status === 401) {
      throw new Error("Sesión no válida");
    }

    if (response.status === 404) {
      throw new Error("Recurso no encontrado");
    }

    if (response.status === 409) {
      throw new Error("El usuario ya existe");
    }

    if (response.status >= 500) {
      throw new Error("Error interno del servidor");
    }

    throw new Error("Ocurrió un error al conectar con el servidor");
  }

  return data as T;
}