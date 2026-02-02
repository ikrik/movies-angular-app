import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface EditMovieDialogData {
  title: string;
  year: string;
  overview: string;
}

export interface EditMovieDialogResult {
  title: string;
  year: string;
  overview: string;
}

@Component({
  selector: "edit-movie-dialog",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./edit-movie-dialog.html",
  styleUrl: "./edit-movie-dialog.less",
})
export class EditMovieDialog {
  readonly dialogRef = inject(MatDialogRef<EditMovieDialog, EditMovieDialogResult | null>);
  readonly data = inject<EditMovieDialogData>(MAT_DIALOG_DATA);

  readonly form = new FormGroup({
    title: new FormControl(this.data.title ?? "", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    year: new FormControl(this.data.year ?? "", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^(18[8-9]\d|19\d\d|20[0-2]\d|2030)$/),
      ],
    }),
    overview: new FormControl(this.data.overview ?? "", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, year, overview } = this.form.getRawValue();
    this.dialogRef.close({ title, year, overview });
  }
}
