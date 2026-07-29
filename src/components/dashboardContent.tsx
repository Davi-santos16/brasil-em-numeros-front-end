import { Filtros } from './filtros';
import { EsqueletoPainel } from './dashboardSkeleton';
import { MapaPainel } from './dashboardMap';
import { DetalhesPainel } from './dashboardDetails';
import { useDashboard } from '@/hooks/use-dashboard';

export function ConteudoPainel() {
  const {
    dados,
    dadosEstado,
    carregando,
    carregandoEstado,
    erro,
    indicador,
    regiao,
    estado,
    todosEstados,
    estadosFiltrados,
    selecionarIndicador,
    selecionarRegiao,
    selecionarEstado,
  } = useDashboard();

  if (carregando) {
    return <EsqueletoPainel />;
  }

  if (erro) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-destructive bg-destructive/10">
        <span className="text-destructive font-medium">
          Erro ao carregar os dados: {erro}
        </span>
      </div>
    );
  }

  if (!dados) {
    return null;
  }

  if (!dados.figura || !dados.kpis) {
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
          {JSON.stringify(dados).slice(0, 300) + '...'}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <Filtros
          indicador={indicador}
          setIndicador={selecionarIndicador}
          regiao={regiao}
          setRegiao={selecionarRegiao}
          estado={estado}
          setEstado={selecionarEstado}
          estadosFiltrados={estadosFiltrados}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
        <MapaPainel
          regiao={regiao}
          estado={estado}
          estados={todosEstados}
          aoSelecionarRegiao={selecionarRegiao}
          aoSelecionarEstado={selecionarEstado}
        />
        <DetalhesPainel
          dados={dados}
          dadosEstado={dadosEstado}
          estado={estado}
          regiao={regiao}
          carregandoEstado={carregandoEstado}
        />
      </div>
    </div>
  );
}
