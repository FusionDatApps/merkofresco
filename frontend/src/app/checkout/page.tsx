"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CartItem,
  clearCart,
  getCart,
  getCartLineSubtotal,
  getCartTotal,
} from "@/lib/cart";

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-CO")}`;
}

type FormState = {
  name: string;
  phone: string;
  address: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function loadCart() {
    const items = getCart();

    if (!items.length) {
      router.replace("/cart");
      return;
    }

    setCart(items);
    setLoading(false);
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "El nombre es obligatorio";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "El teléfono es obligatorio";
    }

    if (!form.address.trim()) {
      nextErrors.address = "La dirección es obligatoria";
    }

    return nextErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    // Simulación limpia
    clearCart();

    // Notificar a header + cart
    window.dispatchEvent(new Event("cart-updated"));

    router.replace("/checkout/success");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-4 text-sm text-gray-600">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* FORMULARIO */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Datos del cliente</h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                href="/cart"
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
              >
                Volver
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white"
              >
                {submitting ? "Procesando..." : "Confirmar pedido"}
              </button>
            </div>
          </form>
        </section>

        {/* RESUMEN */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Resumen</h2>

          <div className="mt-4 space-y-4">
            {cart.map((item) => {
              const subtotal = getCartLineSubtotal(item);

              return (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t pt-4 font-semibold flex justify-between">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}