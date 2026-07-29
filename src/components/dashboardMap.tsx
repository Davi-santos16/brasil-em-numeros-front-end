import { MapaBrasil } from './brazilMap';
import type { Estado } from '@/services/estados.service';

interface PropriedadesMapaPainel {
  regiao: string;
  estado: string;
  estados: Estado[];
  aoSelecionarRegiao: (regiao: string) => void;
  aoSelecionarEstado: (estado: string) => void;
}

export function MapaPainel({
  regiao,
  estado,
  estados,
  aoSelecionarRegiao,
  aoSelecionarEstado,
}: PropriedadesMapaPainel) {
  return (
    <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow-sm p-6 w-full h-[400px] lg:h-[650px] relative">
      <div className="absolute top-6 left-6 z-[400] pointer-events-none bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-gray-900 text-lg font-bold mb-1">Mapa do Brasil</h2>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#42A5F5]" />
            1 Clique: Seleciona a Região
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
            2 Cliques: Seleciona o Estado
          </span>
        </div>
      </div>

      <div className="w-full h-full relative z-0">
        <MapaBrasil
          regiaoSelecionada={regiao}
          estadoSelecionado={estado}
          aoClicarRegiao={aoSelecionarRegiao}
          aoClicarEstado={aoSelecionarEstado}
          estadosApi={estados}
        />
      </div>
    </div>
  );
}
