import { MovieActionsService } from "@features/movies/movie-actions.service";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  type MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  tap,
} from "rxjs/operators";
import { of, type Observable } from "rxjs";
import { TmdbService, type TmdbMovieResult } from "@shared/api/tmdb.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ImageWithLoader } from "@shared/ui/image/image-with-loader";
import { tmdbPosterUrl } from "@shared/lib/tmdb-image";

@Component({
  selector: "movies-search",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ImageWithLoader,
  ],
  templateUrl: "./movies-search.html",
  styleUrl: "./movies-search.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesSearch {
  private readonly tmdbService = inject(TmdbService);
  private readonly movieActions = inject(MovieActionsService);
  readonly searchControl = new FormControl("", { nonNullable: true });
  loading = false;
  private latestResults: TmdbMovieResult[] = [];

  readonly results: Observable<TmdbMovieResult[]> = this.searchControl.valueChanges.pipe(
    startWith(""),
    map((value) => value.trim()),
    debounceTime(350),
    distinctUntilChanged(),
    switchMap((value) => {
      if (!value || value.length < 3) {
        return of([]);
      }
      this.loading = true;
      return this.tmdbService.searchMovies(value).pipe(
        map((response) => response.results),
        finalize(() => {
          this.loading = false;
        }),
      );
    }),
    tap((results) => {
      this.latestResults = results;
    }),
  );

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const title = String(event.option.value);
    const match = this.latestResults.find(
      (movie) => movie.title.toLowerCase() === title.toLowerCase(),
    );
    if (match) {
      this.movieActions.goToDetails(match.id);
    }
  }

  onEnter(): void {
    const value = this.searchControl.value.trim().toLowerCase();
    if (!value || this.latestResults.length === 0) {
      return;
    }

    const match =
      this.latestResults.find((movie) => movie.title.toLowerCase() === value) ??
      this.latestResults[0];

    if (match) {
      this.movieActions.goToDetails(match.id);
    }
  }

  clear(e?: Event) {
    if (e) {
      e.stopPropagation();
    }

    this.searchControl.setValue("");
  }

  getPosterUrl(movie: TmdbMovieResult): string | null {
    return tmdbPosterUrl(movie.poster_path, "w92");
  }

  getReleaseYear(movie: TmdbMovieResult): string {
    return movie.release_date ? movie.release_date.slice(0, 4) : "—";
  }
}
