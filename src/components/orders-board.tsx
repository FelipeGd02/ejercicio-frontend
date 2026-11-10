"use client";

import { useState } from "react";
import OrderCard from "./order-card/order-card";
import type { OrderSummary } from "../types/order-summary";

type OrdersBoardProps = {
  orders: OrderSummary[];
};

export function OrdersBoard({ orders }: OrdersBoardProps) {
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const visibleOrders = showOnlyPending
    ? orders.filter((order) => order.status === "pending")
    : orders;

  function handleToggle() {
    setShowOnlyPending(!showOnlyPending);
  }

  return (
    <section aria-label="Tablero de pedidos">
      <button type="button" onClick={handleToggle} aria-pressed={showOnlyPending}>
        {showOnlyPending ? "Mostrar todos" : "Mostrar pendientes"}
      </button>
      <p>Pedidos visibles: {visibleOrders.length}</p>
      {visibleOrders.length === 0 ? (
        <p>No hay pedidos para mostrar.</p>
      ) : (
        <div className="orders-grid">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
