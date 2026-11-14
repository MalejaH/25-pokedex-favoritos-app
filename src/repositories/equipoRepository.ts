import { getDatabase } from "@/src/db/database";
import type { EquipoItem, RemoteDocument } from "@/src/types";
import { ahoraIso } from "@/src/utils/format";

type EquipoRow = {
  posicion: number;
  pokemon_id: number;
  nombre: string | null;
  sprite_url: string | null;
  tipos: string | null;
};

function parseTipos(value: string | null): string[] {
  if (value === null) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function toEquipoItem(row: EquipoRow): EquipoItem {
  return {
    posicion: row.posicion,
    pokemon_id: row.pokemon_id,
    nombre: row.nombre ?? `Pokémon #${row.pokemon_id}`,
    sprite_url: row.sprite_url,
    tipos: parseTipos(row.tipos),
  };
}

export async function listEquipo(): Promise<EquipoItem[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<EquipoRow>(
    `SELECT e.posicion, e.pokemon_id, p.nombre, p.sprite_url, p.tipos
     FROM equipo e
     LEFT JOIN pokemon_cache p ON p.id = e.pokemon_id
     WHERE e.deleted = 0
     ORDER BY e.posicion ASC`,
  );
  return rows.map(toEquipoItem);
}

export async function getEquipoIds(): Promise<number[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ pokemon_id: number }>(
    "SELECT pokemon_id FROM equipo WHERE deleted = 0 ORDER BY posicion ASC",
  );
  return rows.map((row) => row.pokemon_id);
}

export async function replaceLocalEquipo(pokemonIds: number[]): Promise<void> {
  const database = await getDatabase();
  const now = ahoraIso();
  await database.withTransactionAsync(async () => {
    await database.runAsync("DELETE FROM equipo");
    for (let index = 0; index < pokemonIds.length; index += 1) {
      const pokemonId = pokemonIds[index];
      if (pokemonId === undefined) {
        continue;
      }
      const posicion = index + 1;
      await database.runAsync(
        `INSERT INTO equipo (posicion, pokemon_id, remote_id, updated_at, deleted, pending)
         VALUES (?, ?, ?, ?, 0, 1)`,
        posicion,
        pokemonId,
        String(posicion),
        now,
      );
    }
  });
}

export async function hasPendingEquipo(): Promise<boolean> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM equipo WHERE pending = 1",
  );
  return (row?.total ?? 0) > 0;
}

export async function markEquipoSynced(updatedAt: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync("UPDATE equipo SET pending = 0, updated_at = ?", updatedAt);
}

function remotePosition(document: RemoteDocument): number | null {
  const value = document["posicion"];
  if (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 6) {
    return value;
  }
  return null;
}

function remotePokemonId(document: RemoteDocument): number | null {
  const value = document["pokemon_id"];
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

export async function applyRemoteEquipo(
  documents: RemoteDocument[],
  servidorAhora: string,
): Promise<void> {
  const database = await getDatabase();
  const activos = documents
    .filter((document) => document.deleted_at === null || document.deleted_at === undefined)
    .map((document) => ({
      posicion: remotePosition(document),
      pokemonId: remotePokemonId(document),
    }))
    .filter(
      (item): item is { posicion: number; pokemonId: number } =>
        item.posicion !== null && item.pokemonId !== null,
    )
    .sort((left, right) => left.posicion - right.posicion);

  await database.withTransactionAsync(async () => {
    await database.runAsync("DELETE FROM equipo");
    for (const item of activos) {
      await database.runAsync(
        `INSERT INTO equipo (posicion, pokemon_id, remote_id, updated_at, deleted, pending)
         VALUES (?, ?, ?, ?, 0, 0)`,
        item.posicion,
        item.pokemonId,
        String(item.posicion),
        servidorAhora,
      );
    }
  });
}
