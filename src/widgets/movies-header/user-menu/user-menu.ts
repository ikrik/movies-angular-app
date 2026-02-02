import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "movies-user-menu",
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: "./user-menu.html",
  styleUrl: "./user-menu.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesUserMenu {
  private readonly router = inject(Router);

  favouritesList() {
    void this.router.navigate(["/favorites"]);
  }
}
