import { useEffect, type ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { colores, radios } from "@/src/theme";
import type { Tilt } from "@/src/sensors/tilt";

type Props = {
  tilt: Tilt;
  enabled: boolean;
  children: ReactNode;
};

export function ParallaxCard({ tilt, enabled, children }: Props) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  useEffect(() => {
    rotateX.value = withSpring(enabled ? -tilt.y * 9 : 0, { damping: 16 });
    rotateY.value = withSpring(enabled ? tilt.x * 9 : 0, { damping: 16 });
  }, [enabled, tilt.x, tilt.y, rotateX, rotateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[styles.tarjeta, animatedStyle]}
      accessibilityLabel={
        enabled ? "Tarjeta 3D inclinada según el giroscopio" : "Tarjeta estática de Pokémon"
      }
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.panel,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.lg,
    padding: 20,
    alignItems: "center",
  },
});
