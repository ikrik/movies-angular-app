# MoviesAngularApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

## Feature-Sliced Design (FSD)

The project uses a Feature-Sliced Design layout. The Angular root `src/app` acts as the FSD **app** layer, and the other layers live at `src/*`:

```
src/
  app/        # app layer (Angular root)
  processes/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Path aliases are configured in `tsconfig.json`:

```
@app/*
@processes/*
@pages/*
@widgets/*
@features/*
@entities/*
@shared/*
```

## Development server

To start a local development server, run:

```bash
pnpm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
pnpm ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
pnpm ng generate --help
```

## Building

To build the project run:

```bash
pnpm build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
pnpm test
```

## Code quality (Biome)

Run Biome to lint, format, or check the codebase:

```bash
pnpm lint
pnpm format
pnpm check
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
