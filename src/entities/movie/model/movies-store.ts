import { signalStore, withMethods, withState, patchState } from "@ngrx/signals";
import type { MovieEntity } from "./movie.mapper";

export interface MoviesState {
  items: MovieEntity[];
  page: number;
  totalPages: number;
  totalResults: number;
  lastVisibleIndex: number;
}

export const MoviesStore = signalStore(
  { providedIn: "root" },
  withState<MoviesState>({
    items: [],
    page: 0,
    totalPages: 0,
    totalResults: 0,
    lastVisibleIndex: -1,
  }),
  withMethods((store) => ({
    setPage(page: number): void {
      patchState(store, { page });
    },
    setResults(items: MovieEntity[], totalPages: number, totalResults: number): void {
      patchState(store, { items, totalPages, totalResults });
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
      });
    },
    setLastVisibleIndex(index: number): void {
      patchState(store, { lastVisibleIndex: index });
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

      patchState(store, { items });
      return updated;
    },
    clear(): void {
      patchState(store, {
        items: [],
        page: 1,
        totalPages: 0,
        totalResults: 0,
        lastVisibleIndex: -1,
      });
    },
  })),
);
