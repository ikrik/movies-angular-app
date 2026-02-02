import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, type OnInit, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { type TmdbMovieDetails, TmdbService } from "@shared/api/tmdb.service";
import { tmdbPosterUrl } from "@shared/lib/tmdb-image";
import { BackButton } from "@shared/ui/back-button/back-button";
import { ImageWithLoader } from "@shared/ui/image/image-with-loader";
import { EMPTY, filter } from "rxjs";
import { catchError, finalize, switchMap, tap } from "rxjs/operators";

@Component({
  selector: "movies-details-page",
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ImageWithLoader,
    BackButton,
  ],
  templateUrl: "./movie-details.html",
  styleUrl: "./movie-details.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tmdbService = inject(TmdbService);
  private readonly router = inject(Router);

  readonly movie = signal<TmdbMovieDetails | null>(null);
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter((params) => params.has("id")),
        tap(() => {
          this.isLoading.set(true);
          this.movie.set(null);
        }),
        switchMap((params) =>
          this.tmdbService.getMovieDetails(Number(params.get("id"))).pipe(
            catchError(() => {
              void this.router.navigate(["/not-movie-found"]);
              return EMPTY;
            }),
            finalize(() => {
              this.isLoading.set(false);
            }),
          ),
        ),
      )
      .subscribe((movie) => {
        this.movie.set(movie);
      });
  }

  getHeroUrl(path: string | null | undefined): string | null {
    return tmdbPosterUrl(path, "original");
  }

  getPosterUrl(path: string | null | undefined): string | null {
    return tmdbPosterUrl(path, "w780");
  }

  getPosterPlaceholder(path: string | null | undefined): string | null {
    return tmdbPosterUrl(path, "w92");
  }
}
