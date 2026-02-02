import type { Routes } from "@angular/router";

import { HomePage } from "@pages/home/home";

export const routes: Routes = [
  {
    path: "",
    component: HomePage,
  },
  {
    path: "movie/:id",
    loadComponent: () =>
      import("@pages/movie-details/movie-details").then((m) => m.MovieDetailsPage),
  },
  {
    path: "favorites",
    loadComponent: () => import("@pages/favorites/favorites").then((m) => m.FavoritesPage),
  },
  {
    path: "not-movie-found",
    loadComponent: () =>
      import("@pages/not-movie-found/not-movie-found").then((m) => m.NotMovieFoundPage),
  },
];
