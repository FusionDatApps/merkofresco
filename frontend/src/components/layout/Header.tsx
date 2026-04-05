"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMe, logout } from "@/lib/auth";
import { getToken } from "@/lib/storage";

type HeaderUser = {
  email?: string;
  name?: string;
};

export default function Header() {
  const pathname = usePathname();

  const [user, setUser] = useState<HeaderUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const token = getToken();

      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const me = await getMe();

        if (active) {
          setUser({
            email: me.email,
            name: me.name,
          });
        }
      } catch {
        logout();

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadSession();

    return () => {
      active = false;
    };
  }, [pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    window.location.replace("/login");
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-neutral-900">
          MerKofresco
        </Link>

        <nav className="flex items-center gap-4 text-sm text-neutral-700">
          <Link href="/" className="hover:text-neutral-900">
  Inicio
</Link>

<Link href="/products" className="hover:text-neutral-900">
  Productos
</Link>

          {loading ? (
            <span className="text-neutral-400">Cargando...</span>
          ) : user ? (
            <>
              <Link href="/dashboard" className="hover:text-neutral-900">
                Dashboard
              </Link>

              <span className="hidden text-neutral-500 md:inline">
                {user.name || user.email || "Usuario"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:border-neutral-900 hover:text-neutral-900"
              >
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-neutral-900">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}