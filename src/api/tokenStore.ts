import * as SecureStore from "expo-secure-store";
import type { Session } from "@/src/types";

const STORAGE_KEY = "pokedex.sesion";

let cachedSession: Session | null = null;

type SessionListener = () => void;

const listeners = new Set<SessionListener>();

export function subscribeSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySessionCleared(): void {
  for (const listener of listeners) {
    listener();
  }
}

function isSession(value: unknown): value is Session {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  const usuario = candidate["usuario"];
  return (
    typeof candidate["token"] === "string" &&
    typeof candidate["refreshToken"] === "string" &&
    typeof candidate["expiraEn"] === "number" &&
    usuario !== null &&
    typeof usuario === "object" &&
    typeof (usuario as Record<string, unknown>)["id"] === "string" &&
    typeof (usuario as Record<string, unknown>)["email"] === "string"
  );
}

export async function loadSession(): Promise<Session | null> {
  if (cachedSession !== null) {
    return cachedSession;
  }
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  if (raw === null) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isSession(parsed)) {
      cachedSession = parsed;
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export async function saveSession(session: Session): Promise<void> {
  cachedSession = session;
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  cachedSession = null;
  await SecureStore.deleteItemAsync(STORAGE_KEY);
  notifySessionCleared();
}

export async function updateTokens(
  token: string,
  refreshToken: string,
  expiraEnSegundos: number,
): Promise<void> {
  const session = await loadSession();
  if (session === null) {
    return;
  }
  const updated: Session = {
    ...session,
    token,
    refreshToken,
    expiraEn: Date.now() + expiraEnSegundos * 1000,
  };
  await saveSession(updated);
}
