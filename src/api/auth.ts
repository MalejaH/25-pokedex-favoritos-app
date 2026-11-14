import { apiRequest } from "./client";
import { saveSession } from "./tokenStore";
import type { Session, SessionUser } from "@/src/types";

type AuthResponse = {
  token: string;
  refreshToken: string;
  expiraEnSeg: number;
  usuario: SessionUser;
};

function toSession(response: AuthResponse): Session {
  return {
    token: response.token,
    refreshToken: response.refreshToken,
    expiraEn: Date.now() + response.expiraEnSeg * 1000,
    usuario: response.usuario,
  };
}

export async function login(email: string, password: string): Promise<Session> {
  const response = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  const session = toSession(response);
  await saveSession(session);
  return session;
}

export async function registro(email: string, password: string): Promise<Session> {
  const response = await apiRequest<AuthResponse>("/api/auth/registro", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  const session = toSession(response);
  await saveSession(session);
  return session;
}
