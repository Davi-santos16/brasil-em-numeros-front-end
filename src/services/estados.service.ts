import { api } from '@/lib/api';

export interface Regiao {
  id: number;
  sigla: string;
  nome: string;
}

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}

export interface EstadosResponse {
  estados: Estado[];
}

export const EstadosService = {
  async getEstados(): Promise<EstadosResponse> {
    const response = await api.get<EstadosResponse>('/estados');
    return response.data;
  },
};
