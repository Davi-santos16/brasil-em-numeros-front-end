import { api } from '@/lib/api';

export interface RespostaPainel {
  indicador: string;
  regiao: string;
  figura: {
    data: any[];
    layout: any;
  };
  kpis: {
    total: number;
    menor: {
      nome: string;
      valor: number;
    };
    maior: {
      nome: string;
      valor: number;
    };
    media: number;
  };
}

export interface ParametrosPainel {
  indicador: string;
  regiao: string;
}

export const ServicoPainel = {
  async obterDadosPainel(parametros: ParametrosPainel): Promise<RespostaPainel> {
    const resposta = await api.get<any>('/dashboard', {
      params: {
        indicador: parametros.indicador,
        regiao: parametros.regiao,
      },
    });
    return resposta.data.dadosDaEquipe || resposta.data;
  },
};
