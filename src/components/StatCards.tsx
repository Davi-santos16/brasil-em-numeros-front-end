type StatCardsProps = {
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

const TURQUOISE = "#0396A6";
const ORANGE = "#F24822";
const NAVY = "#012340";

export function StatCards({
  media,
  maior,
  menor,
  regiao,
}: StatCardsProps) {
  const cards = [
    {
      titulo: `Média (${regiao})`,
      valor: media.toFixed(2),
      cor: TURQUOISE,
    },
    {
      titulo: `Maior (${maior.nome})`,
      valor: maior.valor,
      cor: ORANGE,
    },
    {
      titulo: `Menor (${menor.nome})`,
      valor: menor.valor,
      cor: ORANGE,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.titulo}
          className="rounded-xl bg-[#F2F2F2] p-4 shadow-sm border-t-4"
          style={{ borderTopColor: card.cor }}
        >
          <p className="text-xs text-[#012340]/60 mb-2">
            {card.titulo}
          </p>

          <p className="text-3xl font-bold text-[#012340]">
            {card.valor}
          </p>
        </div>
      ))}
    </div>
  );
}