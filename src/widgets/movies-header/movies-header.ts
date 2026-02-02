import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MoviesSearch } from './search/movies-search';
import { MoviesUserMenu } from './user-menu/user-menu';

@Component({
  selector: 'movies-header',
  imports: [CommonModule, MatToolbarModule, MoviesSearch, MoviesUserMenu, RouterLink],
  templateUrl: './movies-header.html',
  styleUrl: './movies-header.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesHeader {}
