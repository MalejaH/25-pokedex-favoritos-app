import { ApiError, apiRequest } from "@/src/api/client";
import {
  getPokemonById,
  savePokemon,
  searchLocalPokemons,
} from "@/src/repositories/pokemonRepository";
import type { PokemonDetail, PokemonPage } from "@/src/types";

export const PAGE_SIZE = 20;
export const MAX_POKEMON_ID = 1025;

function mensajeDeApi(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return "Pokémon no encontrado.";
    }
    if (error.status === 429) {
      return "Demasiadas solicitudes. Espera unos segundos e inténtalo de nuevo.";
    }
    if (error.status === 401) {
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    }
    return error.message;
  }
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.";
}

export function mensajeAmigable(error: unknown): string {
  return mensajeDeApi(error);
}

export async function loadPokemonPage(offset: number, query: string): Promise<PokemonPage> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(PAGE_SIZE),
  });
  if (query.trim().length > 0) {
    params.set("q", query.trim());
  }
  try {
    return await apiRequest<PokemonPage>(`/api/pokemon?${params.toString()}`);
  } catch (error) {
    const local = await searchLocalPokemons(query, PAGE_SIZE);
    if (local.length > 0) {
      return {
        items: local,
        total: local.length,
        offset: 0,
        limit: PAGE_SIZE,
        siguiente: null,
        offline: true,
      };
    }
    throw new Error(mensajeDeApi(error));
  }
}

export async function loadPokemonDetail(id: number): Promise<PokemonDetail> {
  const cached = await getPokemonById(id);
  if (cached !== null) {
    return cached;
  }
  try {
    const detail = await apiRequest<PokemonDetail>(`/api/pokemon/${id}`);
    await savePokemon(detail);
    return detail;
  } catch (error) {
    throw new Error(mensajeDeApi(error));
  }
}

export async function refreshPokemonDetail(id: number): Promise<PokemonDetail> {
  try {
    const detail = await apiRequest<PokemonDetail>(`/api/pokemon/${id}`);
    await savePokemon(detail);
    return detail;
  } catch (error) {
    throw new Error(mensajeDeApi(error));
  }
}

export function randomPokemonId(): number {
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}
