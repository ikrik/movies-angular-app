import { CommonModule } from "@angular/common";
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  inject,
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
  private readonly cdr = inject(ChangeDetectorRef);
  @Input({ required: true }) src!: string | null;
  @Input() placeholderSrc: string | null = null;
  @Input() alt = "";
  @Input() placeholder = "https://placehold.co/600x900?text=No+Image";
  @Input() fit: "cover" | "contain" = "cover";
  @Input() showSpinner = false;
  @Input() aspectRatio = "2 / 3";

  loaded = false;
  failed = false;

  get resolvedSrc(): string {
    return this.src || this.placeholder;
  }

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
      this.loaded = true;
      this.cdr.markForCheck();
    });
  }

  onError(): void {
    this.failed = true;
    this.loaded = true;
    this.cdr.markForCheck();
  }
}
