import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colores, espacios } from "@/src/theme";

export default function NotFoundScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Ruta no encontrada</Text>
      <Text style={styles.texto}>La pantalla que buscas no existe.</Text>
      <Link href="/" style={styles.enlace}>
        Volver a la Pokédex
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: espacios.lg,
    backgroundColor: colores.fondo,
    gap: espacios.sm,
  },
  titulo: {
    color: colores.texto,
    fontSize: 22,
    fontWeight: "900",
  },
  texto: {
    color: colores.textoSuave,
    fontSize: 13,
  },
  enlace: {
    color: colores.marca,
    fontWeight: "800",
    marginTop: espacios.sm,
  },
});
