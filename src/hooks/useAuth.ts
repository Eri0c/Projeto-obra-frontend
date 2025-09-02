import { useEffect, useState, useCallback } from "react";
import { authService } from "@/services/authService";

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // carrega user do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // login
  const login = useCallback(async (credentials: any) => {
    setLoading(true); // Set loading to true at the start of login
    try {
      const { user } = await authService.login(credentials);
      setUser(user);
      return user;
    } finally {
      setLoading(false); // Set loading to false after login attempt (success or failure)
    }
  }, []);

  // logout
  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };
}
