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
import { PersistenceService } from "@shared/persistence/persistence.service";

export interface FavoritesState {
  ids: number[];
  entities: Record<number, MovieEntity>;
  latestStoreChange: number | null;
}

const normalizeFavorites = (
  items: MovieEntity[],
  latestStoreChange: number | null = null,
): FavoritesState => {
  const ids: number[] = [];
  const entities: Record<number, MovieEntity> = {};

  for (const item of items) {
    if (entities[item.id]) {
      continue;
    }
    ids.push(item.id);
    entities[item.id] = item;
  }

  return { ids, entities, latestStoreChange };
};

export const FavoritesStore = signalStore(
  { providedIn: "root" },
  withState<FavoritesState>({
    ids: [],
    entities: {},
    latestStoreChange: null,
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
      patchState(store, normalizeFavorites(items, Date.now()));
    },
    addFavorite(item: MovieEntity): void {
      if (store.entities()[item.id]) {
        return;
      }
      patchState(store, {
        ids: [...store.ids(), item.id],
        entities: { ...store.entities(), [item.id]: item },
        latestStoreChange: Date.now(),
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
        latestStoreChange: Date.now(),
      });
    },
    clear(): void {
      patchState(store, {
        ids: [],
        entities: {},
        latestStoreChange: null,
      });
    },
  })),
  withHooks({
    onInit(store) {
      const persistence = inject(PersistenceService);
      persistence.register<FavoritesState>(
        "favorites_store",
        () => ({
          ids: store.ids(),
          entities: store.entities(),
          latestStoreChange: store.latestStoreChange(),
        }),
        (value) => {
          if (!value || typeof value !== "object") {
            return;
          }

          const candidate = value as FavoritesState & { latestStoreChange?: unknown };

          // The localStorage value has exactly the FavoritesState shape
          if (
            Array.isArray(candidate.ids) &&
            candidate.entities &&
            typeof candidate.entities === "object" &&
            (candidate.latestStoreChange === null ||
              typeof candidate.latestStoreChange === "number")
          ) {
            patchState(store, candidate);
            return;
          }

          // The localStorage value has the FavoritesState shape but missing the latestStorageChange
          if (
            Array.isArray(candidate.ids) &&
            candidate.entities &&
            typeof candidate.entities === "object" &&
            candidate.latestStoreChange === undefined
          ) {
            patchState(store, {
              ids: candidate.ids,
              entities: candidate.entities,
              latestStoreChange: Date.now(),
            });
          }
        },
      );
    },
  }),
);
