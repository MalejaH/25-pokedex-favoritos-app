import { useCallback, useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { listFavoritoIds } from "@/src/repositories/favoritoRepository";
import { toggleFavorito } from "@/src/services/favoritoService";

type FavoritosState = {
  favoritos: Set<number>;
  alternar: (pokemonId: number) => Promise<boolean>;
  recargar: () => Promise<void>;
};

export function useFavoritoIds(): FavoritosState {
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());

  const recargar = useCallback(async (): Promise<void> => {
    try {
      const ids = await listFavoritoIds();
      setFavoritos(new Set(ids));
    } catch {
      setFavoritos(new Set());
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const alternar = useCallback(async (pokemonId: number): Promise<boolean> => {
    const activo = await toggleFavorito(pokemonId);
    setFavoritos((previous) => {
      const next = new Set(previous);
      if (activo) {
        next.add(pokemonId);
      } else {
        next.delete(pokemonId);
      }
      return next;
    });
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // La app funciona igual en dispositivos sin háptica.
    }
    return activo;
  }, []);

  return { favoritos, alternar, recargar };
}
