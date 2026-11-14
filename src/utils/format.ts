const STAT_LABELS: Record<string, string> = {
  hp: "PS",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "At. especial",
  "special-defense": "Def. especial",
  speed: "Velocidad",
};

export function capitalizar(value: string): string {
  if (value.length === 0) {
    return value;
  }
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function formatearAltura(decimetros: number): string {
  return `${(decimetros / 10).toFixed(1)} m`;
}

export function formatearPeso(hectogramos: number): string {
  return `${(hectogramos / 10).toFixed(1)} kg`;
}

export function etiquetaStat(stat: string): string {
  return STAT_LABELS[stat] ?? capitalizar(stat.replaceAll("-", " "));
}

export function mensajeDeError(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return "Ocurrió un error inesperado";
}

export function ahoraIso(): string {
  return new Date().toISOString();
}
