import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import type { MovieEntity } from "@entities/movie/model/movie.mapper";
import { tmdbPosterUrl } from "@shared/lib/tmdb-image";
import { ImageWithLoader } from "@shared/ui/image/image-with-loader";

@Component({
  selector: "movie-card",
  imports: [CommonModule, MatButtonModule, MatIconModule, ImageWithLoader],
  templateUrl: "./movie-card.html",
  styleUrl: "./movie-card.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCard {
  @Input({ required: true }) movie!: MovieEntity;
  @Input() showActions = false;
  @Output() onCardClick = new EventEmitter<number>();
  @Output() onFavoriteToggle = new EventEmitter<number>();
  @Output() onEditClick = new EventEmitter<number>();
  @Output() onDeleteClick = new EventEmitter<number>();

  handleCardClick(): void {
    this.onCardClick.emit(this.movie.id);
  }

  handleFavoriteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.onFavoriteToggle.emit(this.movie.id);
  }

  handleEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.onEditClick.emit(this.movie.id);
  }

  handleDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.onDeleteClick.emit(this.movie.id);
  }

  getPosterUrl(): string | null {
    return tmdbPosterUrl(this.movie.posterPath, "w500");
  }

  getPosterPlaceholder(): string | null {
    return tmdbPosterUrl(this.movie.posterPath, "w92");
  }
}
