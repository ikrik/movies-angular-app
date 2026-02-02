import type { Routes } from '@angular/router';

import { FavoritesPage } from '@pages/favorites/favorites';
import { HomePage } from '@pages/home/home';
import { MovieDetailsPage } from '@pages/movie-details/movie-details';
import { NotMovieFoundPage } from '@pages/not-movie-found/not-movie-found';

export const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'movie/:id',
    component: MovieDetailsPage
  },
  {
    path: 'favorites',
    component: FavoritesPage
  },
  {
    path: 'not-movie-found',
    component: NotMovieFoundPage
  }
];
