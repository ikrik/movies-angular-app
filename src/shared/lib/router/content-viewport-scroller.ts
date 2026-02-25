import { DOCUMENT, type ViewportScroller } from "@angular/common";
import { inject, Injectable } from "@angular/core";

@Injectable()
export class ContentViewportScroller implements ViewportScroller {
  private readonly document = inject(DOCUMENT);
  private offset: [number, number] | (() => [number, number]) = [0, 0];

  setOffset(offset: [number, number] | (() => [number, number])): void {
    this.offset = offset;
  }

  getScrollPosition(): [number, number] {
    const container = this.getContainer();
    if (!container) {
      return [window.scrollX, window.scrollY];
    }

    return [container.scrollLeft, container.scrollTop];
  }

  scrollToPosition(position: [number, number], options?: ScrollOptions): void {
    const container = this.getContainer();
    if (!container) {
      window.scrollTo({ left: position[0], top: position[1], ...options });
      return;
    }

    container.scrollTo({ left: position[0], top: position[1], ...options });
  }

  scrollToAnchor(anchor: string, options?: ScrollOptions): void {
    const element = this.document.getElementById(anchor);
    if (!element) {
      return;
    }

    const container = this.getContainer();
    if (!container) {
      element.scrollIntoView(options);
      return;
    }

    const [offsetX, offsetY] = this.resolveOffset();
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    container.scrollTo({
      left: container.scrollLeft + (elementRect.left - containerRect.left) - offsetX,
      top: container.scrollTop + (elementRect.top - containerRect.top) - offsetY,
      ...options,
    });
  }

  setHistoryScrollRestoration(scrollRestoration: "auto" | "manual"): void {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = scrollRestoration;
    }
  }

  private getContainer(): HTMLElement | null {
    return this.document.querySelector<HTMLElement>(".content");
  }

  private resolveOffset(): [number, number] {
    return typeof this.offset === "function" ? this.offset() : this.offset;
  }
}
