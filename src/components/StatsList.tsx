import { StyleSheet, Text, View } from "react-native";
import { colores, espacios } from "@/src/theme";
import { etiquetaStat } from "@/src/utils/format";

export function StatsList({ stats }: { stats: Record<string, number> }) {
  const entries = Object.entries(stats);
  if (entries.length === 0) {
    return <Text style={styles.vacio}>Sin estadísticas disponibles.</Text>;
  }
  return (
    <View style={styles.lista}>
      {entries.map(([stat, value]) => (
        <View key={stat} style={styles.fila}>
          <Text style={styles.etiqueta}>{etiquetaStat(stat)}</Text>
          <View style={styles.barra}>
            <View style={[styles.relleno, { flex: Math.max(1, Math.min(255, value)) }]} />
            <View style={{ flex: Math.max(0, 255 - Math.min(255, value)) }} />
          </View>
          <Text style={styles.valor}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  lista: {
    width: "100%",
    gap: espacios.xs,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.sm,
  },
  etiqueta: {
    color: colores.textoSuave,
    fontSize: 11,
    width: 84,
  },
  barra: {
    flex: 1,
    height: 7,
    flexDirection: "row",
    borderRadius: 99,
    overflow: "hidden",
    backgroundColor: colores.panelAlt,
  },
  relleno: {
    backgroundColor: colores.marca,
  },
  valor: {
    color: colores.texto,
    fontSize: 11,
    fontWeight: "800",
    width: 30,
    textAlign: "right",
  },
  vacio: {
    color: colores.textoSuave,
    fontSize: 12,
  },
});
