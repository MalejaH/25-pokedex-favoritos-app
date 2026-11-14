import { getDatabase } from "@/src/db/database";
import type { PokemonDetail, PokemonListItem } from "@/src/types";
import { ahoraIso } from "@/src/utils/format";

type PokemonRow = {
  id: number;
  nombre: string;
  tipos: string;
  sprite_url: string | null;
  altura: number | null;
  peso: number | null;
  stats_json: string | null;
};

function parseStringArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function parseStats(value: string | null): Record<string, number> {
  if (value === null) {
    return {};
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed === null || typeof parsed !== "object") {
      return {};
    }
    const stats: Record<string, number> = {};
    for (const [key, raw] of Object.entries(parsed)) {
      if (typeof raw === "number") {
        stats[key] = raw;
      }
    }
    return stats;
  } catch {
    return {};
  }
}

function toDetail(row: PokemonRow): PokemonDetail {
  return {
    id: row.id,
    nombre: row.nombre,
    tipos: parseStringArray(row.tipos),
    sprite_url: row.sprite_url,
    altura: row.altura ?? 0,
    peso: row.peso ?? 0,
    stats: parseStats(row.stats_json),
  };
}

export async function savePokemon(detail: PokemonDetail): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO pokemon_cache
      (id, nombre, tipos, sprite_url, altura, peso, stats_json, remote_id, updated_at, deleted, pending)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
     ON CONFLICT(id) DO UPDATE SET
       nombre = excluded.nombre,
       tipos = excluded.tipos,
       sprite_url = excluded.sprite_url,
       altura = excluded.altura,
       peso = excluded.peso,
       stats_json = excluded.stats_json,
       updated_at = excluded.updated_at,
       deleted = 0`,
    detail.id,
    detail.nombre,
    JSON.stringify(detail.tipos),
    detail.sprite_url,
    detail.altura,
    detail.peso,
    JSON.stringify(detail.stats),
    String(detail.id),
    ahoraIso(),
  );
}

export async function getPokemonById(id: number): Promise<PokemonDetail | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<PokemonRow>(
    "SELECT * FROM pokemon_cache WHERE id = ? AND deleted = 0",
    id,
  );
  return row === null ? null : toDetail(row);
}

export async function searchLocalPokemons(query: string, limit = 20): Promise<PokemonListItem[]> {
  const database = await getDatabase();
  const normalized = `%${query.trim().toLowerCase()}%`;
  const rows = await database.getAllAsync<PokemonRow>(
    `SELECT * FROM pokemon_cache
     WHERE deleted = 0 AND lower(nombre) LIKE ?
     ORDER BY id ASC
     LIMIT ?`,
    normalized,
    limit,
  );
  return rows.map((row) => ({
    id: row.id,
    nombre: row.nombre,
    sprite_url: row.sprite_url,
  }));
}

export async function countLocalPokemons(): Promise<number> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM pokemon_cache WHERE deleted = 0",
  );
  return row?.total ?? 0;
}
