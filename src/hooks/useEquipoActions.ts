import { useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import { agregarAlEquipoActual } from "@/src/services/equipoService";

type EquipoActions = {
  mensaje: string | null;
  agregar: (pokemonId: number) => Promise<void>;
  limpiarMensaje: () => void;
};

export function useEquipoActions(): EquipoActions {
  const [mensaje, setMensaje] = useState<string | null>(null);

  const agregar = useCallback(async (pokemonId: number): Promise<void> => {
    try {
      const resultado = await agregarAlEquipoActual(pokemonId);
      setMensaje(resultado.mensaje);
      await Haptics.notificationAsync(
        resultado.ok
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "No se pudo agregar al equipo.");
    }
  }, []);

  const limpiarMensaje = useCallback((): void => {
    setMensaje(null);
  }, []);

  return { mensaje, agregar, limpiarMensaje };
}
