import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/src/api/auth";
import { clearSession, loadSession } from "@/src/api/tokenStore";
import { useSyncOnSession } from "@/src/hooks/useSyncOnSession";
import { sincronizarTodo } from "@/src/services/syncService";
import type { Session } from "@/src/types";

type SessionContextValue = {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registro: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sincronizar: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function restore(): Promise<void> {
      const stored = await loadSession();
      if (!cancelled) {
        setSession(stored);
        setLoading(false);
      }
    }
    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const sincronizar = useCallback(async (): Promise<void> => {
    try {
      await sincronizarTodo();
    } catch {
      // La sincronización es oportunista; la app sigue funcionando sin conexión.
    }
  }, []);

  useSyncOnSession(session !== null, sincronizar);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const next = await authApi.login(email, password);
    setSession(next);
  }, []);

  const registro = useCallback(async (email: string, password: string): Promise<void> => {
    const next = await authApi.registro(email, password);
    setSession(next);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await clearSession();
    setSession(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({ session, loading, login, registro, logout, sincronizar }),
    [session, loading, login, registro, logout, sincronizar],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (value === null) {
    throw new Error("useSession debe usarse dentro de SessionProvider");
  }
  return value;
}
