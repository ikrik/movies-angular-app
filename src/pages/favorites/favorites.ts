import { CommonModule, ViewportScroller } from "@angular/common";
import { type AfterViewInit, ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { FavoritesStore } from "@entities/movie/model/favorites-store";
import { MovieActionsService } from "@features/movies/movie-actions.service";
import { BackButton } from "@shared/ui/back-button/back-button";
import { MovieCard } from "@widgets/movie-card/movie-card";
import { MovieGrid } from "@widgets/movie-grid/movie-grid";

@Component({
  selector: "movies-favorites-page",
  imports: [CommonModule, BackButton, MovieGrid],
  templateUrl: "./favorites.html",
  styleUrl: "./favorites.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage implements AfterViewInit {
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly movieActions = inject(MovieActionsService);
  private readonly viewportScroller = inject(ViewportScroller);
  readonly favorites = this.favoritesStore.items;

  handleCardClick({ movieId }: { movieId: number }): void {
    this.movieActions.goToDetails(movieId);
  }

  handleFavoriteToggle(movieId: number): void {
    this.movieActions.toggleFavorite(movieId);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const content = document.querySelector<HTMLElement>(".content");
      if (content) {
        content.scrollTop = 0;
        return;
      }
      this.viewportScroller.scrollToPosition([0, 0]);
    }, 0);
  }
}
