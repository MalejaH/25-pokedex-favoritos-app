import { describe, expect, it } from "@jest/globals";
import { agregarAlEquipo, quitarDelEquipo } from "../equipoRules";

describe("agregarAlEquipo", () => {
  it("agrega cuando hay espacio y no está repetido", () => {
    const resultado = agregarAlEquipo([1, 2], 25);
    expect(resultado).toEqual({ ok: true, ids: [1, 2, 25] });
  });

  it("bloquea el séptimo Pokémon", () => {
    const resultado = agregarAlEquipo([1, 2, 3, 4, 5, 6], 25);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.motivo).toBe("maximo");
      expect(resultado.mensaje).toContain("máximo 6");
    }
  });

  it("bloquea repetidos", () => {
    const resultado = agregarAlEquipo([25], 25);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.motivo).toBe("repetido");
    }
  });
});

describe("quitarDelEquipo", () => {
  it("quita solo el id indicado", () => {
    expect(quitarDelEquipo([1, 2, 3], 2)).toEqual([1, 3]);
  });
});
