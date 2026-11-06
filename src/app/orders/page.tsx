import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderCard from "@/components/order-card";
import OrdersSummary from "@/components/orders-summary";
import type { OrderSummary } from "@/types/order-summary";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("coffee_token");
  redirect("/login");
}

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  const response = await fetch(`${process.env.COFFEE_API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (response?.status === 401) redirect("/login");

  const data = response?.ok ? await response.json().catch(() => null) : null;
  const orders: OrderSummary[] | null = Array.isArray(data) ? data : null;

  const total = orders?.length ?? 0;
  const pending = orders?.filter((order) => order.status === "pending").length ?? 0;
  const ready = orders?.filter((order) => order.status === "ready").length ?? 0;

  return (
    <main>
      <h1>Pedidos</h1>
      <form action={logout}>
        <button type="submit">Cerrar sesión</button>
      </form>

      {orders === null && <p role="alert">No se pudieron consultar los pedidos.</p>}
      {orders?.length === 0 && <p>Todavía no hay pedidos.</p>}

      {orders && orders.length > 0 && (
        <>
          <OrdersSummary total={total} pending={pending} ready={ready} />
          <section className="orders-grid" aria-label="Listado de pedidos">
            {orders.map(({ id, item, quantity, status }) => (
              <OrderCard key={id} order={{ id, item, quantity, status }} />
            ))}
          </section>
        </>
      )}
    </main>
  );
}