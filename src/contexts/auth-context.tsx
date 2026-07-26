"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { authApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  register: (
    name: string,
    email: string,
    role: "ADMIN" | "MANAGER" | "MEMBER",
    department?: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  // Check existing token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      console.log(token)
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await authApi.profile();

        setUser(user);
      } catch (error) {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const data = await authApi.login({
        email,
        password,
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    role: "ADMIN" | "MANAGER" | "MEMBER",
    department?: string,
  ) => {
    setIsLoading(true);

    try {
      const data = await authApi.register({
        name,
        email,
        role,
        department: department ?? "",
      });

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");

    setUser(null);

    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
