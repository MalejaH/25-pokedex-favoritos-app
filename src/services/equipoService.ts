import { getEquipoIds, listEquipo, replaceLocalEquipo } from "@/src/repositories/equipoRepository";
import { savePokemon } from "@/src/repositories/pokemonRepository";
import type { EquipoItem } from "@/src/types";
import { agregarAlEquipo } from "./equipoRules";
import { loadPokemonDetail } from "./pokemonService";

export type ResultadoAgregar = {
  ok: boolean;
  mensaje: string;
};

export async function cargarEquipo(): Promise<EquipoItem[]> {
  return listEquipo();
}

export async function agregarAlEquipoActual(pokemonId: number): Promise<ResultadoAgregar> {
  const ids = await getEquipoIds();
  const resultado = agregarAlEquipo(ids, pokemonId);
  if (!resultado.ok) {
    return { ok: false, mensaje: resultado.mensaje };
  }
  try {
    const detail = await loadPokemonDetail(pokemonId);
    await savePokemon(detail);
  } catch {
    // Se agrega aunque la ficha no se pueda cachear en este momento.
  }
  await replaceLocalEquipo(resultado.ids);
  return { ok: true, mensaje: "Agregado al equipo." };
}

export async function quitarDeEquipo(posicion: number): Promise<void> {
  const items = await listEquipo();
  const ids = items
    .filter((item) => item.posicion !== posicion)
    .sort((left, right) => left.posicion - right.posicion)
    .map((item) => item.pokemon_id);
  await replaceLocalEquipo(ids);
}
