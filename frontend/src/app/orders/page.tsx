"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrders, OrderSummary } from "@/lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Cargando pedidos...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!orders.length) return <p className="p-4">No tienes pedidos aún.</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Mis pedidos</h1>

      {orders.map(o => (
        <div key={o.id} className="border p-4 rounded">
          <p><strong>Pedido:</strong> {o.id}</p>
          <p><strong>Fecha:</strong> {new Date(o.createdAt).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {o.status}</p>
          <p><strong>Total:</strong> ${o.total}</p>
          <p><strong>Items:</strong> {o.itemsCount}</p>

          <Link
            href={`/orders/${o.id}`}
            className="text-green-600 underline"
          >
            Ver detalle
          </Link>
        </div>
      ))}
    </div>
  );
}