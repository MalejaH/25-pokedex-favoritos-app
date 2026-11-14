import { Pressable, StyleSheet, Text } from "react-native";
import { colores, espacios, radios } from "@/src/theme";

type Props = {
  mensaje: string | null;
  onCerrar: () => void;
  tono?: "info" | "aviso";
};

export function Aviso({ mensaje, onCerrar, tono = "info" }: Props) {
  if (mensaje === null) {
    return null;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Cerrar aviso: ${mensaje}`}
      onPress={onCerrar}
      style={[styles.caja, tono === "aviso" ? styles.aviso : styles.info]}
    >
      <Text style={styles.texto}>{mensaje}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  caja: {
    borderWidth: 1,
    borderRadius: radios.sm,
    padding: espacios.sm,
  },
  info: {
    backgroundColor: "rgba(45, 212, 191, 0.12)",
    borderColor: colores.marcaOscura,
  },
  aviso: {
    backgroundColor: "rgba(251, 191, 36, 0.12)",
    borderColor: colores.acento,
  },
  texto: {
    color: colores.texto,
    fontSize: 12,
    lineHeight: 17,
  },
});
