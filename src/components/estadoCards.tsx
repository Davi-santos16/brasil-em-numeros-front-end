import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface IndicadorValor {
  nome: string;
  valor: number;
  regiao: string;
}

interface Indicadores {
  area: IndicadorValor;
  densidade: IndicadorValor;
  populacao: IndicadorValor;
}

interface EstadoCardsProps {
  indicadores: Indicadores;
  estadoNome: string;
}

export function EstadoCards({ indicadores, estadoNome }: EstadoCardsProps) {
  const cards = [
    {
      title: "População",
      value: indicadores.populacao.valor.toLocaleString("pt-BR"),
      description: "Habitantes",
    },
    {
      title: "Área",
      value: `${indicadores.area.valor.toLocaleString("pt-BR")} km²`,
      description: "Extensão",
    },
    {
      title: "Densidade",
      value: `${indicadores.densidade.valor.toLocaleString("pt-BR")} hab/km²`,
      description: "Demográfica",
    },
  ];

  // Valores reais para exibir no tooltip
  const realValues = [
    indicadores.densidade.valor,
    indicadores.area.valor,
    indicadores.populacao.valor,
  ];

  const minValue = Math.min(...realValues);
  const maxValue = Math.max(...realValues);
  const customColors = realValues.map(v => {
    if (v === minValue) return '#94A3B8'; // Menor: Cinza
    if (v === maxValue) return '#1565C0'; // Maior: Azul 1
    return '#42A5F5'; // Médio: Azul 3
  });

  // Aplicamos Log10 para as fatias ficarem visíveis e proporcionais visualmente
  // (já que população é milhões e densidade é dezenas)
  const chartSeries = [
    Math.max(1, Math.log10(indicadores.densidade.valor)),
    Math.max(1, Math.log10(indicadores.area.valor)),
    Math.max(1, Math.log10(indicadores.populacao.valor)),
  ];

  const chartOptions: ApexOptions = {
    chart: {
      type: "polarArea",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
    },
    labels: ["Densidade", "Área", "População"],
    fill: {
      opacity: 1,
    },
    stroke: {
      width: 2,
      colors: ["#ffffff"],
    },
    yaxis: {
      show: false,
    },
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      markers: {
        size: 6,
      },
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0,
        },
        spokes: {
          strokeWidth: 0,
        },
      },
    },
    colors: customColors,
    theme: {
      monochrome: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        // Pega o valor real de volta para mostrar para o usuário
        formatter: function (_val, opts) {
          if (!opts) return "";
          const index = opts.seriesIndex;
          const realValue = realValues[index];
          if (index === 0) return `${realValue.toLocaleString("pt-BR")} hab/km²`;
          if (index === 1) return `${realValue.toLocaleString("pt-BR")} km²`;
          return `${realValue.toLocaleString("pt-BR")} hab.`;
        },
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{estadoNome}</h3>
        <p className="text-sm text-muted-foreground">
          Visão detalhada dos indicadores estaduais
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card shadow-sm p-4 flex flex-col justify-center h-[104px]"
          >
            <h3 className="tracking-tight text-xs font-medium text-muted-foreground mb-1">
              {card.title} ({card.description})
            </h3>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Gráfico Polar Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white border rounded-xl shadow-sm p-4 items-center justify-center">
        <h4 className="text-sm font-bold text-gray-900 mb-2 self-start w-full text-center">
          Proporção das Métricas
        </h4>
        <div className="w-full h-full min-h-[300px] flex items-center justify-center">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="polarArea"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}
