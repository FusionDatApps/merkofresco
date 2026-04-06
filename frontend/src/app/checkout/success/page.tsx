"use client";

import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Pedido confirmado</h1>

        <p className="mt-4 text-sm text-gray-600">
          Tu pedido fue confirmado correctamente.
        </p>

        <div className="mt-6">
          <Link
            href="/products"
            className="rounded-xl bg-green-600 px-5 py-3 text-white text-sm font-semibold"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    </main>
  );
}