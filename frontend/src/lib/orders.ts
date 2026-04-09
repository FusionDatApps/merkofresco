"use client";

import { apiFetch } from "./api";
import { getToken } from "./storage";

export type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
};

export type CreateOrderResponse = {
  ok: boolean;
  message: string;
  data: {
    orderId: number;
    status: string;
    total: number;
    itemsCount: number;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    createdAt?: string;
  };
};

// ✅ YA EXISTENTE (NO TOCAR)
export async function createOrder(payload: CreateOrderPayload) {
  const token = getToken();

  if (!token) {
    throw new Error("Debes iniciar sesión para confirmar el pedido");
  }

  return apiFetch<CreateOrderResponse>(
    "/api/orders",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

// 🆕 NUEVO — LISTADO DE ÓRDENES
export type OrderSummary = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  itemsCount: number;
};

export async function getMyOrders() {
  const token = getToken();

  if (!token) {
    throw new Error("Debes iniciar sesión");
  }

  return apiFetch<{ ok: boolean; data: OrderSummary[] }>(
    "/api/orders/me",
    {},
    token
  );
}

// 🆕 NUEVO — DETALLE DE ORDEN
export type OrderDetail = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

export async function getOrderById(id: string) {
  const token = getToken();

  if (!token) {
    throw new Error("Debes iniciar sesión");
  }

  return apiFetch<{ ok: boolean; data: OrderDetail }>(
    `/api/orders/${id}`,
    {},
    token
  );
}