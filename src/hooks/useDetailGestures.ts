import { useMemo } from "react";
import { Directions, Gesture } from "react-native-gesture-handler";

export function useDetailGestures(id: number, onNavigate: (id: number) => void) {
  return useMemo(() => {
    const izquierda = Gesture.Fling()
      .direction(Directions.LEFT)
      .runOnJS(true)
      .onEnd(() => onNavigate(id + 1));
    const derecha = Gesture.Fling()
      .direction(Directions.RIGHT)
      .runOnJS(true)
      .onEnd(() => onNavigate(id - 1));
    return Gesture.Simultaneous(izquierda, derecha);
  }, [id, onNavigate]);
}
