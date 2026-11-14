import { useCallback } from "react";
import type { ListRenderItem } from "react-native";
import { PokemonCard } from "@/src/components/PokemonCard";
import type { PokemonListItem } from "@/src/types";

export function usePokemonRenderer(
  favoritos: Set<number>,
  alternar: (pokemonId: number) => Promise<boolean>,
  agregarEquipo: (pokemonId: number) => Promise<void>,
  abrir: (pokemonId: number) => void,
): ListRenderItem<PokemonListItem> {
  return useCallback(
    ({ item }) => (
      <PokemonCard
        pokemon={item}
        esFavorito={favoritos.has(item.id)}
        onAbrir={() => abrir(item.id)}
        onFavorito={() => {
          void alternar(item.id);
        }}
        onEquipo={() => {
          void agregarEquipo(item.id);
        }}
      />
    ),
    [abrir, agregarEquipo, alternar, favoritos],
  );
}
