import { useEffect, useState } from "react";
import { DeviceMotion } from "expo-sensors";
import { tiltFromRotation, type Tilt } from "./tilt";

type TiltState = {
  tilt: Tilt;
  available: boolean | null;
  permissionDenied: boolean;
};

type TiltSetup = {
  available: boolean;
  permissionDenied: boolean;
  remove: () => void;
};

const INICIAL: Tilt = { x: 0, y: 0 };

async function setupTilt(onTilt: (tilt: Tilt) => void): Promise<TiltSetup> {
  try {
    const permission = await DeviceMotion.requestPermissionsAsync();
    if (!permission.granted) {
      return { available: false, permissionDenied: true, remove: () => undefined };
    }
    const available = await DeviceMotion.isAvailableAsync();
    if (!available) {
      return { available: false, permissionDenied: false, remove: () => undefined };
    }
    DeviceMotion.setUpdateInterval(60);
    const subscription = DeviceMotion.addListener((event) => {
      onTilt(tiltFromRotation(event.rotation ?? null));
    });
    return { available: true, permissionDenied: false, remove: () => subscription.remove() };
  } catch {
    return { available: false, permissionDenied: false, remove: () => undefined };
  }
}

export function useTilt(enabled: boolean): TiltState {
  const [state, setState] = useState<TiltState>({
    tilt: INICIAL,
    available: null,
    permissionDenied: false,
  });

  useEffect(() => {
    if (!enabled) {
      setState({ tilt: INICIAL, available: null, permissionDenied: false });
      return;
    }
    let cancelled = false;
    let remove: (() => void) | null = null;
    void setupTilt((tilt) => {
      setState((previous) => ({ ...previous, tilt }));
    }).then((result) => {
      if (cancelled) {
        result.remove();
        return;
      }
      setState({
        tilt: INICIAL,
        available: result.available,
        permissionDenied: result.permissionDenied,
      });
      remove = result.remove;
    });
    return () => {
      cancelled = true;
      remove?.();
      remove = null;
    };
  }, [enabled]);

  return state;
}
