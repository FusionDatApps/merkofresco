"use client";

export const CART_STORAGE_KEY = "merkofresco_cart";

export type CartItem = {
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  unit: string | null;
};

type AddToCartInput = {
  productId: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  unit: string | null;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeNullableText(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizePrice(value: unknown) {
  const numericValue =
    typeof value === "number" ? value : Number(value);

  return Number.isFinite(numericValue) && numericValue >= 0 ? numericValue : 0;
}

function normalizeQuantity(value: unknown) {
  const numericValue =
    typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) return 1;

  const safeInteger = Math.floor(numericValue);
  return safeInteger >= 1 ? safeInteger : 1;
}

function normalizeProductId(value: unknown) {
  const numericValue =
    typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) return null;

  const safeInteger = Math.floor(numericValue);
  return safeInteger > 0 ? safeInteger : null;
}

function normalizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;

  const productId = normalizeProductId(item.productId);
  if (!productId) return null;

  return {
    productId,
    name: normalizeText(item.name, "Producto sin nombre"),
    slug: normalizeText(item.slug, ""),
    price: normalizePrice(item.price),
    quantity: normalizeQuantity(item.quantity),
    imageUrl: normalizeNullableText(item.imageUrl),
    unit: normalizeNullableText(item.unit),
  };
}

function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => normalizeCartItem(item))
    .filter((item): item is CartItem => item !== null);
}

function readCartStorage(): CartItem[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return sanitizeCart(parsed);
  } catch {
    return [];
  }
}

function writeCartStorage(cart: CartItem[]) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(sanitizeCart(cart))
    );
  } catch {
    // si localStorage falla, no rompemos la UI
  }
}

function emitCartUpdated() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCart(): CartItem[] {
  return readCartStorage();
}

export function setCart(cart: CartItem[]) {
  writeCartStorage(cart);
  emitCartUpdated();
}

export function addToCart(input: AddToCartInput) {
  const productId = normalizeProductId(input.productId);
  if (!productId) return;

  const normalizedInput: CartItem = {
    productId,
    name: normalizeText(input.name, "Producto sin nombre"),
    slug: normalizeText(input.slug, ""),
    price: normalizePrice(input.price),
    quantity: 1,
    imageUrl: normalizeNullableText(input.imageUrl),
    unit: normalizeNullableText(input.unit),
  };

  const currentCart = getCart();
  const existingIndex = currentCart.findIndex(
    (item) => item.productId === normalizedInput.productId
  );

  if (existingIndex >= 0) {
    currentCart[existingIndex] = {
      ...currentCart[existingIndex],
      quantity: currentCart[existingIndex].quantity + 1,
    };
    setCart(currentCart);
    return;
  }

  setCart([...currentCart, normalizedInput]);
}

export function removeFromCart(productId: number) {
  const safeProductId = normalizeProductId(productId);
  if (!safeProductId) return;

  const nextCart = getCart().filter((item) => item.productId !== safeProductId);
  setCart(nextCart);
}

export function increaseQuantity(productId: number) {
  const safeProductId = normalizeProductId(productId);
  if (!safeProductId) return;

  const nextCart = getCart().map((item) =>
    item.productId === safeProductId
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  setCart(nextCart);
}

export function decreaseQuantity(productId: number) {
  const safeProductId = normalizeProductId(productId);
  if (!safeProductId) return;

  const currentCart = getCart();
  const currentItem = currentCart.find((item) => item.productId === safeProductId);

  if (!currentItem) return;

  if (currentItem.quantity <= 1) {
    removeFromCart(safeProductId);
    return;
  }

  const nextCart = currentCart.map((item) =>
    item.productId === safeProductId
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );

  setCart(nextCart);
}

export function clearCart() {
  setCart([]);
}

export function getCartLineSubtotal(item: CartItem) {
  return normalizePrice(item.price) * normalizeQuantity(item.quantity);
}

export function getCartTotal() {
  return getCart().reduce((total, item) => {
    return total + getCartLineSubtotal(item);
  }, 0);
}

export function getCartCount() {
  return getCart().reduce((count, item) => {
    return count + normalizeQuantity(item.quantity);
  }, 0);
}