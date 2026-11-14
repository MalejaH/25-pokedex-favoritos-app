import { describe, expect, it } from "@jest/globals";
import { accelerationMagnitude, isShake, tiltFromRotation } from "../tilt";

describe("tiltFromRotation", () => {
  it("devuelve cero sin rotación", () => {
    expect(tiltFromRotation(null)).toEqual({ x: 0, y: 0 });
  });

  it("convierte grados a un rango -1..1 y recorta", () => {
    expect(tiltFromRotation({ alpha: 0, beta: 90, gamma: 22.5 })).toEqual({
      x: 0.5,
      y: 1,
    });
    expect(tiltFromRotation({ alpha: 0, beta: -90, gamma: -90 })).toEqual({
      x: -1,
      y: -1,
    });
  });

  it("usa valores por defecto cuando faltan ejes", () => {
    expect(tiltFromRotation({})).toEqual({ x: 0, y: 0 });
  });
});

describe("sacudida", () => {
  it("calcula la magnitud de la aceleración", () => {
    expect(accelerationMagnitude({ x: 0, y: 3, z: 4 })).toBe(5);
  });

  it("detecta una sacudida por encima del umbral", () => {
    expect(isShake(1.79)).toBe(false);
    expect(isShake(1.81)).toBe(true);
    expect(isShake(1.5, 1.2)).toBe(true);
  });
});
