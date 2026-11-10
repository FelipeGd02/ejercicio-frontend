import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { OrderSummary } from "@/types/order-summary";

type EditOrderPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

async function updateOrder(formData: FormData) {
  "use server";

  const id = String(formData.get("id"));
  const item = String(formData.get("item") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const status = formData.get("status");

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  if (!item || !Number.isInteger(quantity) || quantity < 1 || (status !== "pending" && status !== "ready")) {
    redirect(`/orders/${id}/edit?error=1`);
  }

  const response = await fetch(`${process.env.COFFEE_API_URL}/orders/${id}`, {
    method: "PATCH", // si el backend usa PUT, cambiar aquí
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item, quantity, status }),
    cache: "no-store",
  }).catch(() => null);

  if (response?.status === 401) redirect("/login");
  if (!response?.ok) redirect(`/orders/${id}/edit?error=1`);

  redirect("/orders");
}

export default async function EditOrderPage({ params, searchParams }: EditOrderPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

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
  const order = orders?.find((o) => String(o.id) === id);

  if (!orders) {
    return (
      <main>
        <h1>Editar pedido</h1>
        <p role="alert">No se pudieron consultar los pedidos.</p>
        <Link href="/orders">Volver a pedidos</Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main>
        <h1>Editar pedido</h1>
        <p role="alert">El pedido #{id} no existe.</p>
        <Link href="/orders">Volver a pedidos</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Editar pedido #{order.id}</h1>
      {error === "1" && (
        <p role="alert">No se pudo guardar. Revisar los datos o la conexión.</p>
      )}

      <form action={updateOrder}>
        <input type="hidden" name="id" value={order.id} />
        <p>
          <label>
            Producto <input name="item" defaultValue={order.item} required />
          </label>
        </p>
        <p>
          <label>
            Cantidad{" "}
            <input name="quantity" type="number" min={1} step={1} defaultValue={order.quantity} required />
          </label>
        </p>
        <p>
          <label>
            Estado{" "}
            <select name="status" defaultValue={order.status}>
              <option value="pending">Pendiente</option>
              <option value="ready">Listo</option>
            </select>
          </label>
        </p>
        <button type="submit">Guardar cambios</button>{" "}
        <Link href="/orders">Cancelar</Link>
      </form>
    </main>
  );
}
