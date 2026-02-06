# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the Angular app, organized with Feature-Sliced Design (FSD): `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`.
- `public/` holds static assets copied into the build output.
- `src/environments/` stores runtime configuration (TMDB API URL/token) with production file replacement.
- `dist/` is the build output (served by `start:prod`).

## Build, Test, and Development Commands
- `pnpm install`: install dependencies.
- `pnpm start`: run the dev server at `http://localhost:4200/` with live reload.
- `pnpm watch`: rebuild continuously in development mode.
- `pnpm build`: production build to `dist/`.
- `pnpm start:prod`: serve `dist/movies-angular-app/browser` locally.
- `pnpm test`: run unit tests.
- `pnpm lint`: Biome lint on `src/`.
- `pnpm format`: Biome format on `src/`.
- `pnpm check`: Biome lint + format checks.

## Coding Style & Naming Conventions
- Use Biome formatting: 2-space indentation, 100-char line width (`biome.json`).
- Prefer single quotes in TypeScript; HTML formatting is handled by Prettier with the Angular parser.
- Keep FSD boundaries: avoid cross-layer imports; use path aliases like `@shared/*`, `@features/*`, `@pages/*` (`tsconfig.json`).
- Component styles use Less (`angular.json`), and tests are named `*.spec.ts` next to the source.

## Testing Guidelines
- Tests use Angular `TestBed` with Vitest (`vi` mocks) in `src/**/*.spec.ts`.
- Run all tests with `pnpm test` before opening a PR; add tests for new behavior and bug fixes.

## Commit & Pull Request Guidelines
- Follow Conventional Commits: `type(scope): summary` (e.g., `fix(ui): ensure dialog returns boolean`).
- PRs should include a concise summary, rationale, and the tests run.
- For UI changes, include before/after screenshots or a short video.
- Link related issues or notes if applicable.

## Security & Configuration Tips
- TMDB configuration lives in `src/environments/`. If you rotate keys, update both dev and production files and avoid exposing personal tokens.
