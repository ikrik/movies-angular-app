import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it } from "vitest";
import { ImageWithLoader } from "./image-with-loader";

describe("ImageWithLoader", () => {
  beforeEach(async () => {
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    await TestBed.configureTestingModule({
      imports: [ImageWithLoader],
    }).compileComponents();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should add is-loaded class when image loads", async () => {
    const fixture = TestBed.createComponent(ImageWithLoader);
    const component = fixture.componentInstance;
    component.src = "https://example.com/image.jpg";
    fixture.detectChanges();

    await component.onLoad({
      target: {
        decode: () => Promise.resolve(),
      },
    } as unknown as Event);

    await fixture.whenStable();
    expect(component.loaded).toBe(true);
  });

  it("should set failed class on error", () => {
    const fixture = TestBed.createComponent(ImageWithLoader);
    const component = fixture.componentInstance;
    component.src = "https://example.com/image.jpg";
    fixture.detectChanges();

    component.onError();
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector(".img--full") as HTMLImageElement;
    expect(img.classList.contains("image-wrap-img-failed")).toBe(true);
  });
});
