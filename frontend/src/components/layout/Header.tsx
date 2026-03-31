import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-slate-900">
          MerKofresco
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/" className="hover:text-slate-900">
            Inicio
          </Link>
          <Link href="/login" className="hover:text-slate-900">
            Login
          </Link>
          <Link href="/dashboard" className="hover:text-slate-900">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}