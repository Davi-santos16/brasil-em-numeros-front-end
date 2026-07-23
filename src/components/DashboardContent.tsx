import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { DashboardService } from '@/services/dashboard.service';
import type { DashboardResponse } from '@/services/dashboard.service';

export function DashboardContent() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    DashboardService.getDashboardData()
      .then(setData)
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed">
        <span className="text-muted-foreground">Carregando dados do servidor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-destructive bg-destructive/10">
        <span className="text-destructive font-medium">Erro ao carregar os dados: {error}</span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground mb-1">
            Média ({data.regiao})
          </h3>
          <p className="text-2xl font-bold">{data.kpis.media.toFixed(2)}</p>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground mb-1">
            Maior ({data.kpis.maior.nome})
          </h3>
          <p className="text-2xl font-bold text-emerald-600">{data.kpis.maior.valor}</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
          <h3 className="tracking-tight text-sm font-medium text-muted-foreground mb-1">
            Menor ({data.kpis.menor.nome})
          </h3>
          <p className="text-2xl font-bold text-rose-600">{data.kpis.menor.valor}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-4 w-full h-[550px] flex justify-center">
        <Plot
          data={data.figura.data}
          layout={{
            ...data.figura.layout,
            autosize: true,
            margin: { t: 40, r: 20, l: 40, b: 120 },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
