import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FavoriteButton } from "./FavoriteButton";
import { colores, espacios, radios } from "@/src/theme";
import type { Favorito } from "@/src/types";
import { capitalizar } from "@/src/utils/format";

type Props = {
  favorito: Favorito;
  onAbrir: () => void;
  onQuitar: () => void;
};

export function FavoritoCard({ favorito, onAbrir, onQuitar }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver ficha de ${capitalizar(favorito.nombre)}`}
        onPress={onAbrir}
        style={styles.principal}
      >
        {favorito.sprite_url !== null ? (
          <Image
            source={{ uri: favorito.sprite_url }}
            style={styles.sprite}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[styles.sprite, styles.sinSprite]}>
            <Text style={styles.sinSpriteTexto}>?</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.nombre}>{capitalizar(favorito.nombre)}</Text>
          <Text style={styles.tipos}>
            {favorito.tipos.length > 0 ? favorito.tipos.join(" · ") : "Sin datos de tipos"}
          </Text>
          <Text style={styles.fecha}>
            Guardado: {new Date(favorito.agregado_en).toLocaleDateString("es-CO")}
          </Text>
        </View>
      </Pressable>
      <FavoriteButton activo onPress={onQuitar} />
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
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
  principal: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.md,
  },
  sprite: {
    width: 58,
    height: 58,
  },
  sinSprite: {
    backgroundColor: colores.panelAlt,
    borderRadius: radios.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  sinSpriteTexto: {
    color: colores.textoSuave,
    fontSize: 22,
    fontWeight: "800",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    color: colores.texto,
    fontSize: 16,
    fontWeight: "800",
  },
  tipos: {
    color: colores.marca,
    fontSize: 12,
    textTransform: "capitalize",
  },
  fecha: {
    color: colores.textoSuave,
    fontSize: 10.5,
  },
});
