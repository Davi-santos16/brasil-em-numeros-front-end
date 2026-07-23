import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Resposta para tratamento [genérico] de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na requisição à API:', error);
    return Promise.reject(error);
  }
);
