"use client";

import { useEffect, useState } from "react";
import { getProducts, Product } from "@/lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
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

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const imageUrl = product.images?.[0]?.url;
          const productName = product.name?.trim() || "Producto sin nombre";
          const formattedPrice =
            typeof product.price === "number"
              ? `$${product.price.toLocaleString("es-CO")}`
              : "Precio no disponible";
          const stockLabel =
            typeof product.stock === "number"
              ? product.stock > 0
                ? `Stock: ${product.stock}`
                : "Sin stock"
              : "Stock no definido";
          const categoryName = product.category?.name || "Sin categoría";

          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-48 items-center justify-center bg-gray-100">
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

              <div className="space-y-3 p-4">
                <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
                  {productName}
                </h2>

                <p className="text-xl font-bold text-green-700">
                  {formattedPrice}
                </p>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>{stockLabel}</p>
                  <p>{categoryName}</p>
                  {product.slug ? (
                    <p className="text-xs text-gray-400">slug: {product.slug}</p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}