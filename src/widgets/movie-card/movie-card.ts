import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import type { MovieEntity } from "@entities/movie/model/movie.mapper";

@Component({
  selector: "movie-card",
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./movie-card.html",
  styleUrl: "./movie-card.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCard {
  @Input({ required: true }) movie!: MovieEntity;
  @Output() onCardClick = new EventEmitter<number>();
  @Output() onFavoriteToggle = new EventEmitter<number>();

  readonly IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  handleCardClick(): void {
    this.onCardClick.emit(this.movie.id);
  }

  handleFavoriteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.onFavoriteToggle.emit(this.movie.id);
  }
}
