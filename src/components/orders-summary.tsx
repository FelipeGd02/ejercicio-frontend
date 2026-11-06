type OrdersSummaryProps = {
  total: number;
  pending: number;
  ready: number;
};

export default function OrdersSummary({ total, pending, ready }: OrdersSummaryProps) {
  return (
    <section className="orders-summary" aria-label="Resumen de pedidos">
      <p>Total: <strong>{total}</strong></p>
      <p>Pendientes: <strong>{pending}</strong></p>
      <p>Listos: <strong>{ready}</strong></p>
    </section>
  );
}