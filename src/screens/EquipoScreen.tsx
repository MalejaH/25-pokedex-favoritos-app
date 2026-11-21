import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Aviso } from "@/src/components/Aviso";
import { EquipoSlot } from "@/src/components/EquipoSlot";
import { ScrollScreen } from "@/src/components/Screen";
import { ErrorState, LoadingState } from "@/src/components/StateViews";
import { useEquipo } from "@/src/hooks/useEquipo";
import { useEquipoActions } from "@/src/hooks/useEquipoActions";
import { useSession } from "@/src/session/SessionProvider";
import { quitarDeEquipo } from "@/src/services/equipoService";
import { randomPokemonId } from "@/src/services/pokemonService";
import { colores, espacios, radios } from "@/src/theme";
import type { EquipoItem } from "@/src/types";

const POSICIONES = [1, 2, 3, 4, 5, 6];

function ListaSlots({
  equipo,
  quitar,
  abrir,
}: {
  equipo: EquipoItem[];
  quitar: (posicion: number) => void;
  abrir: (pokemonId: number) => void;
}) {
  return (
    <View style={styles.lista}>
      {POSICIONES.map((posicion) => (
        <EquipoSlot
          key={posicion}
          posicion={posicion}
          item={equipo.find((item) => item.posicion === posicion)}
          onQuitar={quitar}
          onAbrir={abrir}
        />
      ))}
    </View>
  );
}

function AccionesEquipo({
  onAgregar,
  onAleatorio,
  onSalir,
}: {
  onAgregar: () => void;
  onAleatorio: () => void;
  onSalir: () => void;
}) {
  return (
    <>
      <View style={styles.acciones}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir a la Pokédex para agregar Pokémon"
          onPress={onAgregar}
          style={[styles.boton, styles.botonPrincipal]}
        >
          <Text style={styles.botonPrincipalTexto}>Añadir desde la Pokédex</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Agregar un Pokémon aleatorio al equipo"
          onPress={onAleatorio}
          style={styles.boton}
        >
          <Text style={styles.botonTexto}>🎲 Aleatorio</Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar sesión"
        onPress={onSalir}
        style={styles.salir}
      >
        <Text style={styles.salirTexto}>Cerrar sesión</Text>
      </Pressable>
    </>
  );
}

function ContenidoEquipo({
  equipo,
  mensaje,
  onCerrarMensaje,
  quitar,
  abrir,
  onAgregar,
  onAleatorio,
  onSalir,
}: {
  equipo: EquipoItem[];
  mensaje: string | null;
  onCerrarMensaje: () => void;
  quitar: (posicion: number) => void;
  abrir: (pokemonId: number) => void;
  onAgregar: () => void;
  onAleatorio: () => void;
  onSalir: () => void;
}) {
  return (
    <>
      <Text style={styles.kicker}>TU EQUIPO</Text>
      <Text style={styles.titulo}>{equipo.length}/6 Pokémon</Text>
      <Text style={styles.subtitulo}>
        Máximo 6, sin repetidos. Toca una ficha para ver el detalle.
      </Text>
      <Aviso mensaje={mensaje} onCerrar={onCerrarMensaje} tono="aviso" />
      <ListaSlots equipo={equipo} quitar={quitar} abrir={abrir} />
      <AccionesEquipo onAgregar={onAgregar} onAleatorio={onAleatorio} onSalir={onSalir} />
    </>
  );
}

function PantallaEstado({
  loading,
  error,
  recargar,
}: {
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
}) {
  if (loading) {
    return (
      <ScrollScreen>
        <LoadingState mensaje="Revisando tu equipo…" />
      </ScrollScreen>
    );
  }
  return (
    <ScrollScreen>
      <ErrorState mensaje={error ?? "Error"} onReintentar={() => void recargar()} />
    </ScrollScreen>
  );
}

export function EquipoScreen() {
  const { equipo, loading, error, recargar } = useEquipo();
  const acciones = useEquipoActions();
  const { sincronizar, logout } = useSession();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      void sincronizar();
    }, [sincronizar]),
  );

  const quitar = useCallback(
    async (posicion: number): Promise<void> => {
      await quitarDeEquipo(posicion);
      await recargar();
    },
    [recargar],
  );
  const aleatorio = useCallback(async (): Promise<void> => {
    await acciones.agregar(randomPokemonId());
    await recargar();
  }, [acciones, recargar]);

  const salir = useCallback(async (): Promise<void> => {
    await logout();
  }, [logout]);

  if (loading || error !== null) {
    return <PantallaEstado loading={loading} error={error} recargar={recargar} />;
  }

  return (
    <ScrollScreen>
      <ContenidoEquipo
        equipo={equipo}
        mensaje={acciones.mensaje}
        onCerrarMensaje={acciones.limpiarMensaje}
        quitar={(posicion) => {
          void quitar(posicion);
        }}
        abrir={(pokemonId) =>
          router.push({ pathname: "/pokemon/[id]", params: { id: String(pokemonId) } })
        }
        onAgregar={() => router.push("/")}
        onAleatorio={() => {
          void aleatorio();
        }}
        onSalir={() => {
          void salir();
        }}
      />
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colores.marca,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  titulo: {
    color: colores.texto,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: espacios.sm,
  },
  lista: {
    marginTop: espacios.sm,
  },
  acciones: {
    flexDirection: "row",
    gap: espacios.sm,
    marginTop: espacios.sm,
  },
  boton: {
    flex: 1,
    backgroundColor: colores.panelAlt,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.pill,
    paddingVertical: espacios.md,
    alignItems: "center",
  },
  botonPrincipal: {
    backgroundColor: colores.marcaOscura,
    borderColor: colores.marcaOscura,
  },
  botonTexto: {
    color: colores.texto,
    fontWeight: "700",
    fontSize: 12,
  },
  botonPrincipalTexto: {
    color: colores.texto,
    fontWeight: "800",
    fontSize: 12,
  },
  salir: {
    marginTop: espacios.md,
    paddingVertical: espacios.sm,
    alignItems: "center",
  },
  salirTexto: {
    color: colores.peligro,
    fontSize: 12,
    fontWeight: "700",
  },
});
