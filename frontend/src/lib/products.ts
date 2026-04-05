"use client";

import { apiFetch } from "@/lib/api";

type ProductImage = {
  id?: number;
  url: string;
  alt: string | null;
};

type ProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number | null;
  unit: string | null;
  category: ProductCategory | null;
  images: ProductImage[];
};

type ProductsListResponse = {
  ok: boolean;
  data?: unknown[];
  message?: string;
};

type ProductDetailResponse = {
  ok: boolean;
  data?: unknown;
  message?: string;
};

function normalizePrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function normalizeStock(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeUnit(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return null;
}

function normalizeDescription(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return "";
}

function normalizeCategory(value: unknown): ProductCategory | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const category = value as Record<string, unknown>;

  if (
    typeof category.id !== "number" ||
    typeof category.name !== "string" ||
    typeof category.slug !== "string"
  ) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

function normalizeImages(value: unknown): ProductImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: ProductImage[] = [];

  for (const image of value) {
    if (!image || typeof image !== "object") {
      continue;
    }

    const img = image as Record<string, unknown>;

    if (typeof img.url !== "string" || !img.url.trim()) {
      continue;
    }

    const normalizedImage: ProductImage = {
      url: img.url.trim(),
      alt: typeof img.alt === "string" ? img.alt.trim() : null,
    };

    if (typeof img.id === "number" && Number.isFinite(img.id)) {
      normalizedImage.id = img.id;
    }

    result.push(normalizedImage);
  }

  return result;
}

function normalizeProduct(raw: unknown): Product {
  const product = (raw ?? {}) as Record<string, unknown>;

  const id =
    typeof product.id === "number" && Number.isFinite(product.id)
      ? product.id
      : 0;

  const name =
    typeof product.name === "string" && product.name.trim()
      ? product.name.trim()
      : "Producto sin nombre";

  const slug =
    typeof product.slug === "string" && product.slug.trim()
      ? product.slug.trim()
      : "";

  return {
    id,
    name,
    slug,
    description: normalizeDescription(product.description),
    price: normalizePrice(product.price),
    stock: normalizeStock(product.stock),
    unit: normalizeUnit(product.unit),
    category: normalizeCategory(product.category),
    images: normalizeImages(product.images),
  };
}

export async function getProducts(): Promise<Product[]> {
  const response = (await apiFetch("/api/products")) as ProductsListResponse;

  if (!response?.ok) {
    throw new Error(response?.message || "No se pudieron cargar los productos");
  }

  if (!Array.isArray(response.data)) {
    throw new Error("Respuesta inesperada al listar productos");
  }

  return response.data
    .map(normalizeProduct)
    .filter((product) => product.id > 0);
}

export async function getProductById(id: number): Promise<Product> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("El id del producto es inválido");
  }

  const response = (await apiFetch(
    `/api/products/${id}`
  )) as ProductDetailResponse;

  if (!response?.ok) {
    throw new Error(
      response?.message || "No se pudo cargar el detalle del producto"
    );
  }

  if (!response.data || typeof response.data !== "object") {
    throw new Error("Respuesta inesperada al obtener el detalle del producto");
  }

  const product = normalizeProduct(response.data);

  if (product.id <= 0) {
    throw new Error("El detalle del producto llegó con id inválido");
  }

  return product;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const products = await getProducts();

  const product = products.find((item) => item.slug === normalizedSlug);

  return product ?? null;
}