import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MoviesHeader } from "@widgets/movies-header/movies-header";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, MoviesHeader],
  templateUrl: "./app.html",
  styleUrl: "./app.less",
})
export class App {
  protected readonly title = signal("movies-angular-app");
}
