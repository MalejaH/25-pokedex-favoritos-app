import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colores, espacios, radios } from "@/src/theme";
import type { EquipoItem } from "@/src/types";
import { capitalizar } from "@/src/utils/format";

type Props = {
  posicion: number;
  item?: EquipoItem;
  onQuitar: (posicion: number) => void;
  onAbrir: (pokemonId: number) => void;
};

export function EquipoSlot({ posicion, item, onQuitar, onAbrir }: Props) {
  if (item === undefined) {
    return (
      <View style={[styles.slot, styles.vacio]}>
        <Text style={styles.vacioTexto}>{posicion}</Text>
        <Text style={styles.vacioPista}>Espacio libre</Text>
      </View>
    );
  }

  return (
    <View style={styles.slot}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver ficha de ${capitalizar(item.nombre)}`}
        onPress={() => onAbrir(item.pokemon_id)}
        style={styles.principal}
      >
        {item.sprite_url !== null ? (
          <Image
            source={{ uri: item.sprite_url }}
            style={styles.sprite}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Text style={styles.vacioTexto}>?</Text>
        )}
        <View style={styles.info}>
          <Text style={styles.posicion}>Posición {posicion}</Text>
          <Text style={styles.nombre} numberOfLines={1}>
            {capitalizar(item.nombre)}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Quitar ${capitalizar(item.nombre)} del equipo`}
        onPress={() => onQuitar(posicion)}
        style={styles.quitar}
      >
        <Text style={styles.quitarTexto}>Quitar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.sm,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.md,
    padding: espacios.sm,
    marginBottom: espacios.sm,
  },
  vacio: {
    justifyContent: "center",
    borderStyle: "dashed",
  },
  vacioTexto: {
    color: colores.textoSuave,
    fontSize: 20,
    fontWeight: "800",
  },
  vacioPista: {
    color: colores.textoSuave,
    fontSize: 12,
  },
  principal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.sm,
  },
  sprite: {
    width: 52,
    height: 52,
  },
  info: {
    flex: 1,
  },
  posicion: {
    color: colores.marca,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  nombre: {
    color: colores.texto,
    fontSize: 16,
    fontWeight: "700",
  },
  quitar: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.pill,
    paddingHorizontal: espacios.sm,
    paddingVertical: 6,
  },
  quitarTexto: {
    color: colores.peligro,
    fontSize: 11,
    fontWeight: "700",
  },
});
