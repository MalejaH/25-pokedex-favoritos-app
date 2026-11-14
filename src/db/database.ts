import * as SQLite from "expo-sqlite";

const MIGRATIONS: string[] = [
  `
  CREATE TABLE IF NOT EXISTS pokemon_cache (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    tipos TEXT NOT NULL,
    sprite_url TEXT,
    altura INTEGER,
    peso INTEGER,
    stats_json TEXT,
    remote_id TEXT,
    updated_at TEXT,
    deleted INTEGER NOT NULL DEFAULT 0,
    pending INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS favorito (
    pokemon_id INTEGER PRIMARY KEY,
    agregado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remote_id TEXT,
    updated_at TEXT,
    deleted INTEGER NOT NULL DEFAULT 0,
    pending INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS equipo (
    posicion INTEGER PRIMARY KEY CHECK (posicion BETWEEN 1 AND 6),
    pokemon_id INTEGER NOT NULL,
    remote_id TEXT,
    updated_at TEXT,
    deleted INTEGER NOT NULL DEFAULT 0,
    pending INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS meta (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_favorito_pending ON favorito (pending);
  CREATE INDEX IF NOT EXISTS idx_equipo_pending ON equipo (pending);
  CREATE INDEX IF NOT EXISTS idx_cache_nombre ON pokemon_cache (nombre);
  `,
];

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function migrate(database: SQLite.SQLiteDatabase): Promise<void> {
  const row = await database.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  const current = row?.user_version ?? 0;
  for (let index = current; index < MIGRATIONS.length; index += 1) {
    const migration = MIGRATIONS[index];
    if (migration === undefined) {
      continue;
    }
    await database.execAsync(migration);
    await database.execAsync(`PRAGMA user_version = ${index + 1}`);
  }
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync("pokedex.db");
  await database.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  await migrate(database);
  return database;
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (databasePromise === null) {
    databasePromise = openDatabase();
  }
  return databasePromise;
}

export async function resetDatabaseForTests(): Promise<void> {
  databasePromise = null;
}
