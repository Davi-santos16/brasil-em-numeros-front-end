import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { BarChart2, ChevronDown, Globe, LandPlot } from 'lucide-react';
import { DashboardService } from '@/services/dashboard.service';
import type { DashboardResponse } from '@/services/dashboard.service';
import { api } from '@/lib/api';

interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    nome: string;
    sigla: string;
  };
}

const INDICADORES = [
  { value: 'populacao', label: 'População' },
  { value: 'densidade', label: 'Densidade' },
  { value: 'area', label: 'Área' },
];

const REGIOES = [
  { value: 'norte', label: 'Norte' },
  { value: 'nordeste', label: 'Nordeste' },
  { value: 'centro-oeste', label: 'Centro-Oeste' },
  { value: 'sudeste', label: 'Sudeste' },
  { value: 'sul', label: 'Sul' },
];

export function DashboardContent() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [indicador, setIndicador] = useState('populacao');
  const [regiao, setRegiao] = useState('sudeste');
  const [estado, setEstado] = useState('');
  
  const [todosEstados, setTodosEstados] = useState<Estado[]>([]);
  const [estadosFiltrados, setEstadosFiltrados] = useState<Estado[]>([]);

  // Buscar todos os estados da API
  useEffect(() => {
    api.get('/estados')
      .then(response => {
        setTodosEstados(response.data.estados || response.data);
      })
      .catch(err => console.error('Erro ao buscar estados:', err));
  }, []);

  // Filtrar estados quando a região mudar
  useEffect(() => {
    const filtered = todosEstados.filter(
      est => est.regiao.nome.toLowerCase() === regiao
    );
    setEstadosFiltrados(filtered);
    setEstado('');
  }, [regiao, todosEstados]);

  // Buscar dados do dashboard
  useEffect(() => {
    setLoading(true);
    DashboardService.getDashboardData({ indicador, regiao })
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [indicador, regiao, estado]);

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
      <div className="flex flex-col gap-6">
      {/* Filters Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Indicador */}
        <div className="relative">
          <BarChart2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={indicador}
            onChange={(e) => setIndicador(e.target.value)}
            className="w-full appearance-none rounded-lg border bg-card py-2.5 pl-9 pr-9 text-sm font-medium text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {INDICADORES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Região */}
        <div className="relative">
          <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            className="w-full appearance-none rounded-lg border bg-card py-2.5 pl-9 pr-9 text-sm font-medium text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {REGIOES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        {/* Terceiro select estados */}
        <div className="relative">
          <LandPlot className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full appearance-none rounded-lg border bg-card py-2.5 pl-9 pr-9 text-sm font-medium text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">- Selecione um estado</option>
            {estadosFiltrados.map((est) => (
              <option key={est.id} value={est.sigla.toLowerCase()}>
                {est.nome}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      </div>
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
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </div>

    </div>
  );
}