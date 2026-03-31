export default function Home() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <span className="inline-block rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          Frontend base
        </span>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          MerKofresco
        </h1>

        <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
          Base inicial del frontend lista para navegación, layout reutilizable y
          futura integración de autenticación.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">Estructura sólida</h2>
          <p className="text-sm text-slate-600">
            Layout reutilizable y separación limpia de responsabilidades.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">Navegación base</h2>
          <p className="text-sm text-slate-600">
            Rutas preparadas para Inicio, Login y Dashboard.
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-lg font-semibold">Listo para Día 6B</h2>
          <p className="text-sm text-slate-600">
            Base preparada para integrar autenticación sin rehacer estructura.
          </p>
        </div>
      </div>
    </section>
  );
}