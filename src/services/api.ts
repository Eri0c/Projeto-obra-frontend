
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Usa a variável de ambiente ou o proxy
});

// Adiciona um interceptor para incluir o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    // Obtém o token do localStorage a cada requisição
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
