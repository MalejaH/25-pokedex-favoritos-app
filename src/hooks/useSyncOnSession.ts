import { useEffect } from "react";

export function useSyncOnSession(
  active: boolean,
  sincronizar: () => Promise<void>,
  intervaloMs = 60000,
): void {
  useEffect(() => {
    if (!active) {
      return;
    }
    void sincronizar();
    const interval = setInterval(() => {
      void sincronizar();
    }, intervaloMs);
    return () => {
      clearInterval(interval);
    };
  }, [active, sincronizar, intervaloMs]);
}
