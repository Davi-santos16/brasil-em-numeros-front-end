import { api } from '@/lib/api';

export interface DashboardResponse {
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

export interface DashboardParams {
  indicador: string;
  regiao: string;
}

export const DashboardService = {
  async getDashboardData(params: DashboardParams): Promise<DashboardResponse> {
    const response = await api.get<any>('/dashboard', {
      params: {
        indicador: params.indicador,
        regiao: params.regiao,
      },
    });
    return response.data.dadosDaEquipe || response.data;
  },
};