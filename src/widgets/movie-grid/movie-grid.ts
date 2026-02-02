import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from "@angular/core";
import type { MovieEntity } from "@entities/movie/model/movie.mapper";
import { MovieCard } from "@widgets/movie-card/movie-card";

@Component({
  selector: "movie-grid",
  imports: [CommonModule, MovieCard],
  templateUrl: "./movie-grid.html",
  styleUrl: "./movie-grid.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieGrid {
  @Input() movies: MovieEntity[] = [];
  @Output() onCardDetailsClick = new EventEmitter<{ movieId: number; idx: number }>();
  @Output() onFavoriteToggle = new EventEmitter<number>();

  handleCardClick(movieId: number, idx: number): void {
    this.onCardDetailsClick.emit({ movieId, idx });
  }

  handleFavoriteToggle(movieId: number): void {
    this.onFavoriteToggle.emit(movieId);
  }
}
