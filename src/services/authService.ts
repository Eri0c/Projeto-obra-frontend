
import api from './api';
import { z } from 'zod';

// --- Zod Schemas for Validation ---
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "As senhas não correspondem",
  path: ["password_confirmation"], // campo que receberá o erro
});

// --- Type Definitions ---
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// --- Token Management ---
const TOKEN_KEY = 'auth_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// --- Authentication Service ---
export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    // Valida os dados com Zod antes de enviar
    loginSchema.parse(data);
    const response = await api.post<AuthResponse>('/login', data);
    if (response.data.access_token) {
      setToken(response.data.access_token);
    }
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Valida os dados com Zod antes de enviar
    registerSchema.parse(data);
    const response = await api.post<AuthResponse>('/register', data);
    if (response.data.access_token) {
      setToken(response.data.access_token);
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      // Notifica o backend sobre o logout
      await api.post('/logout');
    } catch (error) {
      console.error("Logout failed on server, but proceeding with client-side logout.", error);
    } finally {
      // Remove o token do localStorage independentemente da resposta do servidor
      removeToken();
    }
  },

  // Função para verificar se o usuário está autenticado
  isAuthenticated: (): boolean => {
    return getToken() !== null;
  },
};
