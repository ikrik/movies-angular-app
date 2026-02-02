import { SnackBarService } from "@shared/ui/snackbar/snackbar.service";
import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  type OnInit,
  type AfterViewInit,
  type OnDestroy,
  type ElementRef,
  ViewChild,
  inject,
  signal,
} from "@angular/core";

import { MoviesStore } from "@entities/movie/model/movies-store";
import { mapTmdbMovieToEntity } from "@entities/movie/model/movie.mapper";
import { TmdbService } from "@shared/api/tmdb.service";
import { MovieGrid } from "@widgets/movie-grid/movie-grid";
import { finalize } from "rxjs";

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
  private observer?: IntersectionObserver;

  @ViewChild("infiniteTrigger", { static: false })
  private readonly infiniteTrigger?: ElementRef<HTMLDivElement>;

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

  // Scroll restoration now uses intersection observer in movie-grid.
}
