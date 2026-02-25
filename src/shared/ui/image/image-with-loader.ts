import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "image-with-loader",
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: "./image-with-loader.html",
  styleUrl: "./image-with-loader.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageWithLoader {
  readonly src = input<string | null>(null);
  readonly placeholderSrc = input<string | null>(null);
  readonly alt = input("");
  readonly placeholder = input("https://placehold.co/600x900?text=No+Image");
  readonly fit = input<"cover" | "contain">("cover");
  readonly showSpinner = input(false);
  readonly aspectRatio = input("2 / 3");

  readonly loaded = signal(false);
  readonly failed = signal(false);
  readonly resolvedSrc = computed(() => this.src() || this.placeholder());

  async onLoad(ev: Event): Promise<void> {
    const img = ev.target as HTMLImageElement;

    // Ensure decode completes before we fade in (prevents progressive painting flashes)
    if (img?.decode) {
      try {
        await img.decode();
      } catch {
        // ignore
      }
    }
    requestAnimationFrame(() => {
      this.loaded.set(true);
    });
  }

  onError(): void {
    this.failed.set(true);
    this.loaded.set(true);
  }
}
