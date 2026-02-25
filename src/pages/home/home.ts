import { CommonModule } from "@angular/common";
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  type OnDestroy,
  type OnInit,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { SnackBarService } from "@shared/ui/snackbar/snackbar.service";

import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { mapTmdbMovieToEntity } from "@entities/movie/model/movie.mapper";
import { MoviesStore } from "@entities/movie/model/movies-store";
import { MovieActionsService } from "@features/movies/movie-actions.service";
import { EditMovieDialog } from "@features/movies/ui/edit-movie-dialog/edit-movie-dialog";
import { TmdbService } from "@shared/api/tmdb.service";
import { ConfirmDialog } from "@shared/ui/confirm-dialog/confirm-dialog";
import { MovieGrid } from "@widgets/movie-grid/movie-grid";
import { finalize } from "rxjs";

const COVER_IMG_URL =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop";

@Component({
  selector: "movies-home-page",
  imports: [CommonModule, MovieGrid, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: "./home.html",
  styleUrl: "./home.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  private readonly moviesStore = inject(MoviesStore);
  private readonly tmdbService = inject(TmdbService);
  private readonly snackbar = inject(SnackBarService);
  protected readonly coverImg = signal(COVER_IMG_URL);
  protected readonly isLoading = signal(false);
  private readonly movieActions = inject(MovieActionsService);
  private readonly dialog = inject(MatDialog);
  private observer?: IntersectionObserver;

  @ViewChild("infiniteTrigger", { static: false })
  private readonly infiniteTrigger?: ElementRef<HTMLDivElement>;

  readonly movies = this.moviesStore.items;

  handleCardClick({ movieId }: { movieId: number }): void {
    this.movieActions.goToDetails(movieId);
  }

  handleFavoriteToggle(movieId: number): void {
    this.movieActions.toggleFavorite(movieId);
  }

  handleEdit(movieId: number): void {
    const movie = this.moviesStore.items().find((item) => item.id === movieId);
    if (!movie) {
      this.snackbar.open("Movie not found.", "error", 3000);
      return;
    }

    const dialogRef = this.dialog.open(EditMovieDialog, {
      data: {
        title: movie.title,
        year: movie.year,
        overview: movie.overview,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.moviesStore.updateMovie(movieId, result);
    });
  }

  handleDelete(movieId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: "Delete movie?",
        message: "Are you sure you want to delete this movie from the list?",
        confirmText: "Delete",
        cancelText: "Cancel",
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.moviesStore.removeMovie(movieId);
      }
    });
  }

  ngOnInit(): void {
    if (this.moviesStore.items().length > 0) {
      return;
    }

    const page = this.moviesStore.page() || 1;
    this.loadPage(page);
  }

  ngAfterViewInit(): void {
    if (!this.infiniteTrigger) {
      return;
    }

    // Intersection Observer for scroller if reaches the end of viewport
    // to fetch next page
    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        this.loadNextPage();
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0.1,
      },
    );

    this.observer.observe(this.infiniteTrigger.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private loadNextPage(): void {
    if (this.isLoading()) {
      return;
    }

    const nextPage = this.moviesStore.page() + 1;
    if (this.moviesStore.totalPages() > 0 && nextPage > this.moviesStore.totalPages()) {
      return;
    }

    this.loadPage(nextPage, true);
  }

  private loadPage(page: number, append = false): void {
    this.isLoading.set(true);
    this.tmdbService
      .getPopularMovies(page)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const items = response.results.map(mapTmdbMovieToEntity);
          if (append) {
            this.moviesStore.appendResults(
              items,
              response.page,
              response.total_pages,
              response.total_results,
            );
          } else {
            this.moviesStore.setResults(items, response.total_pages, response.total_results);
            this.moviesStore.setPage(response.page);
          }
        },
        error: (err) => {
          this.snackbar.open(err?.error?.status_message, "error", 6000);
        },
      });
  }
}
