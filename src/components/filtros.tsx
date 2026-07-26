import { Search, ChevronDown, Globe, LandPlot } from 'lucide-react';

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface FiltrosProps {
  indicador: string;
  setIndicador: (val: string) => void;
  regiao: string;
  setRegiao: (val: string) => void;
  estado: string;
  setEstado: (val: string) => void;
  estadosFiltrados: Estado[];
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

export function Filtros({
  indicador,
  setIndicador,
  regiao,
  setRegiao,
  estado,
  setEstado,
  estadosFiltrados,
}: FiltrosProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Indicador */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <select
          value={estado ? "" : indicador}
          onChange={(e) => setIndicador(e.target.value)}
          className="w-full appearance-none rounded-lg border bg-card py-2.5 pl-9 pr-9 text-sm font-medium text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {estado && <option value="" disabled>- Selecione um indicador -</option>}
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
          value={estado ? "" : regiao}
          onChange={(e) => setRegiao(e.target.value)}
          className="w-full appearance-none rounded-lg border bg-card py-2.5 pl-9 pr-9 text-sm font-medium text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {estado && <option value="" disabled>- Selecione uma região -</option>}
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
  );
}