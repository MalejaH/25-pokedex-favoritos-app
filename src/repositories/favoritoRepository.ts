import { getDatabase } from "@/src/db/database";
import type { Favorito, RemoteDocument } from "@/src/types";
import { ahoraIso } from "@/src/utils/format";

type FavoritoRow = {
  pokemon_id: number;
  agregado_en: string;
  nombre: string | null;
  sprite_url: string | null;
  tipos: string | null;
};

type FavoritoPendiente = {
  pokemon_id: number;
  deleted: number;
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

function toFavorito(row: FavoritoRow): Favorito {
  return {
    pokemon_id: row.pokemon_id,
    nombre: row.nombre ?? `Pokémon #${row.pokemon_id}`,
    sprite_url: row.sprite_url,
    tipos: parseTipos(row.tipos),
    agregado_en: row.agregado_en,
  };
}

export async function listFavoritos(): Promise<Favorito[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<FavoritoRow>(
    `SELECT f.pokemon_id, f.agregado_en,
            p.nombre, p.sprite_url, p.tipos
     FROM favorito f
     LEFT JOIN pokemon_cache p ON p.id = f.pokemon_id
     WHERE f.deleted = 0
     ORDER BY f.agregado_en DESC`,
  );
  return rows.map(toFavorito);
}

export async function listFavoritoIds(): Promise<number[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{ pokemon_id: number }>(
    "SELECT pokemon_id FROM favorito WHERE deleted = 0",
  );
  return rows.map((row) => row.pokemon_id);
}

export async function isFavorito(pokemonId: number): Promise<boolean> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM favorito WHERE pokemon_id = ? AND deleted = 0",
    pokemonId,
  );
  return (row?.total ?? 0) > 0;
}

export async function addFavorito(pokemonId: number): Promise<void> {
  const database = await getDatabase();
  const now = ahoraIso();
  await database.runAsync(
    `INSERT INTO favorito (pokemon_id, agregado_en, remote_id, updated_at, deleted, pending)
     VALUES (?, ?, ?, ?, 0, 1)
     ON CONFLICT(pokemon_id) DO UPDATE SET
       deleted = 0,
       pending = 1,
       updated_at = excluded.updated_at`,
    pokemonId,
    now,
    String(pokemonId),
    now,
  );
}

export async function removeFavorito(pokemonId: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE favorito
     SET deleted = 1, pending = 1, updated_at = ?
     WHERE pokemon_id = ?`,
    ahoraIso(),
    pokemonId,
  );
}

export async function listPendingFavoritos(): Promise<FavoritoPendiente[]> {
  const database = await getDatabase();
  return database.getAllAsync<FavoritoPendiente>(
    "SELECT pokemon_id, deleted FROM favorito WHERE pending = 1 ORDER BY updated_at ASC",
  );
}

export async function markFavoritoSynced(pokemonId: number, updatedAt: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    "UPDATE favorito SET pending = 0, updated_at = ? WHERE pokemon_id = ?",
    updatedAt,
    pokemonId,
  );
}

function remotePokemonId(document: RemoteDocument): number | null {
  const value = document["pokemon_id"];
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

export async function applyRemoteFavoritos(
  documents: RemoteDocument[],
  servidorAhora: string,
): Promise<void> {
  const database = await getDatabase();
  await database.withTransactionAsync(async () => {
    for (const document of documents) {
      const pokemonId = remotePokemonId(document);
      if (pokemonId === null) {
        continue;
      }
      if (document.deleted_at !== null && document.deleted_at !== undefined) {
        await database.runAsync(
          `UPDATE favorito SET deleted = 1, pending = 0, updated_at = ?
           WHERE pokemon_id = ?`,
          servidorAhora,
          pokemonId,
        );
        continue;
      }
      const agregadoEn =
        typeof document.created_at === "string" ? document.created_at : servidorAhora;
      await database.runAsync(
        `INSERT INTO favorito (pokemon_id, agregado_en, remote_id, updated_at, deleted, pending)
         VALUES (?, ?, ?, ?, 0, 0)
         ON CONFLICT(pokemon_id) DO UPDATE SET
           deleted = 0,
           pending = 0,
           updated_at = excluded.updated_at`,
        pokemonId,
        agregadoEn,
        document.id,
        servidorAhora,
      );
    }
  });
}
