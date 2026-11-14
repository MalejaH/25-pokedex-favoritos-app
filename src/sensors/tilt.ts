export type Rotation = {
  alpha?: number | null;
  beta?: number | null;
  gamma?: number | null;
};

export type Tilt = {
  x: number;
  y: number;
};

export function clampTilt(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

export function tiltFromRotation(rotation: Rotation | null): Tilt {
  if (rotation === null) {
    return { x: 0, y: 0 };
  }
  const gamma = rotation.gamma ?? 0;
  const beta = rotation.beta ?? 45;
  return {
    x: clampTilt(gamma / 45),
    y: clampTilt((beta - 45) / 45),
  };
}

export function accelerationMagnitude(acceleration: { x: number; y: number; z: number }): number {
  return Math.sqrt(
    acceleration.x * acceleration.x +
      acceleration.y * acceleration.y +
      acceleration.z * acceleration.z,
  );
}

export function isShake(magnitude: number, threshold = 1.8): boolean {
  return magnitude > threshold;
}
