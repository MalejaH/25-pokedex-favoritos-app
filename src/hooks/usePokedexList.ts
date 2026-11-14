import { useCallback, useEffect, useState } from "react";
import { usePokedexData } from "./usePokedexData";

export function usePokedexList() {
  const { estado, cargarPrimera, recargar, cargarMas } = usePokedexData();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(
      () => {
        void cargarPrimera(query);
      },
      query.length === 0 ? 0 : 400,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [query, cargarPrimera]);

  const refrescar = useCallback(async (): Promise<void> => {
    await recargar(query);
  }, [recargar, query]);

  const siguientePagina = useCallback(async (): Promise<void> => {
    await cargarMas(query);
  }, [cargarMas, query]);

  return {
    ...estado,
    query,
    setQuery,
    recargar: refrescar,
    cargarMas: siguientePagina,
  };
}
