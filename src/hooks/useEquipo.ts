import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { cargarEquipo } from "@/src/services/equipoService";
import { mensajeAmigable } from "@/src/services/pokemonService";
import type { EquipoItem } from "@/src/types";

type EquipoState = {
  equipo: EquipoItem[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
};

export function useEquipo(): EquipoState {
  const [equipo, setEquipo] = useState<EquipoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      setEquipo(await cargarEquipo());
    } catch (caught) {
      setError(mensajeAmigable(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void recargar();
    }, [recargar]),
  );

  return { equipo, loading, error, recargar };
}
