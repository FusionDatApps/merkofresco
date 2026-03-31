export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
            Base visual inicial
          </span>

          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)] sm:text-4xl">
            MerKofresco
          </h1>

          <p className="text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base">
            Plataforma de productos frescos en construcción, con una base
            frontend limpia, coherente y lista para integrar autenticación real
            sin romper lo ya validado.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--color-text)]">
            Catálogo
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Espacio base para productos, categorías y estructura comercial.
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--color-text)]">
            Operación
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Preparado para pedidos, flujo de compra y administración interna.
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--color-text)]">
            Clientes
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Base lista para usuarios, sesiones y futuras vistas privadas.
          </p>
        </article>
      </section>
    </div>
  );
}