import { computed, inject } from "@angular/core";
import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
  patchState,
} from "@ngrx/signals";

import type { MovieEntity } from "./movie.mapper";

export interface FavoritesState {
  ids: number[];
  entities: Record<number, MovieEntity>;
}

const normalizeFavorites = (items: MovieEntity[]): FavoritesState => {
  const ids: number[] = [];
  const entities: Record<number, MovieEntity> = {};

  for (const item of items) {
    if (entities[item.id]) {
      continue;
    }
    ids.push(item.id);
    entities[item.id] = item;
  }

  return { ids, entities };
};

export const FavoritesStore = signalStore(
  { providedIn: "root" },
  withState<FavoritesState>({
    ids: [],
    entities: {},
  }),
  withComputed((store) => ({
    items: computed(() =>
      store
        .ids()
        .map((id) => store.entities()[id])
        .filter((item): item is MovieEntity => !!item),
    ),
  })),
  withMethods((store) => ({
    setFavorites(items: MovieEntity[]): void {
      patchState(store, normalizeFavorites(items));
    },
    addFavorite(item: MovieEntity): void {
      if (store.entities()[item.id]) {
        return;
      }
      patchState(store, {
        ids: [...store.ids(), item.id],
        entities: { ...store.entities(), [item.id]: item },
      });
    },
    removeFavorite(id: number): void {
      if (!store.entities()[id]) {
        return;
      }
      const { [id]: _removed, ...rest } = store.entities();
      patchState(store, {
        ids: store.ids().filter((existing) => existing !== id),
        entities: rest,
      });
    },
  })),
  withHooks({
    onInit(store) {
      if (typeof window === "undefined" || typeof localStorage === "undefined") {
        return;
      }

      try {
        const raw = localStorage.getItem("favorites_store");
        if (raw) {
          const parsed = JSON.parse(raw) as FavoritesState | { items: MovieEntity[] };
          if (Array.isArray((parsed as { items?: MovieEntity[] }).items)) {
            patchState(store, normalizeFavorites((parsed as { items: MovieEntity[] }).items));
          } else {
            patchState(store, parsed as FavoritesState);
          }
          localStorage.removeItem("favorites_store");
        }
      } catch {
        // ignore corrupted cache
      }

      const handler = () => {
        const snapshot: FavoritesState = {
          ids: store.ids(),
          entities: store.entities(),
        };
        localStorage.setItem("favorites_store", JSON.stringify(snapshot));
      };

      window.addEventListener("beforeunload", handler);
    },
  }),
);
