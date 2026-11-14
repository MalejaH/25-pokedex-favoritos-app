import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { loadPokemonPage, mensajeAmigable } from "@/src/services/pokemonService";
import { mergeUnique } from "@/src/services/pagination";
import type { PokemonListItem } from "@/src/types";

export type PokedexDataState = {
  items: PokemonListItem[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  offline: boolean;
  error: string | null;
  total: number;
  siguiente: number | null;
};

type Setter = Dispatch<SetStateAction<PokedexDataState>>;

const INICIAL: PokedexDataState = {
  items: [],
  loading: true,
  refreshing: false,
  loadingMore: false,
  offline: false,
  error: null,
  total: 0,
  siguiente: null,
};

function offsetParaCargar(estado: PokedexDataState): number | null {
  if (estado.siguiente === null || estado.loadingMore || estado.loading) {
    return null;
  }
  return estado.siguiente;
}

function useCargarPrimera(setEstado: Setter) {
  return useCallback(
    async (texto: string): Promise<void> => {
      setEstado((previous) => ({ ...previous, loading: true, error: null }));
      try {
        const page = await loadPokemonPage(0, texto);
        setEstado((previous) => ({
          ...previous,
          items: page.items,
          total: page.total,
          siguiente: page.siguiente,
          offline: page.offline === true,
          loading: false,
        }));
      } catch (caught) {
        setEstado({ ...INICIAL, loading: false, error: mensajeAmigable(caught) });
      }
    },
    [setEstado],
  );
}

function useCargarMas(estado: PokedexDataState, setEstado: Setter) {
  return useCallback(
    async (texto: string): Promise<void> => {
      const offset = offsetParaCargar(estado);
      if (offset === null) {
        return;
      }
      setEstado((previous) => ({ ...previous, loadingMore: true }));
      try {
        const page = await loadPokemonPage(offset, texto);
        setEstado((previous) => ({
          ...previous,
          items: mergeUnique(previous.items, page.items),
          siguiente: page.siguiente,
          offline: page.offline === true,
          loadingMore: false,
        }));
      } catch (caught) {
        setEstado((previous) => ({
          ...previous,
          loadingMore: false,
          error: mensajeAmigable(caught),
        }));
      }
    },
    [estado, setEstado],
  );
}

export function usePokedexData() {
  const [estado, setEstado] = useState<PokedexDataState>(INICIAL);
  const cargarPrimera = useCargarPrimera(setEstado);
  const cargarMas = useCargarMas(estado, setEstado);
  const recargar = useCallback(
    async (texto: string): Promise<void> => {
      setEstado((previous) => ({ ...previous, refreshing: true }));
      await cargarPrimera(texto);
      setEstado((previous) => ({ ...previous, refreshing: false }));
    },
    [cargarPrimera, setEstado],
  );
  return { estado, cargarPrimera, recargar, cargarMas };
}
