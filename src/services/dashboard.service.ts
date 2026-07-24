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

export const DashboardService = {
  async getDashboardData(): Promise<DashboardResponse> {
    const response = await api.get<any>('/dashboard', {
      params: {
        indicador: 'densidade',
        regiao: 'nordeste'
      }
    });
    // Se o backend retornar dentro de 'dadosDaEquipe', extrai. Senão, usa a raiz.
    return response.data.dadosDaEquipe || response.data;
  }
}
