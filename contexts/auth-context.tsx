"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

// Atualizar a interface User para corresponder à entidade do backend
interface User {
  id: number;
  login: string;
  name: string;
  email: string;
  role: UserRole;
}

// Adicionar o enum UserRole
enum UserRole {
  USER = 0,
  ADMIN = 1,
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;

      const fetchUser = async () => {
        try {
          // Call the /auth/me endpoint to fetch the current user
          const response = await api.get("/auth/me");
          setUser(response.data); // Set the user data from the response
        } catch (error: any) {
          console.error("Erro ao carregar usuário:", error);

          // Handle unauthorized or other errors
          if (error.response && error.response.status === 401) {
            console.warn("Usuário não autenticado, limpando dados locais.");
          }

          // Clear localStorage and authorization header if the fetch fails
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete api.defaults.headers.Authorization;
        } finally {
          setIsLoading(false); // Stop the loading state
        }
      };

      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Atualizar a função de login para incluir o campo login
  const login = async (login: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { login, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      return user;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  // Atualizar a função de registro para incluir validações e adequar ao RegisterDTO
  const register = async (name: string, email: string, password: string) => {
    try {
      // Trim input values
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      // Validate required fields
      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        throw new Error("Todos os campos são obrigatórios");
      }

      // Validate empty fields
      if (trimmedName === "" || trimmedEmail === "" || trimmedPassword === "") {
        throw new Error("Os campos não podem estar vazios");
      }

      // Validate email format
      if (!trimmedEmail.match(/^[A-Za-z0-9+_.-]+@(.+)$/)) {
        throw new Error("Formato de email inválido");
      }

      // Validate password strength
      if (!trimmedPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
        throw new Error(
          "A senha deve ter pelo menos 8 caracteres, incluindo uma letra e um número"
        );
      }

      // Create login based on email (before the @)
      const login = trimmedEmail.split("@")[0];

      // Send data to the register endpoint
      const response = await api.post("/auth/register", {
        login,
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      console.log("Usuário registrado com sucesso:", response.data);
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.error("Erro ao registrar:", error.response.data);
        throw new Error(error.response.data);
      } else {
        console.error("Erro inesperado ao registrar:", error);
        throw new Error("Erro inesperado ao registrar");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
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
