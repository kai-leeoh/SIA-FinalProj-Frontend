import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";

interface AuthContextType {
  token: string | null;
  user: { email: string } | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null));
    } else {
      localStorage.removeItem("access_token");
      setUser(null);
    }
  }, [token]);

  const setToken = (newToken: string) => setTokenState(newToken);
  const logout = () => setTokenState(null);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: !!token, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
