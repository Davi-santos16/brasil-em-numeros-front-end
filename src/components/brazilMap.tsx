import { useMemo, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import brazilStatesData from '@/assets/brazil-states.json';

interface BrazilMapProps {
  regiaoSelecionada?: string;
  estadoSelecionado?: string | null;
  onRegiaoClick?: (regiao: string) => void;
  onEstadoClick?: (estado: string) => void;
  estadosAPI?: any[];
}

export function BrazilMap({ regiaoSelecionada, estadoSelecionado, onRegiaoClick, onEstadoClick, estadosAPI = [] }: BrazilMapProps) {
  const geojsonData = brazilStatesData as any;
  const layersRef = useRef<Record<string, L.Layer>>({});

  // Bounding Box do Brasil
  const brazilBounds: L.LatLngBoundsExpression = [
    [5.2718, -73.983],
    [-33.75, -34.793]
  ];

  // Mapeia sigla do estado -> região (em lowercase)
  const stateToRegion = useMemo(() => {
    const map: Record<string, string> = {};
    estadosAPI.forEach((est) => {
      map[est.sigla.toLowerCase()] = est.regiao.nome.toLowerCase();
    });
    return map;
  }, [estadosAPI]);

  // Função para atualizar as cores de todos os polígonos
  const applyColors = (hoveredRegiao: string | null = null, hoveredEstado: string | null = null) => {
    Object.entries(layersRef.current).forEach(([sigla, layer]) => {
      const regiaoDoEstado = stateToRegion[sigla];
      if (!regiaoDoEstado) return;

      const isStateHovered = hoveredEstado === sigla;
      const isStateSelected = estadoSelecionado?.toLowerCase() === sigla;
      const isRegionHovered = hoveredRegiao === regiaoDoEstado;
      const isRegionSelected = regiaoSelecionada?.toLowerCase() === regiaoDoEstado;

      const l = layer as L.Path;
      
      // Estado sobreposto ou selecionado tem a cor mais escura
      if (isStateHovered || isStateSelected) {
        l.setStyle({ fillColor: '#1565C0' }); // Blue 1
        l.bringToFront();
      } 
      // Região sobreposta ou selecionada tem a cor destaque original
      else if (isRegionHovered || isRegionSelected) {
        l.setStyle({ fillColor: '#42A5F5' }); // Blue 3
        if (isRegionHovered) l.bringToFront();
      } 
      // Cor padrão
      else {
        l.setStyle({ fillColor: '#E2E8F0' }); // Cinza claro
      }
    });
  };

  // Quando a região ou estado muda, re-aplicamos as cores
  useEffect(() => {
    applyColors();
  }, [regiaoSelecionada, estadoSelecionado, stateToRegion]);

  const styleFeature = (feature: any) => {
    const sigla = feature.properties.sigla.toLowerCase();
    const regiaoDoEstado = stateToRegion[sigla];
    const isStateSelected = estadoSelecionado?.toLowerCase() === sigla;
    const isRegionSelected = regiaoSelecionada?.toLowerCase() === regiaoDoEstado;
    
    let color = '#E2E8F0';
    if (isStateSelected) color = '#1565C0';
    else if (isRegionSelected) color = '#42A5F5';

    return {
      fillColor: color, // Aplica a cor dinamicamente na raiz
      weight: 1, // Borda fina
      opacity: 1,
      color: '#000000', // Preto
      fillOpacity: 1,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const sigla = feature.properties.sigla.toLowerCase();
    const stateName = feature.properties.name;
    
    // Guarda a referência do layer do estado para pintarmos depois
    layersRef.current[sigla] = layer;

    // Adicionando Tooltip nativo do Leaflet
    layer.bindTooltip(`<b>${stateName}</b>`, {
      direction: 'auto',
      className: 'bg-white p-2 rounded shadow-md border border-gray-200 text-sm',
    });

    layer.on({
      mouseover: () => {
        const regiao = stateToRegion[sigla];
        if (regiao) applyColors(regiao, sigla); // Passa região e estado para o hover
      },
      mouseout: () => {
        applyColors(null, null); // Volta ao estado original
      },
      click: () => {
        const regiao = stateToRegion[sigla];
        if (regiao && onRegiaoClick) {
          onRegiaoClick(regiao);
        }
      },
      dblclick: () => {
        if (onEstadoClick) {
          onEstadoClick(sigla);
        }
      },
    });
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-transparent z-0">
      <MapContainer
        bounds={brazilBounds}
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
          data={geojsonData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}
