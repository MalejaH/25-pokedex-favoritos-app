export const MAX_EQUIPO = 6;

export type ResultadoEquipo =
  { ok: true; ids: number[] } | { ok: false; motivo: "maximo" | "repetido"; mensaje: string };

export function agregarAlEquipo(actual: number[], pokemonId: number): ResultadoEquipo {
  if (actual.includes(pokemonId)) {
    return {
      ok: false,
      motivo: "repetido",
      mensaje: "Ese Pokémon ya está en tu equipo.",
    };
  }
  if (actual.length >= MAX_EQUIPO) {
    return {
      ok: false,
      motivo: "maximo",
      mensaje: "El equipo admite máximo 6 Pokémon. Quita uno para agregar otro.",
    };
  }
  return { ok: true, ids: [...actual, pokemonId] };
}

export function quitarDelEquipo(actual: number[], pokemonId: number): number[] {
  return actual.filter((id) => id !== pokemonId);
}
