"use client";

import { apiFetch } from "./api";
import { getToken } from "./storage";

export type BackendCartItem = {
  id: number;
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string | null;
  unit: string | null;
  stock: number;
};

export type BackendCart = {
  items: BackendCartItem[];
  total: number;
};

type ApiResponse<T> = {
  ok: boolean;
  message?: string;
  data: T;
};

function emitCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart-updated"));
  }
}

export async function getCart(): Promise<BackendCart> {
  const token = getToken();

  if (!token) {
    return {
      items: [],
      total: 0,
    };
  }

  const res = await apiFetch<ApiResponse<BackendCart>>(
    "/api/cart",
    { method: "GET" },
    token
  );

  return res.data;
}

export async function getCartCount(): Promise<number> {
  const token = getToken();

  if (!token) {
    return 0;
  }

  const cart = await getCart();
  return cart.items.reduce((acc, item) => acc + item.quantity, 0);
}

export async function addToCart(
  productId: number,
  quantity = 1
): Promise<BackendCart> {
  const token = getToken();

  if (!token) {
    throw new Error("Debes iniciar sesión para agregar productos al carrito");
  }

  const res = await apiFetch<ApiResponse<BackendCart>>(
    "/api/cart/items",
    {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    },
    token
  );

  emitCartUpdated();
  return res.data;
}

export async function updateCartItem(
  id: number,
  quantity: number
): Promise<BackendCart> {
  const token = getToken();

  if (!token) {
    throw new Error("Debes iniciar sesión para modificar el carrito");
  }

  const res = await apiFetch<ApiResponse<BackendCart>>(
    `/api/cart/items/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    },
    token
  );

  emitCartUpdated();
  return res.data;
}

export async function removeCartItem(id: number): Promise<BackendCart> {
  const token = getToken();

  if (!token) {
    throw new Error("Debes iniciar sesión para modificar el carrito");
  }

  const res = await apiFetch<ApiResponse<BackendCart>>(
    `/api/cart/items/${id}`,
    {
      method: "DELETE",
    },
    token
  );

  emitCartUpdated();
  return res.data;
}

export async function clearCart(): Promise<BackendCart> {
  const token = getToken();

  if (!token) {
    throw new Error("Debes iniciar sesión para vaciar el carrito");
  }

  const res = await apiFetch<ApiResponse<BackendCart>>(
    "/api/cart",
    {
      method: "DELETE",
    },
    token
  );

  emitCartUpdated();
  return res.data;
}