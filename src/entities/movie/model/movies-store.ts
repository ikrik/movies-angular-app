import { inject } from "@angular/core";
import { signalStore, withHooks, withMethods, withState, patchState } from "@ngrx/signals";
import type { MovieEntity } from "./movie.mapper";
import { PersistenceService } from "@shared/persistence/persistence.service";

export interface MoviesState {
  items: MovieEntity[];
  page: number;
  totalPages: number;
  totalResults: number;
  lastVisibleIndex: number;
  latestStoreChange: number | null;
}

const isMoviesState = (value: unknown): value is MoviesState => {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as MoviesState;
  return (
    Array.isArray(candidate.items) &&
    typeof candidate.page === "number" &&
    typeof candidate.totalPages === "number" &&
    typeof candidate.totalResults === "number" &&
    typeof candidate.lastVisibleIndex === "number" &&
    (candidate.latestStoreChange === null || typeof candidate.latestStoreChange === "number")
  );
};

export const MoviesStore = signalStore(
  { providedIn: "root" },
  withState<MoviesState>({
    items: [],
    page: 0,
    totalPages: 0,
    totalResults: 0,
    lastVisibleIndex: -1,
    latestStoreChange: null,
  }),
  withMethods((store) => ({
    setPage(page: number): void {
      patchState(store, { page, latestStoreChange: Date.now() });
    },
    setResults(items: MovieEntity[], totalPages: number, totalResults: number): void {
      patchState(store, { items, totalPages, totalResults, latestStoreChange: Date.now() });
    },
    appendResults(
      items: MovieEntity[],
      page: number,
      totalPages: number,
      totalResults: number,
    ): void {
      patchState(store, {
        items: [...store.items(), ...items],
        page,
        totalPages,
        totalResults,
        latestStoreChange: Date.now(),
      });
    },
    setLastVisibleIndex(index: number): void {
      patchState(store, { lastVisibleIndex: index, latestStoreChange: Date.now() });
    },
    toggleFavorite(id: number): MovieEntity | null {
      let updated: MovieEntity | null = null;
      const items = store.items().map((item) => {
        if (item.id !== id) {
          return item;
        }
        updated = { ...item, favourite: !item.favourite };
        return updated;
      });

      if (updated) {
        patchState(store, { items, latestStoreChange: Date.now() });
      }
      return updated;
    },
    clear(): void {
      patchState(store, {
        items: [],
        page: 1,
        totalPages: 0,
        totalResults: 0,
        lastVisibleIndex: -1,
        latestStoreChange: Date.now(),
      });
    },
  })),
  withHooks({
    onInit(store) {
      const persistence = inject(PersistenceService);
      persistence.register(
        "movies_store",
        () => ({
          items: store.items(),
          page: store.page(),
          totalPages: store.totalPages(),
          totalResults: store.totalResults(),
          lastVisibleIndex: store.lastVisibleIndex(),
          latestStoreChange: store.latestStoreChange(),
        }),
        (value) => {
          if (isMoviesState(value)) {
            patchState(store, value);
            return;
          }
        },
      );
    },
  }),
);
