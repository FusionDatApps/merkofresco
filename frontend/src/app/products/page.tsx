"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los productos";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  async function handleAddToCart(product: Product) {
    try {
      setCartError(null);
      setSuccessMessage(null);
      setAddingId(product.id);

      await addToCart(product.id, 1);

      setSuccessMessage(
        `"${product.name}" fue agregado correctamente al carrito.`
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo agregar el producto al carrito";

      setCartError(
        message === "Stock insuficiente"
          ? `No hay stock suficiente para "${product.name}".`
          : message
      );
    } finally {
      setAddingId(null);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Productos</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Cargando productos...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Productos</h1>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Productos</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            No hay productos disponibles en este momento.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <p className="mt-2 text-sm text-gray-600">
          Catálogo base de MerKofresco conectado al backend real.
        </p>
      </div>

      {cartError ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 shadow-sm">
          <p className="text-sm font-semibold text-red-800">
            No se pudo agregar al carrito
          </p>
          <p className="mt-1 text-sm text-red-700">{cartError}</p>
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 shadow-sm">
          <p className="text-sm font-semibold text-green-800">
            Producto agregado
          </p>
          <p className="mt-1 text-sm text-green-700">{successMessage}</p>
        </div>
      ) : null}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const imageUrl = product.images?.[0]?.url || null;
          const productName = product.name?.trim() || "Producto sin nombre";

          const numericPrice =
            typeof product.price === "number"
              ? product.price
              : Number(product.price);

          const formattedPrice = Number.isFinite(numericPrice)
            ? `$${numericPrice.toLocaleString("es-CO")}`
            : "Precio no disponible";

          const hasStock =
            typeof product.stock === "number" ? product.stock > 0 : false;

          const stockLabel =
            typeof product.stock === "number"
              ? hasStock
                ? `Stock: ${product.stock}${product.unit ? ` ${product.unit}` : ""}`
                : "Sin stock"
              : "Stock no definido";

          const categoryName = product.category?.name || "Sin categoría";
          const productSlug = product.slug?.trim();

          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Link
                href={productSlug ? `/products/${productSlug}` : "/products"}
                className="block focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <div className="relative flex h-48 items-center justify-center bg-gray-100">
                  {!hasStock ? (
                    <span className="absolute left-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Sin stock
                    </span>
                  ) : null}

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-gray-400">
                      Sin imagen disponible
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4 pb-3">
                  <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
                    {productName}
                  </h2>

                  <p className="text-xl font-bold text-green-700">
                    {formattedPrice}
                  </p>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p className={hasStock ? "" : "font-medium text-red-600"}>
                      {stockLabel}
                    </p>
                    <p>{categoryName}</p>
                    {productSlug ? (
                      <p className="text-xs text-gray-400">slug: {productSlug}</p>
                    ) : null}
                  </div>
                </div>
              </Link>

              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={addingId === product.id || !hasStock}
                  className="w-full rounded-xl px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70 bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                >
                  {!hasStock
                    ? "Sin stock disponible"
                    : addingId === product.id
                    ? "Agregando..."
                    : "Agregar al carrito"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}