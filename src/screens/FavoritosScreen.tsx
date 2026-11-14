import { useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { EmptyState, ErrorState, LoadingState } from "@/src/components/StateViews";
import { Screen } from "@/src/components/Screen";
import { useFavoritoRenderer } from "@/src/hooks/useFavoritoRenderer";
import { useFavoritos } from "@/src/hooks/useFavoritos";
import { useSession } from "@/src/session/SessionProvider";
import { toggleFavorito } from "@/src/services/favoritoService";
import { colores, espacios } from "@/src/theme";
import type { Favorito } from "@/src/types";

function EncabezadoFavoritos() {
  return (
    <View style={styles.encabezado}>
      <Text style={styles.titulo}>Tus favoritos</Text>
      <Text style={styles.subtitulo}>
        Disponibles sin conexión. Se sincronizan cuando vuelve la red.
      </Text>
    </View>
  );
}

function EstadoFavoritos({
  loading,
  error,
  recargar,
  onExplorar,
}: {
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  onExplorar: () => void;
}) {
  if (loading) {
    return <LoadingState mensaje="Leyendo tus favoritos…" />;
  }
  if (error !== null) {
    return <ErrorState mensaje={error} onReintentar={() => void recargar()} />;
  }
  return (
    <EmptyState
      titulo="Aún no tienes favoritos"
      mensaje="Abre un Pokémon y usa el corazón, o haz doble toque sobre una tarjeta."
      accion="Explorar la Pokédex"
      onAccion={onExplorar}
    />
  );
}

function ListaFavoritos({
  favoritos,
  loading,
  error,
  recargar,
  quitar,
  abrir,
  onExplorar,
}: {
  favoritos: Favorito[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  quitar: (pokemonId: number) => Promise<void>;
  abrir: (pokemonId: number) => void;
  onExplorar: () => void;
}) {
  const renderItem = useFavoritoRenderer(abrir, quitar);

  return (
    <FlatList
      data={favoritos}
      keyExtractor={(item) => String(item.pokemon_id)}
      renderItem={renderItem}
      ListHeaderComponent={<EncabezadoFavoritos />}
      ListEmptyComponent={
        <EstadoFavoritos
          loading={loading}
          error={error}
          recargar={recargar}
          onExplorar={onExplorar}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => void recargar()}
          tintColor={colores.marca}
        />
      }
      contentContainerStyle={styles.lista}
    />
  );
}

export function FavoritosScreen() {
  const { favoritos, loading, error, recargar } = useFavoritos();
  const { sincronizar } = useSession();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      void sincronizar();
    }, [sincronizar]),
  );

  const quitar = useCallback(
    async (pokemonId: number): Promise<void> => {
      await toggleFavorito(pokemonId);
      await recargar();
    },
    [recargar],
  );
  const abrir = useCallback(
    (pokemonId: number) => {
      router.push({ pathname: "/pokemon/[id]", params: { id: String(pokemonId) } });
    },
    [router],
  );

  return (
    <Screen>
      <ListaFavoritos
        favoritos={favoritos}
        loading={loading}
        error={error}
        recargar={recargar}
        quitar={quitar}
        abrir={abrir}
        onExplorar={() => router.push("/")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    paddingTop: espacios.md,
    paddingBottom: espacios.sm,
    gap: espacios.xs,
  },
  titulo: {
    color: colores.texto,
    fontSize: 25,
    fontWeight: "900",
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: 12.5,
    lineHeight: 18,
  },
  lista: {
    paddingBottom: espacios.xl,
    flexGrow: 1,
  },
});
