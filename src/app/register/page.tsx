import { redirect } from "next/navigation";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

async function register(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  const response = await fetch(`${process.env.COFFEE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  }).catch(() => null);

  if (!response) redirect("/register?error=conexion");
  if (response.status === 409) redirect("/register?error=existe");
  if (!response.ok) redirect("/register?error=datos");

  redirect("/login?registered=1");
}

const messages: Record<string, string> = {
  existe: "Ese email ya está registrado.",
  datos: "No se pudo crear la cuenta. Revisar el email y la contraseña (8 a 15 caracteres).",
  conexion: "No se pudo conectar con el servidor. Intentar de nuevo.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Crear cuenta</h1>
      {error && <p role="alert">{messages[error] ?? messages.datos}</p>}

      <form action={register}>
        <p>
          <label>
            Email <input name="email" type="email" autoComplete="email" required />
          </label>
        </p>
        <p>
          <label>
            Contraseña{" "}
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={15}
              required
            />
          </label>
        </p>
        <button type="submit">Registrarse</button>
      </form>
    </main>
  );
}
