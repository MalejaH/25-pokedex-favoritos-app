export type PokemonStats = Record<string, number>;

export type PokemonDetail = {
  id: number;
  nombre: string;
  tipos: string[];
  sprite_url: string | null;
  altura: number;
  peso: number;
  stats: PokemonStats;
};

export type PokemonListItem = {
  id: number;
  nombre: string;
  sprite_url: string | null;
};

export type PokemonPage = {
  items: PokemonListItem[];
  total: number;
  offset: number;
  limit: number;
  siguiente: number | null;
  offline?: boolean;
};

export type Favorito = {
  pokemon_id: number;
  nombre: string;
  sprite_url: string | null;
  tipos: string[];
  agregado_en: string;
};

export type EquipoItem = {
  posicion: number;
  pokemon_id: number;
  nombre: string;
  sprite_url: string | null;
  tipos: string[];
};

export type SessionUser = {
  id: string;
  email: string;
};

export type Session = {
  token: string;
  refreshToken: string;
  expiraEn: number;
  usuario: SessionUser;
};

export type ErrorDetail = {
  campo: string;
  mensaje: string;
};

export type RemoteDocument = {
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  [key: string]: unknown;
};

export type SyncResponse = {
  items: RemoteDocument[];
  servidor_ahora: string;
};
