import Plot from 'react-plotly.js';
import { Skeleton } from '@/components/ui/skeleton';
import type { RespostaPainel } from '@/services/dashboard.service';
import type { IndicadoresResponse } from '@/services/indicadores.service';
import { CartoesEstatisticas } from './statCards';
import { EstadoCards } from './estadoCards';

interface PropriedadesDetalhesPainel {
  dados: RespostaPainel;
  dadosEstado: IndicadoresResponse | null;
  estado: string;
  regiao: string;
  carregandoEstado: boolean;
}

function CarregamentoEstado() {
  return (
    <div className="flex flex-col gap-6 w-full h-full justify-center">
      <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-[104px] w-full rounded-xl" />
      <Skeleton className="h-[104px] w-full rounded-xl" />
      <Skeleton className="h-[104px] w-full rounded-xl" />
    </div>
  );
}

export function DetalhesPainel({
  dados,
  dadosEstado,
  estado,
  regiao,
  carregandoEstado,
}: PropriedadesDetalhesPainel) {
  const tituloOriginal = dados.figura.layout.title;
  const titulo = typeof tituloOriginal === 'object' ? tituloOriginal.text : tituloOriginal;
  const anotacoes = dados.figura.layout.annotations || [];
  const textoInsight = anotacoes[0]?.text ?? '';

  return (
    <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow-sm p-6 w-full min-h-[500px] lg:h-[650px] flex flex-col gap-4 lg:gap-6 overflow-hidden">
      {estado && carregandoEstado ? (
        <CarregamentoEstado />
      ) : estado && dadosEstado ? (
        <EstadoCards
          indicadores={dadosEstado.indicadores}
          estadoNome={dadosEstado.indicadores.area.nome || dadosEstado.estado}
        />
      ) : (
        <>
          <div className="flex flex-col">
            <h2
              className="text-gray-900 text-xl font-bold"
              dangerouslySetInnerHTML={{ __html: titulo || '' }}
            />
          </div>

          <CartoesEstatisticas
            media={dados.kpis.media}
            maior={dados.kpis.maior}
            menor={dados.kpis.menor}
            regiao={regiao}
          />

          <div className="flex-1 min-h-[220px] lg:min-h-0 relative overflow-hidden">
            <Plot
              data={dados.figura.data}
              layout={{
                ...dados.figura.layout,
                autosize: true,
                margin: { t: 10, r: 90, l: 80, b: 50 },
                title: undefined,
                annotations: [],
              }}
              config={{
                displayModeBar: true,
                displaylogo: false,
                responsive: true,
                modeBarButtonsToRemove: ['select2d', 'lasso2d'],
              }}
              useResizeHandler
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </div>

          {textoInsight && (
            <div className="rounded-lg bg-gray-50/80 p-4 text-sm text-gray-700 mt-auto">
              <span dangerouslySetInnerHTML={{ __html: textoInsight }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
