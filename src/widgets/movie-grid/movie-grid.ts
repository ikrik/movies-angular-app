import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
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
  @Input() showActions = false;
  @Output() onCardDetailsClick = new EventEmitter<{ movieId: number; idx: number }>();
  @Output() onFavoriteToggle = new EventEmitter<number>();
  @Output() onEditClick = new EventEmitter<number>();
  @Output() onDeleteClick = new EventEmitter<number>();

  handleCardClick(movieId: number, idx: number): void {
    this.onCardDetailsClick.emit({ movieId, idx });
  }

  handleFavoriteToggle(movieId: number): void {
    this.onFavoriteToggle.emit(movieId);
  }

  handleEditClick(movieId: number): void {
    this.onEditClick.emit(movieId);
  }

  handleDeleteClick(movieId: number): void {
    this.onDeleteClick.emit(movieId);
  }
}
