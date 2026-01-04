import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, type ApiUser } from '../lib/api';

type AuthState = {
  user: ApiUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/me');
      setUser((data as any).user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo(() => ({ user, loading, refresh }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
