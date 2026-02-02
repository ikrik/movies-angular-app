# Moviescope

Angular 21 app using **Feature‑Sliced Design (FSD)** and TMDB for movie data.

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

One HTTP interceptors are used:
- **Auth interceptor**: adds `Authorization: Bearer <apiToken>`.

## App functionality (high level)

- **ImageWithLoader**: shows a loader/placeholder while images load and handles failed images - in slow connection loads blur low quality image and when the actual image is loaded it makes a smooth transition to the high quality one.
- **PersistenceService**: stores app state to localStorage on unload and restores on next load (with stale‑data guard).
- **MoviesStore / FavoritesStore**: signal-based state for lists and favorites.
- **Search**: debounced autocomplete powered by TMDB search.
- **Dialogs**: edit and confirm dialogs use Angular Material.

## Notes

- Angular Material is used for UI components.
- Dark theme is applied globally.
