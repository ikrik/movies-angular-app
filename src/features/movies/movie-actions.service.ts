import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { FavoritesStore } from "@entities/movie/model/favorites-store";
import { MoviesStore } from "@entities/movie/model/movies-store";
import { TmdbService } from "@shared/api/tmdb.service";
import { SnackBarService } from "@shared/ui/snackbar/snackbar.service";

@Injectable({ providedIn: "root" })
export class MovieActionsService {
  private readonly moviesStore = inject(MoviesStore);
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly tmdbService = inject(TmdbService);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackBarService);

  goToDetails(movieId: number): void {
    this.tmdbService.getMovieDetails(movieId).subscribe({
      next: (movie) => {
        if (!movie) {
          void this.router.navigate(["/not-movie-found"]);
          return;
        }
        void this.router.navigate(["/movie", movieId]);
      },
      error: () => {
        void this.router.navigate(["/not-movie-found"]);
      },
    });
  }

  toggleFavorite(movieId: number): void {
    const updated = this.moviesStore.toggleFavorite(movieId);
    if (!updated) {
      return;
    }

    if (updated.favourite) {
      this.snackbar.open(`Successfully added ${updated.title} to yout favorites`, "success");
      this.favoritesStore.addFavorite(updated);
    } else {
      this.favoritesStore.removeFavorite(updated.id);
    }
  }
}
