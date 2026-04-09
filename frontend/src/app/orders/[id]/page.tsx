"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById, OrderDetail } from "@/lib/orders";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrderById(id as string)
      .then(res => setOrder(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Cargando...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!order) return <p className="p-4">Pedido no encontrado</p>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Detalle del pedido</h1>

      <p><strong>ID:</strong> {order.id}</p>
      <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total}</p>

      <h2 className="font-semibold">Cliente</h2>
      <p>{order.customerName}</p>
      <p>{order.customerPhone}</p>
      <p>{order.customerAddress}</p>

      <h2 className="font-semibold">Productos</h2>

      {order.items.map((item, i) => (
        <div key={i} className="border p-2 rounded">
          <p>{item.productName}</p>
          <p>Cantidad: {item.quantity}</p>
          <p>Precio: ${item.unitPrice}</p>
          <p>Total: ${item.lineTotal}</p>
        </div>
      ))}
    </div>
  );
}