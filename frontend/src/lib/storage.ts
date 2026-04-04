const TOKEN_KEY = "merkofresco_token";
const COOKIE_NAME = "merkofresco_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, token);

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    token
  )}; path=/; max-age=86400; samesite=lax`;
}

export function removeToken(): void {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}