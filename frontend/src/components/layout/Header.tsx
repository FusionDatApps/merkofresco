"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe, logout } from "@/lib/auth";
import { getToken } from "@/lib/storage";
import { getCartCount } from "@/lib/cart";

type HeaderUser = {
  email?: string;
  name?: string;
};

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<HeaderUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadHeaderData() {
      const token = getToken();

      if (!token) {
        if (!cancelled) {
          setUser(null);
          setCartCount(0);
          setLoadingUser(false);
        }
        return;
      }

      try {
        const [me, count] = await Promise.all([getMe(), getCartCount()]);

        if (!cancelled) {
          setUser({
            email: me.email,
            name: me.name,
          });
          setCartCount(count);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setCartCount(0);
        }
      } finally {
        if (!cancelled) {
          setLoadingUser(false);
        }
      }
    }

    function handleCartUpdated() {
      loadHeaderData();
    }

    loadHeaderData();
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    setCartCount(0);
    router.push("/login");
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold text-green-700">
          MerKofresco
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className={
              isActive(pathname, "/") && pathname === "/"
                ? "text-green-700"
                : "hover:text-green-700"
            }
          >
            Inicio
          </Link>

          <Link
            href="/products"
            className={
              isActive(pathname, "/products")
                ? "text-green-700"
                : "hover:text-green-700"
            }
          >
            Productos
          </Link>

          <Link
            href="/cart"
            className={`relative ${
              isActive(pathname, "/cart")
                ? "text-green-700"
                : "hover:text-green-700"
            }`}
          >
            Carrito
            {cartCount > 0 ? (
              <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {loadingUser ? (
            <span className="text-gray-400">...</span>
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className={
                  isActive(pathname, "/dashboard")
                    ? "text-green-700"
                    : "hover:text-green-700"
                }
              >
                Dashboard
              </Link>

              {/* ✅ NUEVO LINK — MIS PEDIDOS */}
              <Link
                href="/orders"
                className={
                  isActive(pathname, "/orders")
                    ? "text-green-700"
                    : "hover:text-green-700"
                }
              >
                Mis pedidos
              </Link>

              <span className="hidden text-gray-500 sm:inline">
                {user.name || user.email || "Usuario"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={
                  isActive(pathname, "/login")
                    ? "text-green-700"
                    : "hover:text-green-700"
                }
              >
                Ingresar
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-green-600 px-3 py-1.5 text-white transition hover:bg-green-700"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}