import { FavoritesStore } from "@entities/movie/model/favorites-store";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MoviesStore } from "@entities/movie/model/movies-store";

@Component({
  selector: "movies-user-menu",
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: "./user-menu.html",
  styleUrl: "./user-menu.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesUserMenu {
  private readonly router = inject(Router);
  private readonly favoritesStore = inject(FavoritesStore);
  private readonly moviesStore = inject(MoviesStore);

  favouritesList() {
    void this.router.navigate(["/favorites"]);
  }

  resetState() {
    this.favoritesStore.clear();
    this.moviesStore.clear();
  }
}
