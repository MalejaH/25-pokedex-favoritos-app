import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colores, espacios, radios } from "@/src/theme";

export function LoadingState({ mensaje = "Cargando…" }: { mensaje?: string }) {
  return (
    <View style={styles.center} accessibilityRole="progressbar">
      <ActivityIndicator color={colores.marca} size="large" />
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

export function ErrorState({
  mensaje,
  onReintentar,
}: {
  mensaje: string;
  onReintentar: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.titulo}>Algo salió mal</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reintentar"
        onPress={onReintentar}
        style={styles.boton}
      >
        <Text style={styles.botonTexto}>Reintentar</Text>
      </Pressable>
    </View>
  );
}

export function EmptyState({
  titulo,
  mensaje,
  accion,
  onAccion,
}: {
  titulo: string;
  mensaje: string;
  accion?: string;
  onAccion?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
      {accion !== undefined && onAccion !== undefined ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accion}
          onPress={onAccion}
          style={styles.boton}
        >
          <Text style={styles.botonTexto}>{accion}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espacios.sm,
    paddingVertical: espacios.xl,
  },
  titulo: {
    color: colores.texto,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  mensaje: {
    color: colores.textoSuave,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 20,
  },
  boton: {
    marginTop: espacios.sm,
    backgroundColor: colores.marcaOscura,
    borderRadius: radios.pill,
    paddingHorizontal: espacios.lg,
    paddingVertical: espacios.sm,
  },
  botonTexto: {
    color: colores.texto,
    fontWeight: "700",
  },
});
