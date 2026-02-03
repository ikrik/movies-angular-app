import { CommonModule } from "@angular/common";
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  type OnDestroy,
  type OnInit,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
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
  private readonly destroyRef = inject(DestroyRef);
  protected readonly coverImg = signal(COVER_IMG_URL);
  protected readonly isLoading = signal(false);
  private readonly movieActions = inject(MovieActionsService);
  private readonly dialog = inject(MatDialog);
  private readonly items$ = toObservable(this.moviesStore.items);
  private observer?: IntersectionObserver;
  private gridObserver?: IntersectionObserver;
  private preventJump = false;

  @ViewChild("infiniteTrigger", { static: false })
  private readonly infiniteTrigger?: ElementRef<HTMLDivElement>;

  @ViewChild(MovieGrid, { read: ElementRef })
  private readonly movieGridHost?: ElementRef<HTMLElement>;

  readonly movies = this.moviesStore.items;

  handleCardClick({ movieId, idx }: { movieId: number; idx: number }): void {
    if (typeof idx === "number") {
      this.moviesStore.setLastVisibleIndex(idx);
    }
    this.movieActions.goToDetails(movieId);
  }

  handleFavoriteToggle(movieId: number): void {
    this.preventJump = true;
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

    dialogRef.afterClosed().subscribe((confirmed) => {
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

    // Intersection Observer for scroller to keep track the position where
    // the movie card was clicked, in order to return back
    this.gridObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const indexAttr = (entry.target as HTMLElement).getAttribute("data-movie-index");
          const index = indexAttr ? Number(indexAttr) : Number.NaN;
          if (!Number.isNaN(index)) {
            this.moviesStore.setLastVisibleIndex(index);
          }
        }
      },
      { root: null, threshold: 0.2 },
    );

    this.observeGridItems();
    this.items$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.observeGridItems());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.gridObserver?.disconnect();
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

  private observeGridItems(): void {
    if (!this.gridObserver || !this.movieGridHost) {
      return;
    }

    this.gridObserver.disconnect();
    const items =
      this.movieGridHost.nativeElement.querySelectorAll<HTMLElement>("[data-movie-index]");

    for (const item of items) {
      this.gridObserver?.observe(item);
    }

    this.restoreToLastVisibleItem(items);
  }

  private restoreToLastVisibleItem(items: NodeListOf<HTMLElement>): void {
    const index = this.moviesStore.lastVisibleIndex();
    if (index < 0 || items.length === 0) {
      return;
    }

    const item = items[index];
    if (!item) {
      return;
    }

    if (this.preventJump) {
      this.preventJump = false;
      return;
    }

    setTimeout(() => {
      item.scrollIntoView({ block: "center", behavior: "auto" });
    }, 0);
  }
}
