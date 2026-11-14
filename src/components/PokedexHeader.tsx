import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Aviso } from "./Aviso";
import { colores, espacios, radios } from "@/src/theme";

type Props = {
  query: string;
  onChangeQuery: (value: string) => void;
  total: number;
  offline: boolean;
  mensaje: string | null;
  onAleatorio: () => void;
  shakeDisponible: boolean;
  onCerrarMensaje: () => void;
};

export function PokedexHeader({
  query,
  onChangeQuery,
  total,
  offline,
  mensaje,
  onAleatorio,
  shakeDisponible,
  onCerrarMensaje,
}: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.kicker}>PROYECTO 25 · POKÉDEX</Text>
      <Text style={styles.titulo}>Explora y guarda tus favoritos</Text>
      <Text style={styles.subtitulo}>
        {total > 0 ? `${total} Pokémon` : "PokéAPI"} · {offline ? "modo sin conexión" : "en línea"}
      </Text>

      <TextInput
        accessibilityLabel="Buscar Pokémon por nombre"
        placeholder="Buscar por nombre…"
        placeholderTextColor={colores.textoSuave}
        value={query}
        onChangeText={onChangeQuery}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.buscador}
      />

      <View style={styles.fila}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mostrar un Pokémon aleatorio"
          onPress={onAleatorio}
          style={styles.boton}
        >
          <Text style={styles.botonTexto}>🎲 Aleatorio</Text>
        </Pressable>
        <Text style={styles.pista}>
          {shakeDisponible ? "o sacude el teléfono" : "sacudir no disponible"}
        </Text>
      </View>

      {offline ? (
        <Text style={styles.aviso}>
          Sin conexión: se muestran los Pokémon guardados en este dispositivo.
        </Text>
      ) : null}

      <Aviso mensaje={mensaje} onCerrar={onCerrarMensaje} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: espacios.sm,
    paddingTop: espacios.md,
    paddingBottom: espacios.sm,
  },
  kicker: {
    color: colores.marca,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
  },
  titulo: {
    color: colores.texto,
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 30,
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: 13,
  },
  buscador: {
    marginTop: espacios.xs,
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.md,
    color: colores.texto,
    paddingHorizontal: espacios.md,
    paddingVertical: 11,
    fontSize: 15,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boton: {
    backgroundColor: colores.panelAlt,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.pill,
    paddingHorizontal: espacios.md,
    paddingVertical: espacios.sm,
  },
  botonTexto: {
    color: colores.texto,
    fontWeight: "700",
    fontSize: 13,
  },
  pista: {
    color: colores.textoSuave,
    fontSize: 11,
  },
  aviso: {
    color: colores.acento,
    fontSize: 12,
    lineHeight: 17,
  },
  mensaje: {
    backgroundColor: "rgba(45, 212, 191, 0.12)",
    borderWidth: 1,
    borderColor: colores.marcaOscura,
    borderRadius: radios.sm,
    padding: espacios.sm,
  },
  mensajeTexto: {
    color: colores.texto,
    fontSize: 12,
  },
});
