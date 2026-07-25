import { api } from '@/lib/api';

export interface IndicadorValor {
  nome: string;
  valor: number;
  regiao: string;
}

export interface Indicadores {
  area: IndicadorValor;
  densidade: IndicadorValor;
  populacao: IndicadorValor;
}

export interface IndicadoresResponse {
  estado: string;
  indicadores: Indicadores;
}

export interface IndicadoresParams {
  estado: string;
}

export const IndicadoresService = {
  async getIndicadores(params: IndicadoresParams): Promise<IndicadoresResponse> {
    const response = await api.get<IndicadoresResponse>('/indicadores', {
      params: {
        estado: params.estado,
      },
    });
    return response.data;
  },
};
