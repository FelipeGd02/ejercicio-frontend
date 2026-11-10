import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="site-header">
      <p className="brand">Coffee Orders</p>
      <nav aria-label="Navegación principal">
        <Link href="/">Inicio</Link>
        <Link href="/orders">Pedidos</Link>
        <Link href="/login">Iniciar sesión</Link>
        <Link href="/register">Registrarse</Link>
      </nav>
    </header>
  );
}
