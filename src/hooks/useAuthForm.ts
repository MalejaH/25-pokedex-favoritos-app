import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { ApiError } from "@/src/api/client";
import { useSession } from "@/src/session/SessionProvider";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthMode = "login" | "registro";

function validarCredenciales(email: string, password: string): string | null {
  if (!EMAIL_PATTERN.test(email)) {
    return "Escribe un correo válido.";
  }
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  return null;
}

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { login, registro } = useSession();
  const router = useRouter();

  const cambiarModo = useCallback((): void => {
    setMode((actual) => (actual === "login" ? "registro" : "login"));
    setError(null);
  }, []);

  const enviar = useCallback(async (): Promise<void> => {
    const correo = email.trim().toLowerCase();
    const validationError = validarCredenciales(correo, password);
    if (validationError !== null) {
      setError(validationError);
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      if (mode === "login") {
        await login(correo, password);
      } else {
        await registro(correo, password);
      }
      router.replace("/");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "No se pudo iniciar sesión. Intenta de nuevo.",
      );
    } finally {
      setEnviando(false);
    }
  }, [email, password, mode, login, registro, router]);

  return {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    error,
    enviando,
    cambiarModo,
    enviar,
  };
}
