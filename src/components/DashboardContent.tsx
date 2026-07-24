import { StatCards } from "./StatCards";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { DashboardService } from "@/services/dashboard.service";
import type { DashboardResponse } from "@/services/dashboard.service";

export function DashboardContent() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    DashboardService.getDashboardData()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed">
        <span className="text-muted-foreground">
          Carregando dados do servidor...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-destructive bg-destructive/10">
        <span className="text-destructive font-medium">
          Erro ao carregar os dados: {error}
        </span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (!data.figura || !data.kpis) {
    return (
      <div className="flex flex-col h-64 items-center justify-center rounded-xl border border-destructive bg-destructive/10 p-6 text-center">
        <span className="text-destructive font-bold mb-2">
          Formato de dados inesperado da API!
        </span>

        <span className="text-destructive/80 text-sm">
          A API respondeu com sucesso, mas as propriedades "figura" ou "kpis"
          não foram encontradas.
        </span>

        <pre className="mt-4 text-xs bg-black/10 p-2 rounded text-left max-w-full overflow-auto">
          {JSON.stringify(data).slice(0, 300) + "..."}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <StatCards
        media={data.kpis.media}
        maior={data.kpis.maior}
        menor={data.kpis.menor}
        regiao={data.regiao}
      />

      <div className="rounded-xl border bg-card text-card-foreground shadow p-4 w-full h-[550px] flex justify-center">
        <Plot
          data={data.figura.data}
          layout={{
            ...data.figura.layout,
            autosize: true,
            margin: { t: 40, r: 20, l: 40, b: 120 },
          }}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </div>

    </div>
  );
}