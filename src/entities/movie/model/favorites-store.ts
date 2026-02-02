import { signalStore, withHooks, withMethods, withState, patchState } from '@ngrx/signals';

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
  })),
  withHooks({
    onInit(store) {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }

      try {
        const raw = localStorage.getItem('favorites_store');
        if (raw) {
          const parsed = JSON.parse(raw) as FavoritesState;
          patchState(store, parsed);
          localStorage.removeItem('favorites_store');
        }
      } catch {
        // ignore corrupted cache
      }

      const handler = () => {
        const snapshot: FavoritesState = {
          items: store.items()
        };
        localStorage.setItem('favorites_store', JSON.stringify(snapshot));
      };

      window.addEventListener('beforeunload', handler);
    }
  })
);
