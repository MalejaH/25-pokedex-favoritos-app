import { useCallback } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/StateViews";
import { PokedexHeader } from "@/src/components/PokedexHeader";
import { PokemonCard } from "@/src/components/PokemonCard";
import { ScrollScreen } from "@/src/components/Screen";
import { useEquipoActions } from "@/src/hooks/useEquipoActions";
import { useFavoritoIds } from "@/src/hooks/useFavoritoIds";
import { usePokedexList } from "@/src/hooks/usePokedexList";
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

function ListaPokemon({
  items,
  favoritos,
  alternar,
  agregarEquipo,
  abrir,
}: Pick<ListaProps, "favoritos" | "alternar" | "agregarEquipo" | "abrir"> & {
  items: ListaProps["lista"]["items"];
}) {
  return (
    <>
      {items.map((item) => (
        <PokemonCard
          key={item.id}
          pokemon={item}
          esFavorito={favoritos.has(item.id)}
          onAbrir={() => abrir(item.id)}
          onFavorito={() => {
            void alternar(item.id);
          }}
          onEquipo={() => {
            void agregarEquipo(item.id);
          }}
        />
      ))}
    </>
  );
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
  return (
    <>
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
      {lista.items.length === 0 ? (
        <EstadoLista lista={lista} onLimpiar={() => lista.setQuery("")} />
      ) : (
        <ListaPokemon
          items={lista.items}
          favoritos={favoritos}
          alternar={alternar}
          agregarEquipo={agregarEquipo}
          abrir={abrir}
        />
      )}
      {lista.loadingMore ? (
        <View style={styles.footer}>
          <ActivityIndicator color={colores.marca} />
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cargar más Pokémon"
        onPress={() => void lista.cargarMas()}
        style={styles.cargarMas}
      >
        <Text style={styles.cargarMasTexto}>Cargar más</Text>
      </Pressable>
    </>
  );
}

export function PokedexListScreen() {
  const lista = usePokedexList();
  const { favoritos, alternar, recargar } = useFavoritoIds();
  const equipo = useEquipoActions();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      void recargar();
    }, [recargar]),
  );

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
    <ScrollScreen
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 240) {
          void lista.cargarMas();
        }
      }}
      scrollEventThrottle={250}
    >
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
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: espacios.lg,
    alignItems: "center",
  },
  cargarMas: {
    paddingVertical: espacios.md,
    alignItems: "center",
  },
  cargarMasTexto: {
    color: colores.textoSuave,
    fontSize: 12,
    fontWeight: "700",
  },
});
