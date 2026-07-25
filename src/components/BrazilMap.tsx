import React, { useMemo, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import brazilStatesData from '@/assets/brazil-states.json';

interface BrazilMapProps {
  regiaoSelecionada?: string;
  onRegiaoClick?: (regiao: string) => void;
  estadosAPI?: any[];
}

export function BrazilMap({ regiaoSelecionada, onRegiaoClick, estadosAPI = [] }: BrazilMapProps) {
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
  const applyColors = (hoveredRegiao: string | null = null) => {
    Object.entries(layersRef.current).forEach(([sigla, layer]) => {
      const regiaoDoEstado = stateToRegion[sigla];
      if (!regiaoDoEstado) return;

      const isHovered = hoveredRegiao === regiaoDoEstado;
      const isSelected = regiaoSelecionada?.toLowerCase() === regiaoDoEstado;

      const l = layer as L.Path;
      if (isHovered || isSelected) {
        l.setStyle({ fillColor: '#0396A6' });
        if (isHovered) l.bringToFront();
      } else {
        l.setStyle({ fillColor: '#E2E8F0' });
      }
    });
  };

  // Quando a região selecionada muda (ou o mapa de estados chega), re-aplicamos as cores
  useEffect(() => {
    applyColors();
  }, [regiaoSelecionada, stateToRegion]);

  const styleFeature = (feature: any) => {
    const sigla = feature.properties.sigla.toLowerCase();
    const regiaoDoEstado = stateToRegion[sigla];
    const isSelected = regiaoSelecionada?.toLowerCase() === regiaoDoEstado;
    
    return {
      fillColor: isSelected ? '#0396A6' : '#E2E8F0', // Aplica a cor dinamicamente na raiz
      weight: 1, // Borda fina
      opacity: 1,
      color: '#012340', // Marinho profundo
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
        if (regiao) applyColors(regiao); // Acende todos da região
      },
      mouseout: () => {
        applyColors(null); // Volta ao estado original (selecionado ou padrão)
      },
      click: () => {
        const regiao = stateToRegion[sigla];
        if (regiao && onRegiaoClick) {
          onRegiaoClick(regiao);
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
