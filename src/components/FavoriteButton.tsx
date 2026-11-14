import { Pressable, StyleSheet, Text } from "react-native";
import { colores, radios } from "@/src/theme";

type Props = {
  activo: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function FavoriteButton({ activo, onPress, disabled = false }: Props) {
  const etiqueta = activo ? "Quitar de favoritos" : "Añadir a favoritos";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      accessibilityState={{ selected: activo, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={[styles.boton, activo ? styles.activo : null, disabled ? styles.disabled : null]}
    >
      <Text style={[styles.icono, activo ? styles.iconoActivo : null]}>{activo ? "♥" : "♡"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    width: 40,
    height: 40,
    borderRadius: radios.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.panelAlt,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  activo: {
    backgroundColor: "rgba(251, 113, 133, 0.16)",
    borderColor: colores.favorito,
  },
  disabled: {
    opacity: 0.4,
  },
  icono: {
    color: colores.textoSuave,
    fontSize: 21,
    lineHeight: 24,
  },
  iconoActivo: {
    color: colores.favorito,
  },
});
