import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

type NewOrderPageProps = {
  searchParams: Promise<{ error?: string }>;
};

async function createOrder(formData: FormData) {
  "use server";

  const item = String(formData.get("item") ?? "").trim();
  const quantity = Number(formData.get("quantity"));

  const cookieStore = await cookies();
  const token = cookieStore.get("coffee_token")?.value;
  if (!token) redirect("/login");

  if (!item || !Number.isInteger(quantity) || quantity < 1) {
    redirect("/orders/new?error=1");
  }

  const response = await fetch(`${process.env.COFFEE_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ item, quantity }),
    cache: "no-store",
  }).catch(() => null);

  if (response?.status === 401) redirect("/login");
  if (!response?.ok) redirect("/orders/new?error=1");

  redirect("/orders");
}

export default async function NewOrderPage({ searchParams }: NewOrderPageProps) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Nueva orden</h1>
      {error === "1" && (
        <p role="alert">No se pudo crear la orden. Revisar los datos o la conexión.</p>
      )}

      <form action={createOrder}>
        <p>
          <label>
            Producto <input name="item" required />
          </label>
        </p>
        <p>
          <label>
            Cantidad{" "}
            <input name="quantity" type="number" min={1} step={1} defaultValue={1} required />
          </label>
        </p>
        <button type="submit">Crear orden</button>{" "}
        <Link href="/orders">Cancelar</Link>
      </form>
    </main>
  );
}
