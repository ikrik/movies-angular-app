import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: "confirm-dialog",
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: "./confirm-dialog.html",
  styleUrl: "./confirm-dialog.less",
})
export class ConfirmDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  get title(): string {
    return this.data.title ?? "Are you sure?";
  }

  get message(): string {
    return this.data.message ?? "This action cannot be undone.";
  }

  get confirmText(): string {
    return this.data.confirmText ?? "Confirm";
  }

  get cancelText(): string {
    return this.data.cancelText ?? "Cancel";
  }
}
