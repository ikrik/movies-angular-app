import { SnackBarService } from "@shared/ui/snackbar/snackbar.service";
import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  type OnInit,
  type AfterViewInit,
  type OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  signal,
  type EffectRef,
  effect,
} from "@angular/core";

import { MoviesStore } from "@entities/movie/model/movies-store";
import { mapTmdbMovieToEntity } from "@entities/movie/model/movie.mapper";
import { TmdbService } from "@shared/api/tmdb.service";
import { MovieGrid } from "@widgets/movie-grid/movie-grid";
import { finalize } from "rxjs";
import { MovieActionsService } from "@features/movies/movie-actions.service";

const COVER_IMG_URL =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop";

@Component({
  selector: "movies-home-page",
  imports: [CommonModule, MovieGrid],
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
  private observer?: IntersectionObserver;
  private gridObserver?: IntersectionObserver;
  private itemsEffect?: EffectRef;
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
    this.itemsEffect = effect(() => {
      this.moviesStore.items();
      this.observeGridItems();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.gridObserver?.disconnect();
    this.itemsEffect?.destroy();
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
