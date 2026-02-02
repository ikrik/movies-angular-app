import { Location } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BackButton } from "./back-button";

describe("BackButton", () => {
  const locationMock = {
    back: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButton],
      providers: [{ provide: Location, useValue: locationMock }],
    }).compileComponents();
  });

  it("should call location.back when clicked", () => {
    const fixture = TestBed.createComponent(BackButton);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    button.click();

    expect(locationMock.back).toHaveBeenCalled();
  });
});
