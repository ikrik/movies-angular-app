import { signalStore, withMethods, withState, patchState } from '@ngrx/signals';

import type { MovieEntity } from './movie.mapper';

export interface FavoritesState {
  items: MovieEntity[];
}

export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState<FavoritesState>({
    items: []
  }),
  withMethods((store) => ({
    setFavorites(items: MovieEntity[]): void {
      patchState(store, { items });
    },
    addFavorite(item: MovieEntity): void {
      if (store.items().some((existing) => existing.id === item.id)) {
        return;
      }
      patchState(store, { items: [...store.items(), item] });
    },
    removeFavorite(id: number): void {
      patchState(store, { items: store.items().filter((item) => item.id !== id) });
    }
  }))
);
