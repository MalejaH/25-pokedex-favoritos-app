import { useEffect, useRef, useState } from "react";
import { Accelerometer } from "expo-sensors";
import { accelerationMagnitude, isShake } from "./tilt";

const COOLDOWN_MS = 1200;

export function useShake(onShake: () => void): boolean {
  const [available, setAvailable] = useState(false);
  const callbackRef = useRef(onShake);
  const lastShakeRef = useRef(0);

  useEffect(() => {
    callbackRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    let cancelled = false;
    let subscription: { remove: () => void } | null = null;

    async function start(): Promise<void> {
      try {
        const isAvailable = await Accelerometer.isAvailableAsync();
        if (cancelled) {
          return;
        }
        setAvailable(isAvailable);
        if (!isAvailable) {
          return;
        }
        Accelerometer.setUpdateInterval(200);
        subscription = Accelerometer.addListener((event) => {
          const now = Date.now();
          if (now - lastShakeRef.current < COOLDOWN_MS) {
            return;
          }
          if (isShake(accelerationMagnitude(event))) {
            lastShakeRef.current = now;
            callbackRef.current();
          }
        });
      } catch {
        if (!cancelled) {
          setAvailable(false);
        }
      }
    }

    void start();

    return () => {
      cancelled = true;
      subscription?.remove();
      subscription = null;
    };
  }, []);

  return available;
}
