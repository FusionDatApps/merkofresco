export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Login
          </h1>

          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
            Esta pantalla sigue siendo un placeholder visual. La autenticación
            real se implementa después, sin mezclar estilos con lógica antes de
            tiempo.
          </p>

          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-sm text-[var(--color-text-secondary)]">
            Formulario pendiente de implementación
          </div>
        </div>
      </section>
    </div>
  );
}