"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById, getProductBySlug, Product } from "@/lib/products";

export default function ProductDetailPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = useMemo(() => {
    if (Array.isArray(slugParam)) {
      return slugParam[0] ?? "";
    }

    return typeof slugParam === "string" ? slugParam : "";
  }, [slugParam]);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProductDetail() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        setProduct(null);

        if (!slug.trim()) {
          setNotFound(true);
          return;
        }

        const productFromSlug = await getProductBySlug(slug);

        if (!productFromSlug) {
          setNotFound(true);
          return;
        }

        const productDetail = await getProductById(productFromSlug.id);
        setProduct(productDetail);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo cargar el detalle del producto";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadProductDetail();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
            Cargando imagen...
          </div>

          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-red-700">
            Error al cargar el producto
          </h1>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Producto no encontrado
          </h1>
          <p className="text-sm text-gray-600">
            El slug consultado no existe en el catálogo actual.
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/products"
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            No fue posible renderizar el producto.
          </p>
        </div>
      </main>
    );
  }

  const imageUrl = product.images?.[0]?.url;
  const productName = product.name?.trim() || "Producto sin nombre";
  const formattedPrice = Number.isFinite(product.price)
    ? `$${product.price.toLocaleString("es-CO")}`
    : "Precio no disponible";
  const categoryName = product.category?.name || "Sin categoría";
  const description = product.description?.trim() || "Sin descripción disponible";
  const stockLabel =
    typeof product.stock === "number"
      ? product.stock > 0
        ? `${product.stock}${product.unit ? ` ${product.unit}` : ""}`
        : "Sin stock"
      : "Stock no definido";
  const slugLabel = product.slug?.trim();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/products"
          className="text-sm font-medium text-green-700 hover:text-green-800"
        >
          ← Volver al catálogo
        </Link>
      </div>

      <section className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              className="h-80 w-full object-cover md:h-full"
            />
          ) : (
            <div className="flex h-80 w-full items-center justify-center px-4 text-center text-sm text-gray-400">
              Sin imagen disponible
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-green-700">
              {categoryName}
            </p>

            <h1 className="text-3xl font-bold text-gray-900">{productName}</h1>

            {slugLabel ? (
              <p className="mt-2 text-xs text-gray-400">slug: {slugLabel}</p>
            ) : null}
          </div>

          <p className="text-3xl font-bold text-green-700">{formattedPrice}</p>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">Disponibilidad</p>
            <p className="mt-1 text-sm text-gray-600">{stockLabel}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Descripción</h2>
            <p className="text-sm leading-6 text-gray-600">{description}</p>
          </div>
        </div>
      </section>
    </main>
  );
}