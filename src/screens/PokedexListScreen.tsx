import { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/StateViews";
import { PokedexHeader } from "@/src/components/PokedexHeader";
import { Screen } from "@/src/components/Screen";
import { useEquipoActions } from "@/src/hooks/useEquipoActions";
import { useFavoritoIds } from "@/src/hooks/useFavoritoIds";
import { usePokedexList } from "@/src/hooks/usePokedexList";
import { usePokemonRenderer } from "@/src/hooks/usePokemonRenderer";
import { useShake } from "@/src/sensors/useShake";
import { randomPokemonId } from "@/src/services/pokemonService";
import { colores, espacios } from "@/src/theme";

type ListaProps = {
  lista: ReturnType<typeof usePokedexList>;
  favoritos: Set<number>;
  alternar: (pokemonId: number) => Promise<boolean>;
  agregarEquipo: (pokemonId: number) => Promise<void>;
  mensajeEquipo: string | null;
  limpiarMensaje: () => void;
  abrir: (pokemonId: number) => void;
  abrirAleatorio: () => void;
  shakeDisponible: boolean;
};

function EstadoLista({
  lista,
  onLimpiar,
}: {
  lista: ReturnType<typeof usePokedexList>;
  onLimpiar: () => void;
}) {
  if (lista.loading) {
    return <LoadingState mensaje="Buscando Pokémon…" />;
  }
  if (lista.error !== null) {
    return <ErrorState mensaje={lista.error} onReintentar={() => void lista.recargar()} />;
  }
  return (
    <EmptyState
      titulo="Sin resultados"
      mensaje="No encontramos Pokémon con ese nombre. Prueba otra búsqueda."
      accion="Limpiar búsqueda"
      onAccion={onLimpiar}
    />
  );
}

function PieLista({ cargando }: { cargando: boolean }) {
  if (!cargando) {
    return null;
  }
  return (
    <View style={styles.footer}>
      <ActivityIndicator color={colores.marca} />
    </View>
  );
}

function RefrescarLista({ refreshing, onRefresh }: { refreshing: boolean; onRefresh: () => void }) {
  return <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colores.marca} />;
}

function ListaPokedex({
  lista,
  favoritos,
  alternar,
  agregarEquipo,
  mensajeEquipo,
  limpiarMensaje,
  abrir,
  abrirAleatorio,
  shakeDisponible,
}: ListaProps) {
  const renderItem = usePokemonRenderer(favoritos, alternar, agregarEquipo, abrir);

  return (
    <FlatList
      data={lista.items}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ListHeaderComponent={
        <PokedexHeader
          query={lista.query}
          onChangeQuery={lista.setQuery}
          total={lista.total}
          offline={lista.offline}
          mensaje={mensajeEquipo}
          onAleatorio={abrirAleatorio}
          shakeDisponible={shakeDisponible}
          onCerrarMensaje={limpiarMensaje}
        />
      }
      ListEmptyComponent={<EstadoLista lista={lista} onLimpiar={() => lista.setQuery("")} />}
      ListFooterComponent={<PieLista cargando={lista.loadingMore} />}
      onEndReached={() => void lista.cargarMas()}
      onEndReachedThreshold={0.4}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefrescarLista refreshing={lista.refreshing} onRefresh={() => void lista.recargar()} />
      }
      contentContainerStyle={styles.lista}
    />
  );
}

export function PokedexListScreen() {
  const lista = usePokedexList();
  const { favoritos, alternar } = useFavoritoIds();
  const equipo = useEquipoActions();
  const router = useRouter();

  const abrir = useCallback(
    (pokemonId: number) => {
      router.push({ pathname: "/pokemon/[id]", params: { id: String(pokemonId) } });
    },
    [router],
  );
  const abrirAleatorio = useCallback(() => {
    abrir(randomPokemonId());
  }, [abrir]);
  const shakeDisponible = useShake(abrirAleatorio);

  return (
    <Screen>
      <ListaPokedex
        lista={lista}
        favoritos={favoritos}
        alternar={alternar}
        agregarEquipo={equipo.agregar}
        mensajeEquipo={equipo.mensaje}
        limpiarMensaje={equipo.limpiarMensaje}
        abrir={abrir}
        abrirAleatorio={abrirAleatorio}
        shakeDisponible={shakeDisponible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingBottom: espacios.xl,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: espacios.lg,
  },
});
