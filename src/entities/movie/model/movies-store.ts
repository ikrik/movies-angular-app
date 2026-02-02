import { inject } from "@angular/core";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { PersistenceService } from "@shared/persistence/persistence.service";
import type { MovieEntity } from "./movie.mapper";

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
    updateMovie(id: number, updates: { title: string; year: string; overview: string }): void {
      if (!store.items().some((item) => item.id === id)) {
        return;
      }

      const items = store.items().map((item) =>
        item.id === id
          ? {
              ...item,
              title: updates.title,
              year: updates.year,
              overview: updates.overview,
            }
          : item,
      );

      patchState(store, { items, latestStoreChange: Date.now() });
    },
    removeMovie(id: number): void {
      if (!store.items().some((item) => item.id === id)) {
        return;
      }
      const items = store.items().filter((item) => item.id !== id);
      const totalResults = store.totalResults();
      const nextTotalResults = totalResults > 0 ? totalResults - 1 : 0;
      const nextLastVisibleIndex = Math.min(store.lastVisibleIndex(), items.length - 1);
      patchState(store, {
        items,
        totalResults: nextTotalResults,
        lastVisibleIndex: Math.max(nextLastVisibleIndex, -1),
        latestStoreChange: Date.now(),
      });
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
