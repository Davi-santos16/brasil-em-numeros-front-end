import Filtros from "./filtros";

export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto p-6">


      <header className="mb-8">
        <h1 className="text-4xl font-bold">
          Brasil em Números
        </h1>

        <p className="text-gray-600">
          Dashboard de indicadores do IBGE
        </p>
      </header>

      <Filtros />

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          KPIs
        </h2>

        <div className="grid grid-cols-3 gap-4">
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          Gráfico
        </h2>

        <div className="h-96 border rounded-lg">
        </div>
      </section>

    </main>
  );
}