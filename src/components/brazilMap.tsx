import { useMemo, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import brazilStatesData from '@/assets/brazil-states.json';

interface PropriedadesMapaBrasil {
  regiaoSelecionada?: string;
  estadoSelecionado?: string | null;
  aoClicarRegiao?: (regiao: string) => void;
  aoClicarEstado?: (estado: string) => void;
  estadosApi?: any[];
}

export function MapaBrasil({ regiaoSelecionada, estadoSelecionado, aoClicarRegiao, aoClicarEstado, estadosApi = [] }: PropriedadesMapaBrasil) {
  const dadosGeoJson = brazilStatesData as any;
  const referenciaCamadas = useRef<Record<string, L.Layer>>({});

  const fecharTodosTooltips = () => {
    Object.values(referenciaCamadas.current).forEach((camada) => {
      camada.closeTooltip();
    });
  };

  // Bounding Box do Brasil
  const limitesBrasil: L.LatLngBoundsExpression = [
    [5.2718, -73.983],
    [-33.75, -34.793]
  ];

  const estadoParaRegiao = useMemo(() => {
    const mapa: Record<string, string> = {};
    estadosApi.forEach((estado) => {
      mapa[estado.sigla.toLowerCase()] = estado.regiao.nome.toLowerCase();
    });
    return mapa;
  }, [estadosApi]);

  // Ref para armazenar os valores mais recentes das props e evitar bugs de closure nos eventos do Leaflet
  const referenciaPropriedades = useRef({
    regiaoSelecionada,
    estadoSelecionado,
    estadoParaRegiao,
    aoClicarRegiao,
    aoClicarEstado,
  });
  useEffect(() => {
    referenciaPropriedades.current = {
      regiaoSelecionada,
      estadoSelecionado,
      estadoParaRegiao,
      aoClicarRegiao,
      aoClicarEstado,
    };
  }, [
    regiaoSelecionada,
    estadoSelecionado,
    estadoParaRegiao,
    aoClicarRegiao,
    aoClicarEstado,
  ]);

  // Função para atualizar as cores de todos os polígonos
  const aplicarCores = (regiaoSobCursor: string | null = null, estadoSobCursor: string | null = null) => {
    const propriedadesAtuais = referenciaPropriedades.current;
    
    Object.entries(referenciaCamadas.current).forEach(([sigla, camada]) => {
      const regiaoDoEstado = propriedadesAtuais.estadoParaRegiao[sigla];
      if (!regiaoDoEstado) return;

      const estadoEstaSobCursor = estadoSobCursor === sigla;
      const estadoEstaSelecionado = propriedadesAtuais.estadoSelecionado?.toLowerCase() === sigla;
      const regiaoEstaSobCursor = regiaoSobCursor === regiaoDoEstado;
      const regiaoEstaSelecionada = propriedadesAtuais.regiaoSelecionada?.toLowerCase() === regiaoDoEstado;

      const caminho = camada as L.Path;
      
      // Estado sobreposto ou selecionado tem a cor mais escura
      if (estadoEstaSobCursor || estadoEstaSelecionado) {
        caminho.setStyle({ fillColor: '#1565C0' });
      } 
      // Região sobreposta ou selecionada tem a cor destaque original
      else if (regiaoEstaSobCursor || regiaoEstaSelecionada) {
        caminho.setStyle({ fillColor: '#42A5F5' });
      } 
      // Cor padrão
      else {
        caminho.setStyle({ fillColor: '#E2E8F0' });
      }
    });
  };

  // Quando a região ou estado muda, re-aplicamos as cores
  useEffect(() => {
    aplicarCores();
  }, [regiaoSelecionada, estadoSelecionado, estadoParaRegiao]);

  const estilizarElemento = (feature: any) => {
    const sigla = feature.properties.sigla.toLowerCase();
    const regiaoDoEstado = estadoParaRegiao[sigla];
    const estadoEstaSelecionado = estadoSelecionado?.toLowerCase() === sigla;
    const regiaoEstaSelecionada = regiaoSelecionada?.toLowerCase() === regiaoDoEstado;
    
    let cor = '#E2E8F0';
    if (estadoEstaSelecionado) cor = '#1565C0';
    else if (regiaoEstaSelecionada) cor = '#42A5F5';

    return {
      fillColor: cor,
      weight: 1, // Borda fina
      opacity: 1,
      color: '#000000', // Preto
      fillOpacity: 1,
    };
  };

  const configurarElemento = (elemento: any, camada: L.Layer) => {
    const sigla = elemento.properties.sigla.toLowerCase();
    const nomeEstado = elemento.properties.name;
    
    // Guarda a referência do layer do estado para pintarmos depois
    referenciaCamadas.current[sigla] = camada;

    // Adicionando Tooltip nativo do Leaflet
    camada.bindTooltip(`<b>${nomeEstado}</b>`, {
      direction: 'auto',
      className: 'bg-white p-2 rounded shadow-md border border-gray-200 text-sm',
      interactive: false,
      sticky: false,
    });

    camada.on({
      mouseover: () => {
        // Mantemos apenas um tooltip aberto durante a troca entre estados.
        fecharTodosTooltips();
        camada.openTooltip();

        const regiao = referenciaPropriedades.current.estadoParaRegiao[sigla];
        if (regiao) aplicarCores(regiao, sigla); // Passa região e estado para o hover
      },
      mouseout: () => {
        camada.closeTooltip();
        aplicarCores(null, null); // Volta ao estado original
      },
      click: () => {
        const { estadoParaRegiao: mapaRegioes, aoClicarRegiao: clicarRegiao } =
          referenciaPropriedades.current;
        const regiao = mapaRegioes[sigla];
        if (regiao && clicarRegiao) {
          clicarRegiao(regiao);
        }
      },
      dblclick: () => {
        const clicarEstado = referenciaPropriedades.current.aoClicarEstado;
        if (clicarEstado) {
          clicarEstado(sigla);
        }
      },
    });
  };

  return (
    <div
      className="mapa-brasil w-full h-full rounded-xl overflow-hidden bg-transparent z-0"
      onMouseLeave={() => {
        fecharTodosTooltips();
        aplicarCores(null, null);
      }}
    >
      <MapContainer
        bounds={limitesBrasil}
        boundsOptions={{ padding: [10, 10] }}
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <GeoJSON
          data={dadosGeoJson}
          style={estilizarElemento}
          onEachFeature={configurarElemento}
        />
      </MapContainer>
    </div>
  );
}
