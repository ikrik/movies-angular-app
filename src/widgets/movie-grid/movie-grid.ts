import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  type AfterViewInit,
  type OnDestroy,
  type ElementRef,
  type QueryList,
  ViewChildren,
  inject,
} from "@angular/core";
import { MovieActionsService } from "@features/movies/movie-actions.service";
import { MoviesStore } from "@entities/movie/model/movies-store";
import { MovieCard } from "@widgets/movie-card/movie-card";

@Component({
  selector: "movie-grid",
  imports: [CommonModule, MovieCard],
  templateUrl: "./movie-grid.html",
  styleUrl: "./movie-grid.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieGrid implements AfterViewInit, OnDestroy {
  private readonly moviesStore = inject(MoviesStore);
  private readonly movieActions = inject(MovieActionsService);

  readonly movies = this.moviesStore.items;
  private observer?: IntersectionObserver;
  private preventJump = false;

  @ViewChildren("movieItem")
  private readonly movieItems!: QueryList<ElementRef<HTMLElement>>;

  onCardClick(movieId: number, idx: number): void {
    if (typeof idx === "number") {
      this.moviesStore.setLastVisibleIndex(idx);
    }
    this.movieActions.goToDetails(movieId);
  }

  onFavoriteToggle(movieId: number): void {
    this.preventJump = true;
    this.movieActions.toggleFavorite(movieId);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
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

    this.observeItems();
    this.movieItems.changes.subscribe(() => this.observeItems());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private observeItems(): void {
    if (!this.observer) {
      return;
    }

    for (const item of this.movieItems) {
      this.observer?.observe(item.nativeElement);
    }
    this.restoreToLastVisibleItem();
  }

  private restoreToLastVisibleItem(): void {
    const index = this.moviesStore.lastVisibleIndex();
    if (index < 0 || this.movieItems.length === 0) {
      return;
    }

    const item = this.movieItems.get(index);
    if (!item) {
      return;
    }

    if (this.preventJump) {
      this.preventJump = false;
      return;
    }

    setTimeout(() => {
      item.nativeElement.scrollIntoView({ block: "center", behavior: "auto" });
    }, 0);
  }
}
