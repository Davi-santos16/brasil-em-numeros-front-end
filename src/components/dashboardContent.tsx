import { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { BrazilMap } from './brazilMap';
import { Filtros } from './filtros';
import { StatCards } from './statCards';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardService } from '@/services/dashboard.service';
import type { DashboardResponse } from '@/services/dashboard.service';
import { IndicadoresService } from '@/services/indicadores.service';
import type { IndicadoresResponse } from '@/services/indicadores.service';
import { api } from '@/lib/api';
import { EstadoCards } from './estadoCards';
import { DashboardSkeleton } from './dashboardSkeleton';

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



export function DashboardContent() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [estadoData, setEstadoData] = useState<IndicadoresResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEstado, setLoadingEstado] = useState(false);
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

  // Preparar os estados para o select (todos os estados ordenados)
  useEffect(() => {
    const sorted = [...todosEstados].sort((a, b) => a.nome.localeCompare(b.nome));
    setEstadosFiltrados(sorted);
  }, [todosEstados]);

  // Buscar dados do dashboard (Região)
  useEffect(() => {
    setLoading(true);
    DashboardService.getDashboardData({ indicador, regiao })
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [indicador, regiao]);

  // Buscar dados do Estado específico (se selecionado)
  useEffect(() => {
    if (!estado) {
      setEstadoData(null);
      return;
    }

    // Encontrar o objeto do estado usando a sigla
    const estadoObj = todosEstados.find(e => e.sigla.toLowerCase() === estado.toLowerCase());
    if (!estadoObj) return;

    // Formatar o nome para a API (ex: "São Paulo" -> "sao_paulo")
    const formattedName = estadoObj.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, '_'); // Substitui espaços por underline

    setLoadingEstado(true);
    IndicadoresService.getIndicadores({ estado: formattedName })
      .then(setEstadoData)
      .catch(console.error)
      .finally(() => setLoadingEstado(false));
  }, [estado, todosEstados]);

  if (loading) {
    return <DashboardSkeleton />;
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

  // Extrair título e insight do layout do Plotly para renderizar em HTML
  const tituloOriginal = data.figura.layout.title;
  const tituloTexto = typeof tituloOriginal === 'object' ? tituloOriginal.text : tituloOriginal;
  
  const anotacoes = data.figura.layout.annotations || [];
  const textoInsight = anotacoes.length > 0 ? anotacoes[0].text : "";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Barra superior de Filtros (ocupando toda a largura) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <Filtros 
          indicador={indicador}
          setIndicador={(val) => {
            setEstado('');
            setIndicador(val);
          }}
          regiao={regiao}
          setRegiao={(val) => {
            setEstado('');
            setRegiao(val);
          }}
          estado={estado}
          setEstado={setEstado}
          estadosFiltrados={estadosFiltrados}
        />
      </div>

      {/* Área principal: Mapa e Gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Mapa à esquerda (Agora dentro de um Quadro) */}
        <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow-sm p-6 w-full h-[650px] relative">
          {/* Título do Mapa */}
          <div className="absolute top-6 left-6 z-[400] pointer-events-none bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-gray-900 text-lg font-bold mb-1">Mapa do Brasil</h2>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#42A5F5]"></div>
                1 Clique: Seleciona a Região
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1565C0]"></div>
                2 Cliques: Seleciona o Estado
              </span>
            </div>
          </div>
          <div className="w-full h-full relative z-0">
            <BrazilMap 
              key="real-map"
              regiaoSelecionada={regiao}
              estadoSelecionado={estado}
              onRegiaoClick={(novaRegiao) => {
                setEstado(''); // Limpa o estado selecionado ao clicar na região
                setRegiao(novaRegiao);
              }}
              onEstadoClick={(novoEstado) => {
                setEstado(novoEstado);
                // A região não precisa ser alterada forçadamente, pois a UI vai focar no estado
              }}
              estadosAPI={todosEstados}
            />
          </div>
        </div>

        {/* Painel Direito (Título, Stats, Gráfico, Insight) ou Detalhes do Estado */}
        <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow-sm p-6 w-full h-[650px] flex flex-col gap-6">
          
          {estado && loadingEstado ? (
             <div className="flex flex-col gap-6 w-full h-full justify-center">
                <Skeleton className="h-8 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-[104px] w-full rounded-xl" />
                <Skeleton className="h-[104px] w-full rounded-xl" />
                <Skeleton className="h-[104px] w-full rounded-xl" />
             </div>
          ) : estado && estadoData ? (
             <EstadoCards 
               indicadores={estadoData.indicadores} 
               estadoNome={estadoData.indicadores.area.nome || estadoData.estado} 
             />
          ) : data ? (
            <>
              {/* Título Nativo em React */}
              <div className="flex flex-col">
                 <h2 className="text-gray-900 text-xl font-bold" dangerouslySetInnerHTML={{ __html: tituloTexto || '' }}></h2>
              </div>

              {/* Cards de KPI */}
              <StatCards 
                media={data.kpis.media}
                maior={data.kpis.maior}
                menor={data.kpis.menor}
                regiao={regiao}
              />

              {/* Gráfico do Plotly (Limpo: sem título ou anotação nativa) */}
              <div className="flex-1 min-h-0 relative">
                <Plot
                  data={data.figura.data}
                  layout={{
                    ...data.figura.layout,
                    autosize: true,
                    margin: { t: 40, r: 20, l: 40, b: 40 }, // Margem superior aumentada para acomodar a toolbar
                    title: null, // Desabilita título nativo
                    annotations: [] // Desabilita anotações nativas
                  }}
                  config={{
                    displayModeBar: true,
                    displaylogo: false,
                    responsive: true
                  }}
                  useResizeHandler
                  style={{ width: "100%", height: "100%", position: "absolute" }}
                />
              </div>

              {/* Anotação/Insight Nativa em React */}
              {textoInsight && (
                <div className="rounded-lg bg-gray-50/80 p-4 text-sm text-gray-700 mt-auto">
                  <span dangerouslySetInnerHTML={{ __html: textoInsight }} />
                </div>
              )}
            </>
          ) : (
             <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
               Nenhum dado encontrado para a região selecionada.
             </div>
          )}

        </div>
      </div>
    </div>
  );
}