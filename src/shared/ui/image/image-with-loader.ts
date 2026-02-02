import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'image-with-loader',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './image-with-loader.html',
  styleUrl: './image-with-loader.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageWithLoader {
  @Input({ required: true }) src!: string | null;
  @Input() alt = '';
  @Input() placeholder = 'https://placehold.co/600x900?text=No+Image';
  @Input() fit: 'cover' | 'contain' = 'cover';

  loaded = false;
  failed = false;

  get resolvedSrc(): string {
    return this.src || this.placeholder;
  }

  onLoad(): void {
    this.loaded = true;
  }

  onError(): void {
    this.failed = true;
    this.loaded = true;
  }
}
