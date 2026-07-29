type PropriedadesCartoesEstatisticas = {
  media: number;
  maior: {
    nome: string;
    valor: number;
  };
  menor: {
    nome: string;
    valor: number;
  };
  regiao: string;
};

export function CartoesEstatisticas({
  media,
  maior,
  menor,
  regiao,
}: PropriedadesCartoesEstatisticas) {
  const formatarNumero = (numero: number) => {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(numero);
  };

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
      <div className="rounded-xl border bg-card shadow-sm p-4 flex flex-col justify-center h-[104px]">
        <h3 className="tracking-tight text-xs font-medium text-muted-foreground mb-1">
          Média ({regiao})
        </h3>
        <p className="text-xl font-bold text-gray-900">{formatarNumero(media)}</p>
      </div>
      
      <div className="rounded-xl border bg-card shadow-sm p-4 flex flex-col justify-center h-[104px]">
        <h3 className="tracking-tight text-xs font-medium text-muted-foreground mb-1">
          Maior ({maior.nome})
        </h3>
        <p className="text-xl font-bold text-gray-900">{formatarNumero(maior.valor)}</p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm p-4 flex flex-col justify-center h-[104px]">
        <h3 className="tracking-tight text-xs font-medium text-muted-foreground mb-1">
          Menor ({menor.nome})
        </h3>
        <p className="text-xl font-bold text-gray-900">{formatarNumero(menor.valor)}</p>
      </div>
    </div>
  );
}
