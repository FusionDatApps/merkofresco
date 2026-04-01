"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, getMe, logout } from "@/lib/auth";
import { getToken } from "@/lib/storage";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateSession() {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const me = await getMe(token);
        setUser(me);
      } catch (err) {
        logout();

        const message =
          err instanceof Error ? err.message : "Sesión no válida";

        setError(message);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    validateSession();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-neutral-600">Validando acceso...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 shadow-sm">
          <h1 className="text-lg font-semibold text-red-700">
            Acceso no autorizado
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error || "Tu sesión no es válida. Redirigiendo al login..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Sesión autenticada correctamente.
        </p>

        <div className="mt-6 grid gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 text-sm text-neutral-700">
          <p>
            <span className="font-medium text-neutral-900">Usuario:</span>{" "}
            {user.name || "Sin nombre"}
          </p>
          <p>
            <span className="font-medium text-neutral-900">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium text-neutral-900">ID:</span>{" "}
            {String(user.id)}
          </p>
          {user.role ? (
            <p>
              <span className="font-medium text-neutral-900">Rol:</span>{" "}
              {user.role}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}