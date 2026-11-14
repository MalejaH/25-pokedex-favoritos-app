import { apiRequest } from "@/src/api/client";
import { loadSession } from "@/src/api/tokenStore";
import {
  applyRemoteEquipo,
  getEquipoIds,
  hasPendingEquipo,
  markEquipoSynced,
} from "@/src/repositories/equipoRepository";
import {
  applyRemoteFavoritos,
  listPendingFavoritos,
  markFavoritoSynced,
} from "@/src/repositories/favoritoRepository";
import type { RemoteDocument, SyncResponse } from "@/src/types";
import { ahoraIso } from "@/src/utils/format";

let sincronizando = false;

type EquipoResponse = SyncResponse & {
  items: RemoteDocument[];
};

async function sincronizarFavoritos(): Promise<void> {
  const pendientes = await listPendingFavoritos();
  for (const pendiente of pendientes) {
    if (pendiente.deleted === 1) {
      await apiRequest<{ ok: boolean }>(`/api/favorito/${pendiente.pokemon_id}`, {
        method: "DELETE",
      });
      await markFavoritoSynced(pendiente.pokemon_id, ahoraIso());
      continue;
    }
    const guardado = await apiRequest<RemoteDocument>(`/api/favorito/${pendiente.pokemon_id}`, {
      method: "PUT",
      body: { pokemon_id: pendiente.pokemon_id },
    });
    const actualizado = typeof guardado.updated_at === "string" ? guardado.updated_at : ahoraIso();
    await markFavoritoSynced(pendiente.pokemon_id, actualizado);
  }

  const remoto = await apiRequest<SyncResponse>("/api/favorito");
  await applyRemoteFavoritos(remoto.items, remoto.servidor_ahora);
}

async function sincronizarEquipo(): Promise<void> {
  if (await hasPendingEquipo()) {
    const remoto = await apiRequest<EquipoResponse>("/api/equipo", {
      method: "PUT",
      body: { pokemon_ids: await getEquipoIds() },
    });
    await markEquipoSynced(remoto.servidor_ahora);
    return;
  }
  const remoto = await apiRequest<EquipoResponse>("/api/equipo");
  await applyRemoteEquipo(remoto.items, remoto.servidor_ahora);
}

export async function sincronizarTodo(): Promise<void> {
  if (sincronizando) {
    return;
  }
  const session = await loadSession();
  if (session === null) {
    return;
  }
  sincronizando = true;
  try {
    await sincronizarFavoritos();
    await sincronizarEquipo();
  } finally {
    sincronizando = false;
  }
}
