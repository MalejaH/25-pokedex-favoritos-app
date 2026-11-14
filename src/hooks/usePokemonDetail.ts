import { useCallback, useEffect, useState } from "react";
import { isFavorito } from "@/src/repositories/favoritoRepository";
import { agregarAlEquipoActual } from "@/src/services/equipoService";
import { toggleFavorito } from "@/src/services/favoritoService";
import { loadPokemonDetail, mensajeAmigable } from "@/src/services/pokemonService";
import type { PokemonDetail } from "@/src/types";

type DetailState = {
  detail: PokemonDetail | null;
  loading: boolean;
  error: string | null;
  esFavorito: boolean;
  mensajeEquipo: string | null;
  recargar: () => Promise<void>;
  alternarFavorito: () => Promise<void>;
  agregarEquipo: () => Promise<void>;
  limpiarMensaje: () => void;
};

export function usePokemonDetail(id: number): DetailState {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [mensajeEquipo, setMensajeEquipo] = useState<string | null>(null);

  const recargar = useCallback(async (): Promise<void> => {
    if (!Number.isInteger(id) || id <= 0) {
      setError("El identificador del Pokémon no es válido.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const loaded = await loadPokemonDetail(id);
      setDetail(loaded);
      setEsFavorito(await isFavorito(id));
    } catch (caught) {
      setError(mensajeAmigable(caught));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  const alternarFavorito = useCallback(async (): Promise<void> => {
    const activo = await toggleFavorito(id);
    setEsFavorito(activo);
  }, [id]);

  const agregarEquipo = useCallback(async (): Promise<void> => {
    const resultado = await agregarAlEquipoActual(id);
    setMensajeEquipo(resultado.mensaje);
  }, [id]);

  const limpiarMensaje = useCallback((): void => {
    setMensajeEquipo(null);
  }, []);

  return {
    detail,
    loading,
    error,
    esFavorito,
    mensajeEquipo,
    recargar,
    alternarFavorito,
    agregarEquipo,
    limpiarMensaje,
  };
}
