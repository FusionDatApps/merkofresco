import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="MerKofresco"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        <nav className="flex items-center gap-4 text-sm text-[var(--color-text)] sm:gap-6">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
            Inicio
          </Link>
          <Link href="/login" className="hover:text-[var(--color-primary)] transition-colors">
            Login
          </Link>
          <Link href="/dashboard" className="hover:text-[var(--color-primary)] transition-colors">
            Dashboard
          </Link>
        </nav>

      </div>
    </header>
  );
}