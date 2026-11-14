import { Pressable, StyleSheet, Text, View } from "react-native";
import { Aviso } from "./Aviso";
import { FavoriteButton } from "./FavoriteButton";
import { colores, espacios, radios } from "@/src/theme";

type NavProps = {
  id: number;
  maxId: number;
  onNavegar: (id: number) => void;
};

function Navegacion({ id, maxId, onNavegar }: NavProps) {
  const anterior = Math.max(1, id - 1);
  const siguiente = Math.min(maxId, id + 1);
  return (
    <View style={styles.navegacion}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pokémon anterior"
        accessibilityState={{ disabled: id <= 1 }}
        disabled={id <= 1}
        onPress={() => onNavegar(anterior)}
        style={[styles.navBoton, id <= 1 ? styles.deshabilitado : null]}
      >
        <Text style={styles.navTexto}>← Anterior</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pokémon siguiente"
        accessibilityState={{ disabled: id >= maxId }}
        disabled={id >= maxId}
        onPress={() => onNavegar(siguiente)}
        style={[styles.navBoton, id >= maxId ? styles.deshabilitado : null]}
      >
        <Text style={styles.navTexto}>Siguiente →</Text>
      </Pressable>
    </View>
  );
}

type Props = {
  id: number;
  maxId: number;
  esFavorito: boolean;
  mensaje: string | null;
  onFavorito: () => void;
  onEquipo: () => void;
  onCerrarMensaje: () => void;
  onNavegar: (id: number) => void;
};

export function DetailActions({
  id,
  maxId,
  esFavorito,
  mensaje,
  onFavorito,
  onEquipo,
  onCerrarMensaje,
  onNavegar,
}: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.fila}>
        <FavoriteButton activo={esFavorito} onPress={onFavorito} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Agregar este Pokémon al equipo"
          onPress={onEquipo}
          style={styles.botonEquipo}
        >
          <Text style={styles.botonEquipoTexto}>+ Añadir al equipo</Text>
        </Pressable>
      </View>

      <Aviso mensaje={mensaje} onCerrar={onCerrarMensaje} tono="aviso" />

      <Navegacion id={id} maxId={maxId} onNavegar={onNavegar} />
      <Text style={styles.pista}>Desliza la tarjeta a los lados para cambiar de Pokémon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: espacios.sm,
    marginTop: espacios.md,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.sm,
  },
  botonEquipo: {
    flex: 1,
    backgroundColor: colores.marcaOscura,
    borderRadius: radios.pill,
    paddingVertical: espacios.md,
    alignItems: "center",
  },
  botonEquipoTexto: {
    color: colores.texto,
    fontSize: 13,
    fontWeight: "800",
  },
  aviso: {
    backgroundColor: "rgba(251, 191, 36, 0.12)",
    borderWidth: 1,
    borderColor: colores.acento,
    borderRadius: radios.sm,
    padding: espacios.sm,
  },
  avisoTexto: {
    color: colores.texto,
    fontSize: 12,
  },
  navegacion: {
    flexDirection: "row",
    gap: espacios.sm,
    marginTop: espacios.xs,
  },
  navBoton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.md,
    paddingVertical: espacios.sm,
    alignItems: "center",
    backgroundColor: colores.panel,
  },
  navTexto: {
    color: colores.texto,
    fontSize: 12,
    fontWeight: "700",
  },
  deshabilitado: {
    opacity: 0.35,
  },
  pista: {
    color: colores.textoSuave,
    fontSize: 10.5,
    textAlign: "center",
  },
});
