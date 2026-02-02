import { TestBed } from "@angular/core/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MAT_SNACK_BAR_DATA, type MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarComponent, type SnackBarData } from "./snackbar";

describe("SnackbarComponent", () => {
  const snackBarMock: MatSnackBar = {
    dismiss: vi.fn(),
  } as unknown as MatSnackBar;

  const data: SnackBarData = {
    message: "Saved!",
    snackType: "success",
    snackBar: snackBarMock,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackbarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: data }],
    }).compileComponents();
  });

  it("should render message and icon", () => {
    const fixture = TestBed.createComponent(SnackbarComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector(".actual-message")?.textContent).toContain("Saved!");
    expect(element.querySelector("mat-icon")?.textContent).toContain("check_circle");
  });

  it("should dismiss snackbar on close", () => {
    const fixture = TestBed.createComponent(SnackbarComponent);
    fixture.detectChanges();

    const close = fixture.nativeElement.querySelector(".close-icon") as HTMLElement;
    close.click();

    expect(snackBarMock.dismiss).toHaveBeenCalled();
  });
});
