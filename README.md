# Moviescope

Angular 21 app using **Feature‑Sliced Design (FSD)** and TMDB for movie data.

<img width="2674" height="2332" alt="moviescope" src="https://github.com/user-attachments/assets/a8fa5cd1-6309-4cab-a4d6-5ccfb1dfc036" />
<br />
<br />
<img width="5022" height="2334" alt="moviescope-2" src="https://github.com/user-attachments/assets/d517d6e6-a89c-40b4-a191-f4e4ac57285f" />
<br />
<br />
<img width="3870" height="2334" alt="moviescope-3" src="https://github.com/user-attachments/assets/60101d81-d67a-4612-8cf3-0122872f7f13" />


## Run the app

```bash
pnpm install
pnpm start
```

Open `http://localhost:4200/`. The app reloads on file changes.

## Tests

```bash
pnpm test
```

## Production build

```bash
pnpm build
```

Artifacts are generated in `dist/`.

## Code quality checker (Biome)

```bash
pnpm lint
pnpm format
pnpm check
```

## Feature‑Sliced Design (FSD)

This project follows FSD to keep boundaries clear and scale features without coupling.

```
src/
  app/        # app layer (root Angular wiring)
  pages/      # route-level pages
  widgets/    # composable UI blocks used by pages
  features/   # user‑facing actions and logic
  entities/   # domain models + stores
  shared/     # reusable UI + utilities
```

Benefits:
- ✅ Clear ownership of UI and logic
- ✅ Predictable imports via path aliases
- ✅ Easier refactors as the app grows

Path aliases (see `tsconfig.json`):

```
@app/*
@pages/*
@widgets/*
@features/*
@entities/*
@shared/*
```

## Data source (TMDB)

Movie data comes from **TMDB** (The Movie Database) via `TmdbService`. The base URL and API token live in `src/environments/*` and are injected through `Config`.

## Interceptors

One HTTP interceptors is used:
- **Auth interceptor**: adds `Authorization: Bearer <apiToken>`.

## App functionality (high level)

- **ImageWithLoader**: shows a loader/placeholder while images load and handles failed images - in slow connection loads blur low quality image and when the actual image is loaded it makes a smooth transition to the high quality one.
- **PersistenceService**: The application persists its state to localStorage on page unload and restores it on the next load, with a built-in stale-data guard. 

    On reload, the app retrieves the previously saved state from `localStorage` and rehydrates the stores with it. Each store maintains a `latestStoreChange` timestamp (in milliseconds) that records the time of its most recent state update.

    During startup, the persistence service compares the latest `latestStoreChange` value across all stores. If the most recent update is older than **60 minutes**, the persisted state is considered stale and is ignored. In this case, no state is restored and the application initializes with a clean, default state.
- **MoviesStore / FavoritesStore**: signal-based state for lists and favorites.
- **Search**: debounced autocomplete powered by TMDB search.
- **Dialogs**: edit, delete and confirm dialogs use Angular Material.

## Notes

- Angular Material is used for UI components.
- Dark theme is applied globally.
