import { Skeleton } from "@/components/ui/skeleton";
import { MapaBrasil } from "./brazilMap";

export function EsqueletoPainel() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      {/* Skeleton dos Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4 h-[74px] items-center">
         <Skeleton className="h-10 w-48 rounded-md" />
         <Skeleton className="h-10 w-48 rounded-md" />
      </div>

      {/* Área principal Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Skeleton do Mapa */}
        <div className="lg:col-span-1 rounded-xl border bg-card shadow-sm p-6 w-full h-[650px] relative">
          <div className="absolute top-6 left-6 z-[400] pointer-events-none">
            <Skeleton className="h-7 w-40 rounded-md mb-2" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <div className="w-full h-full relative z-0 opacity-40 grayscale pointer-events-none transition-all duration-500">
            <MapaBrasil key="skeleton-map" />
          </div>
        </div>

        {/* Skeleton do Painel Direito */}
        <div className="lg:col-span-1 rounded-xl border bg-card shadow-sm p-6 w-full h-[650px] flex flex-col gap-6 bg-white">
          {/* Título */}
          <Skeleton className="h-8 w-3/4 rounded-md" />
          
          {/* CartoesEstatisticas */}
          <div className="grid gap-4 md:grid-cols-3">
             <Skeleton className="h-[104px] rounded-xl" />
             <Skeleton className="h-[104px] rounded-xl" />
             <Skeleton className="h-[104px] rounded-xl" />
          </div>

          {/* Gráfico */}
          <Skeleton className="flex-1 rounded-xl" />

          {/* Insight */}
          <Skeleton className="h-[72px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
