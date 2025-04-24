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
  user: { username: string; roles: string[] } | null;
  isAdmin: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string; roles: string[] } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user has the "ROLE_ADMIN" role
  const isAdmin = user?.roles.some((role) => role === "ROLE_ADMIN") ?? false;

  useEffect(() => {
    console.log("AuthProvider useEffect triggered");
    if (typeof window !== "undefined") {
      console.log("Running in the browser");
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          api.defaults.headers.Authorization = `Bearer ${token}`;
          console.log("User roles:", parsedUser.roles); // Debug roles
          console.log("isAdmin:", isAdmin); // Debug isAdmin
        } catch (error) {
          // If there's an error parsing the user, clear the storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      console.log("Running on the server");
    }
    setIsLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { login, password });
      const { token, user: username, roles } = response.data;

      const userData = { username, roles };

      // Save token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.Authorization;
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        isAdmin,
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
