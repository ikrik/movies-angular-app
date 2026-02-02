import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, type OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EMPTY, filter } from "rxjs";
import { catchError, finalize, switchMap, tap } from "rxjs/operators";
import { TmdbService, type TmdbMovieDetails } from "@shared/api/tmdb.service";
import { BackButton } from "@shared/ui/back-button/back-button";
import { ImageWithLoader } from "@shared/ui/image/image-with-loader";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

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

  readonly hero = `${IMAGE_BASE_URL}/original`;
  readonly poster = `${IMAGE_BASE_URL}/w780`;

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
}
