import { apiFetch } from "./api";

type CreateOrderPayload = {
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
  total: number;
};

type CreateOrderResponse = {
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
  return apiFetch<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}