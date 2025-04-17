"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { username: string; roles: string[] } | null; // Add user to context type
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    username: string;
    roles: string[];
  } | null>(null);

  useEffect(() => {
    console.log("AuthProvider useEffect triggered");
    if (typeof window !== "undefined") {
      console.log("Running in the browser");
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        console.log("Token and user found in localStorage");
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        console.log("No token or user found in localStorage");
        setIsAuthenticated(false);
      }
    } else {
      console.log("Running on the server");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }, []);

  const login = async (login: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { login, password });
      const { token, username, roles } = response.data;

      // Store token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username, roles }));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.Authorization;
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <p>Loading...</p>; // Or a spinner component
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user, // Expose user data
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
