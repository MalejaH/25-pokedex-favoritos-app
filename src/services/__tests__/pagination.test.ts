import { describe, expect, it } from "@jest/globals";
import { mergeUnique, siguientePagina } from "../pagination";
import type { PokemonListItem } from "@/src/types";

const bulbasaur: PokemonListItem = { id: 1, nombre: "bulbasaur", sprite_url: null };
const ivysaur: PokemonListItem = { id: 2, nombre: "ivysaur", sprite_url: null };

describe("mergeUnique", () => {
  it("conserva el orden y elimina duplicados entre páginas", () => {
    expect(mergeUnique([bulbasaur], [bulbasaur, ivysaur])).toEqual([bulbasaur, ivysaur]);
  });

  it("no muta las listas originales", () => {
    const primera = [bulbasaur];
    const segunda = [ivysaur];
    mergeUnique(primera, segunda);
    expect(primera).toHaveLength(1);
    expect(segunda).toHaveLength(1);
  });
});

describe("siguientePagina", () => {
  it("calcula la siguiente página", () => {
    expect(siguientePagina(0, 20, 20, 100)).toBe(20);
    expect(siguientePagina(80, 20, 20, 120)).toBe(100);
  });

  it("devuelve null al terminar o sin resultados", () => {
    expect(siguientePagina(0, 20, 20, 20)).toBeNull();
    expect(siguientePagina(0, 0, 20, 100)).toBeNull();
  });
});
