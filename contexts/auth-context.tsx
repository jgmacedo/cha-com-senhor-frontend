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
  register: (name: string, login: string, email: string, password: string) => Promise<void>;
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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          api.defaults.headers.Authorization = `Bearer ${token}`;
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
    }
    setIsLoading(false);
  }, []);

  const login = async (login: string, password: string) => {
    console.log("auth-context login - NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("auth-context login - api.defaults.baseURL:", api.defaults.baseURL);
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

  const register = async (name: string, login: string, email: string, password: string) => {
    try {
      // Prepare the payload with the correct field names and values
      const payload = {
        name,    // User's full name
        login,   // User's login/username
        email,   // User's email address
        password // User's password
      };

      // Send the POST request to the backend
      const response = await api.post("/auth/register", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response status is not 200 (success)
      if (response.status !== 200) {
        throw new Error(response.data || "Failed to register");
      }

      // Optionally, handle success (e.g., show a success message)
      console.log("User registered successfully:", response.data);
    } catch (error: any) {
      // Log the error and rethrow it for the caller to handle
      console.error("Erro ao registrar:", error.response?.data || error.message);
      throw new Error(error.response?.data || "Erro ao registrar");
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
