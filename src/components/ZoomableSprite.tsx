import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { colores, espacios, radios } from "@/src/theme";

type Props = {
  uri: string | null;
  nombre: string;
};

function ControlesZoom({
  zoom,
  onAjustar,
  onReset,
}: {
  zoom: number;
  onAjustar: (delta: number) => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.controles}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Alejar sprite"
        onPress={() => onAjustar(-0.25)}
        style={styles.boton}
      >
        <Text style={styles.botonTexto}>−</Text>
      </Pressable>
      <Text style={styles.zoom}>{zoom.toFixed(2)}×</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Acercar sprite"
        onPress={() => onAjustar(0.25)}
        style={styles.boton}
      >
        <Text style={styles.botonTexto}>+</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Restablecer zoom"
        onPress={onReset}
        style={[styles.boton, styles.botonReset]}
      >
        <Text style={styles.botonResetTexto}>1×</Text>
      </Pressable>
    </View>
  );
}

export function ZoomableSprite({ uri, nombre }: Props) {
  const [zoom, setZoom] = useState(1);

  const pinch = Gesture.Pinch()
    .runOnJS(true)
    .onUpdate((event) => {
      setZoom(Math.max(1, Math.min(3, event.scale)));
    });

  function ajustar(delta: number): void {
    setZoom((actual) => Math.max(1, Math.min(3, Number((actual + delta).toFixed(1)))));
  }

  return (
    <View style={styles.contenedor}>
      <GestureDetector gesture={pinch}>
        <View style={styles.area} accessibilityLabel={`Sprite de ${nombre}`}>
          {uri !== null ? (
            <Image
              source={{ uri }}
              style={[styles.imagen, { transform: [{ scale: zoom }] }]}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Text style={styles.sinImagen}>?</Text>
          )}
        </View>
      </GestureDetector>
      <ControlesZoom zoom={zoom} onAjustar={ajustar} onReset={() => setZoom(1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: "center",
    gap: espacios.xs,
  },
  area: {
    width: 190,
    height: 190,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imagen: {
    width: 170,
    height: 170,
  },
  sinImagen: {
    color: colores.textoSuave,
    fontSize: 64,
    fontWeight: "800",
  },
  controles: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacios.sm,
  },
  boton: {
    width: 36,
    height: 36,
    borderRadius: radios.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.panelAlt,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  botonTexto: {
    color: colores.texto,
    fontSize: 18,
    fontWeight: "800",
  },
  botonReset: {
    width: "auto",
    paddingHorizontal: espacios.sm,
  },
  botonResetTexto: {
    color: colores.textoSuave,
    fontSize: 12,
    fontWeight: "700",
  },
  zoom: {
    color: colores.textoSuave,
    fontSize: 12,
    minWidth: 42,
    textAlign: "center",
  },
});
