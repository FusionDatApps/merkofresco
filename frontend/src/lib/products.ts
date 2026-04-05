import { apiFetch } from "./api";

export type Product = {
  id: number;
  name: string;
  price: number;
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
      data: Product[];
    }
  | Product[];

export async function getProducts(): Promise<Product[]> {
  const res = (await apiFetch("/api/products", {
    method: "GET",
  })) as ProductsApiResponse;

  if (!Array.isArray(res) && res.ok && Array.isArray(res.data)) {
    return res.data;
  }

  if (Array.isArray(res)) {
    return res;
  }

  throw new Error("Respuesta inesperada del backend");
}