import type { ErrorDetail } from "@/src/types";
import { clearSession, loadSession, updateTokens } from "./tokenStore";

export class ApiError extends Error {
  public readonly status: number;
  public readonly detalles?: ErrorDetail[];

  public constructor(status: number, message: string, detalles?: ErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detalles = detalles;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  retry?: boolean;
};

type ErrorPayload = {
  error?: unknown;
  detalles?: unknown;
};

function apiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (url === undefined || url.trim().length === 0) {
    throw new ApiError(
      0,
      "Falta EXPO_PUBLIC_API_URL. Copia env.example a .env.local con la URL de tu API.",
    );
  }
  return url.replace(/\/+$/, "");
}

function parseDetails(value: unknown): ErrorDetail[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const detalles: ErrorDetail[] = [];
  for (const item of value) {
    if (item === null || typeof item !== "object") {
      continue;
    }
    const record = item as Record<string, unknown>;
    if (typeof record["campo"] === "string" && typeof record["mensaje"] === "string") {
      detalles.push({ campo: record["campo"], mensaje: record["mensaje"] });
    }
  }
  return detalles.length > 0 ? detalles : undefined;
}

async function readError(response: Response): Promise<ApiError> {
  let message = `Error ${response.status}`;
  try {
    const payload = (await response.json()) as ErrorPayload;
    if (typeof payload.error === "string" && payload.error.length > 0) {
      message = payload.error;
    }
    return new ApiError(response.status, message, parseDetails(payload.detalles));
  } catch {
    return new ApiError(response.status, message);
  }
}

async function refreshTokens(): Promise<boolean> {
  const session = await loadSession();
  if (session === null) {
    return false;
  }
  try {
    const response = await fetch(`${apiBaseUrl()}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    if (!response.ok) {
      await clearSession();
      return false;
    }
    const data = (await response.json()) as {
      token?: unknown;
      refreshToken?: unknown;
      expiraEnSeg?: unknown;
    };
    if (
      typeof data.token !== "string" ||
      typeof data.refreshToken !== "string" ||
      typeof data.expiraEnSeg !== "number"
    ) {
      await clearSession();
      return false;
    }
    await updateTokens(data.token, data.refreshToken, data.expiraEnSeg);
    return true;
  } catch {
    return false;
  }
}

async function executeRequest(
  path: string,
  options: RequestOptions,
  session: Awaited<ReturnType<typeof loadSession>>,
): Promise<Response> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (session !== null) {
    headers.Authorization = `Bearer ${session.token}`;
  }
  return fetch(`${apiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text();
  if (text.length === 0) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const session = options.auth === false ? null : await loadSession();
  const response = await executeRequest(path, options, session);

  if (response.status === 401 && options.retry !== false && session !== null) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retry: false });
    }
  }

  if (!response.ok) {
    throw await readError(response);
  }
  return parseBody<T>(response);
}
