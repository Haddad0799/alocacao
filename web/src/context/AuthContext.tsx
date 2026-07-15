import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { setAccessToken } from '../api/client';
import type { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await authApi.refresh().then((r) => setAccessToken(r.accessToken));
        const me = await authApi.me();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { accessToken } = await authApi.login(email, password);
    setAccessToken(accessToken);
    const me = await authApi.me();
    setUser(me);
  };

  const logout = async () => {
  try {
    await authApi.logout();
  } catch {
    
  }
  setAccessToken(null);
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve estar dentro de AuthProvider');
  return ctx;
}