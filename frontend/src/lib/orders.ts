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