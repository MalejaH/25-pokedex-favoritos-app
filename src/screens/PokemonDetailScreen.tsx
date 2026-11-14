import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DetailActions } from "@/src/components/DetailActions";
import { PokemonDetailCard } from "@/src/components/PokemonDetailCard";
import { ScrollScreen } from "@/src/components/Screen";
import { ErrorState, LoadingState } from "@/src/components/StateViews";
import { useDetailGestures } from "@/src/hooks/useDetailGestures";
import { usePokemonDetail } from "@/src/hooks/usePokemonDetail";
import { useTilt } from "@/src/sensors/useTilt";
import { MAX_POKEMON_ID } from "@/src/services/pokemonService";
import type { PokemonDetail } from "@/src/types";

type DetailState = ReturnType<typeof usePokemonDetail>;
type TiltState = ReturnType<typeof useTilt>;

type CuerpoProps = {
  id: number;
  detail: PokemonDetail;
  esFavorito: boolean;
  mensaje: string | null;
  tilt: TiltState;
  tiltEnabled: boolean;
  onToggleTilt: () => void;
  onFavorito: () => void;
  onEquipo: () => void;
  onCerrarMensaje: () => void;
  navegar: (id: number) => void;
  gestos: ReturnType<typeof useDetailGestures>;
};

function CuerpoDetalle(props: CuerpoProps) {
  return (
    <ScrollScreen>
      <GestureDetector gesture={props.gestos}>
        <View style={styles.tarjeta}>
          <PokemonDetailCard
            detail={props.detail}
            tilt={props.tilt.tilt}
            tiltEnabled={props.tiltEnabled}
            tiltAvailable={props.tilt.available}
            permissionDenied={props.tilt.permissionDenied}
            onToggleTilt={props.onToggleTilt}
          />
        </View>
      </GestureDetector>
      <DetailActions
        id={props.id}
        maxId={MAX_POKEMON_ID}
        esFavorito={props.esFavorito}
        mensaje={props.mensaje}
        onFavorito={props.onFavorito}
        onEquipo={props.onEquipo}
        onCerrarMensaje={props.onCerrarMensaje}
        onNavegar={props.navegar}
      />
    </ScrollScreen>
  );
}

function EstadoDetalle({ state }: { state: DetailState }) {
  if (state.loading) {
    return (
      <ScrollScreen>
        <LoadingState mensaje="Abriendo la ficha…" />
      </ScrollScreen>
    );
  }
  return (
    <ScrollScreen>
      <ErrorState
        mensaje={state.error ?? "Pokémon no encontrado."}
        onReintentar={() => void state.recargar()}
      />
    </ScrollScreen>
  );
}

function ContenidoDetalle({
  id,
  state,
  tilt,
  tiltEnabled,
  onToggleTilt,
  navegar,
  gestos,
}: {
  id: number;
  state: DetailState;
  tilt: TiltState;
  tiltEnabled: boolean;
  onToggleTilt: () => void;
  navegar: (id: number) => void;
  gestos: ReturnType<typeof useDetailGestures>;
}) {
  if (state.loading || state.error !== null || state.detail === null) {
    return <EstadoDetalle state={state} />;
  }
  return (
    <CuerpoDetalle
      id={id}
      detail={state.detail}
      esFavorito={state.esFavorito}
      mensaje={state.mensajeEquipo}
      tilt={tilt}
      tiltEnabled={tiltEnabled}
      onToggleTilt={onToggleTilt}
      onFavorito={() => void state.alternarFavorito()}
      onEquipo={() => void state.agregarEquipo()}
      onCerrarMensaje={state.limpiarMensaje}
      navegar={navegar}
      gestos={gestos}
    />
  );
}

export function PokemonDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = Number(rawId);
  const state = usePokemonDetail(id);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const tilt = useTilt(tiltEnabled);
  const router = useRouter();

  const navegar = useCallback(
    (nextId: number): void => {
      if (nextId >= 1 && nextId <= MAX_POKEMON_ID) {
        router.push({ pathname: "/pokemon/[id]", params: { id: String(nextId) } });
      }
    },
    [router],
  );
  const gestos = useDetailGestures(id, navegar);

  return (
    <ContenidoDetalle
      id={id}
      state={state}
      tilt={tilt}
      tiltEnabled={tiltEnabled}
      onToggleTilt={() => setTiltEnabled((actual) => !actual)}
      navegar={navegar}
      gestos={gestos}
    />
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    marginTop: 4,
  },
});
