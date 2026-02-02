import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'movies-not-movie-found-page',
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './not-movie-found.html',
  styleUrl: './not-movie-found.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotMovieFoundPage {}
