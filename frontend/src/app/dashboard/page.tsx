export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Dashboard
          </h1>

          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
            Vista placeholder para validar estructura, layout y consistencia
            visual antes de integrar autenticación y datos reales.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-text-secondary)]">
        Área de contenido futura.
      </section>
    </div>
  );
}