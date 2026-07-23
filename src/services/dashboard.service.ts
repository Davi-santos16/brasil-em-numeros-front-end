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
    const response = await api.get<DashboardResponse>('/dashboard', {
      params: {
        indicador: 'densidade',
        regiao: 'norte'
      }
    });
    console.log('Dados do dashboard recebidos:', response.data);
    return response.data;
  }
}
