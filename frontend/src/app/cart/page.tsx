"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CartItem,
  clearCart,
  decreaseQuantity,
  getCart,
  getCartLineSubtotal,
  getCartTotal,
  increaseQuantity,
  removeFromCart,
} from "@/lib/cart";

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-CO")}`;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  function loadCart() {
    setCart(getCart());
  }

  useEffect(() => {
    loadCart();

    function handleCartUpdated() {
      loadCart();
    }

    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Ir al catálogo
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Tu carrito</h1>
          <p className="text-sm text-gray-600">
            Aún no has agregado productos al carrito.
          </p>

          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Ver productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tu carrito</h1>
          <p className="mt-1 text-sm text-gray-600">
            Revisa tus productos antes del siguiente paso.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
        <section className="space-y-4">
          {cart.map((item) => {
            const productHref = item.slug ? `/products/${item.slug}` : "/products";
            const subtotal = getCartLineSubtotal(item);
            const productName = item.name?.trim() || "Producto sin nombre";
            const unitLabel = item.unit?.trim() || null;

            return (
              <article
                key={item.productId}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href={productHref}
                    className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:w-32"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="px-3 text-center text-xs text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                    <div>
                      <Link
                        href={productHref}
                        className="text-lg font-semibold text-gray-900 hover:text-green-700"
                      >
                        {productName}
                      </Link>

                      <p className="mt-1 text-sm text-gray-600">
                        Precio unitario: {formatPrice(item.price)}
                        {unitLabel ? ` / ${unitLabel}` : ""}
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-900">
                        Subtotal: {formatPrice(subtotal)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex w-fit items-center rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.productId)}
                          className="px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          aria-label={`Disminuir cantidad de ${productName}`}
                        >
                          −
                        </button>

                        <span className="min-w-12 px-3 py-2 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.productId)}
                          className="px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          aria-label={`Aumentar cantidad de ${productName}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Resumen</h2>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Productos</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Unidades totales</span>
              <span>
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Continuar compra
            </button>

            <Link
              href="/products"
              className="inline-flex w-full justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Seguir comprando
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}