import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { cargarFavoritos } from "@/src/services/favoritoService";
import { mensajeAmigable } from "@/src/services/pokemonService";
import type { Favorito } from "@/src/types";

type FavoritosState = {
  favoritos: Favorito[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
};

export function useFavoritos(): FavoritosState {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      setFavoritos(await cargarFavoritos());
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

  return { favoritos, loading, error, recargar };
}
