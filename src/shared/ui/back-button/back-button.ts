import { CommonModule, Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "back-button",
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./back-button.html",
  styleUrl: "./back-button.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButton {
  private readonly location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
