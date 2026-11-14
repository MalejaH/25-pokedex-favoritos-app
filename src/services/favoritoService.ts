import {
  addFavorito,
  isFavorito,
  listFavoritos,
  removeFavorito,
} from "@/src/repositories/favoritoRepository";
import { savePokemon } from "@/src/repositories/pokemonRepository";
import type { Favorito } from "@/src/types";
import { loadPokemonDetail } from "./pokemonService";

export async function toggleFavorito(pokemonId: number): Promise<boolean> {
  const exists = await isFavorito(pokemonId);
  if (exists) {
    await removeFavorito(pokemonId);
    return false;
  }
  try {
    const detail = await loadPokemonDetail(pokemonId);
    await savePokemon(detail);
  } catch {
    // El favorito se guarda igual; la ficha se completará al recuperar conexión.
  }
  await addFavorito(pokemonId);
  return true;
}

export async function cargarFavoritos(): Promise<Favorito[]> {
  return listFavoritos();
}
