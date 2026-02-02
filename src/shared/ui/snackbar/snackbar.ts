import { Component, inject, Inject, ViewEncapsulation } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MAT_SNACK_BAR_DATA, type MatSnackBar } from "@angular/material/snack-bar";

export const SnackBarType = {
  success: "success",
  error: "error",
};

export interface SnackBarData {
  message?: string;
  snackType: keyof typeof SnackBarType;
  snackBar: MatSnackBar;
}

@Component({
  selector: "snackbar",
  templateUrl: "./snackbar.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./snackbar.less"],
  imports: [MatIconModule],
})
export class SnackbarComponent {
  data = inject<SnackBarData>(MAT_SNACK_BAR_DATA);

  get getIcon() {
    if (this.data.snackType === "success") {
      return { type: this.data.snackType, icon: "check_circle" };
    }
    return { type: this.data.snackType, icon: "error" };
  }

  public closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}
