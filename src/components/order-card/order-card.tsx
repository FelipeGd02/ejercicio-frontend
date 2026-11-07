import Link from "next/link";
import type { OrderSummary } from "../../types/order-summary";
import styles from "./order-card.module.css";

type OrderCardProps = {
  order: OrderSummary;
};

export default function OrderCard({ order }: OrderCardProps) {
  const isReady = order.status === "ready";

  return (
    <article className={styles.card}>
      <h2>Pedido #{order.id}</h2>
      <p>{order.item}</p>
      <p>Cantidad: {order.quantity}</p>
      <p className={`${styles.status} ${isReady ? styles.ready : styles.pending}`}>
        {isReady ? "Listo" : "Pendiente"}
      </p>
      <p>
        <Link href={`/orders/${order.id}/edit`}>Editar</Link>
      </p>
    </article>
  );
}