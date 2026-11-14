import { useCallback } from "react";
import type { ListRenderItem } from "react-native";
import { FavoritoCard } from "@/src/components/FavoritoCard";
import type { Favorito } from "@/src/types";

export function useFavoritoRenderer(
  abrir: (pokemonId: number) => void,
  quitar: (pokemonId: number) => Promise<void>,
): ListRenderItem<Favorito> {
  return useCallback(
    ({ item }) => (
      <FavoritoCard
        favorito={item}
        onAbrir={() => abrir(item.pokemon_id)}
        onQuitar={() => {
          void quitar(item.pokemon_id);
        }}
      />
    ),
    [abrir, quitar],
  );
}
