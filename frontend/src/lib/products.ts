import { apiFetch } from "./api";

export type Product = {
  id: number;
  name: string;
  price: number | null;
  stock?: number | null;
  category?: {
    name?: string;
  } | null;
  images?: { url: string }[];
  slug?: string;
};

type RawProduct = {
  id: number;
  name: string;
  price: number | string | null;
  stock?: number | null;
  category?: {
    name?: string;
  } | null;
  images?: { url: string }[];
  slug?: string;
};

type ProductsApiResponse =
  | {
      ok: boolean;
      data: RawProduct[];
    }
  | RawProduct[];

function normalizeProduct(p: RawProduct): Product {
  return {
    id: p.id,
    name: p.name,
    price:
      typeof p.price === "string"
        ? Number(p.price)
        : typeof p.price === "number"
        ? p.price
        : null,
    stock: p.stock ?? null,
    category: p.category ?? null,
    images: p.images ?? [],
    slug: p.slug,
  };
}

export async function getProducts(): Promise<Product[]> {
  const res = (await apiFetch("/api/products", {
    method: "GET",
  })) as ProductsApiResponse;

  if (!Array.isArray(res) && res.ok && Array.isArray(res.data)) {
    return res.data.map(normalizeProduct);
  }

  if (Array.isArray(res)) {
    return res.map(normalizeProduct);
  }

  throw new Error("Respuesta inesperada del backend");
}