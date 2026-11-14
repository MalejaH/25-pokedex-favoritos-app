import type { PokemonListItem } from "@/src/types";

export function mergeUnique(
  existing: PokemonListItem[],
  incoming: PokemonListItem[],
): PokemonListItem[] {
  const seen = new Set<number>();
  const merged: PokemonListItem[] = [];
  for (const item of [...existing, ...incoming]) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    merged.push(item);
  }
  return merged;
}

export function siguientePagina(
  offset: number,
  recibidos: number,
  limite: number,
  total: number,
): number | null {
  const siguiente = offset + limite;
  if (recibidos === 0 || siguiente >= total) {
    return null;
  }
  return siguiente;
}
