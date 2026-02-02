import { Injectable, inject } from "@angular/core";
import { MatSnackBar, type MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackbarComponent } from "./snackbar";
import type { SnackBarType } from "./snackbar";

@Injectable({ providedIn: "root" })
export class SnackBarService {
  private mySnack?: MatSnackBarRef<SnackbarComponent>;
  private readonly snackBar = inject(MatSnackBar);

  /**
   * Opens a snackbar with a message and an optional action.
   *
   * @param message The message to show in the snackbar.
   * @param action The label for the snackbar action.
   * @param config Additional configuration options for the snackbar.
   */
  open(
    message: string,
    type: keyof typeof SnackBarType,
    duration?: number,
    verticalPosition: "top" | "bottom" = "bottom",
    horizontalPosition: "start" | "center" | "end" | "left" | "right" = "center",
  ) {
    const snackType = type !== undefined ? type : "success";
    this.mySnack = this.snackBar.openFromComponent(SnackbarComponent, {
      duration: duration || 3000,
      data: { message, snackType, snackBar: this.snackBar },
      horizontalPosition,
      verticalPosition,
    });
  }

  mySnackBarRef() {
    return this.mySnack;
  }

  reset() {
    this.mySnack?.dismiss();
    this.mySnack = undefined;
  }
}
