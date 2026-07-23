export default function Filtros() {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Filtros</h2>

      <div className="flex flex-col gap-2 max-w-xs">
        <label htmlFor="indicador" className="font-medium">
          Indicador
        </label>

        <select
          id="indicador"
          className="border border-gray-300 rounded-md p-2"
        >
          <option>População</option>
          <option>Densidade</option>
        </select>
      </div>
    </section>
  );
}