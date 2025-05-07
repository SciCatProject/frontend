import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-public-download-dialog",
  templateUrl: "./public-download-dialog.component.html",
  styleUrls: ["./public-download-dialog.component.scss"],
  standalone: false,
})
export class PublicDownloadDialogComponent {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  constructor(public dialogRef: MatDialogRef<PublicDownloadDialogComponent>) {}
  hasError(): boolean {
    return (
      this.emailFormControl.hasError("required") ||
      this.emailFormControl.hasError("email")
    );
  }
  getErrorMessage(): string {
    if (this.emailFormControl.hasError("required")) {
      return "Email is required";
    }
    if (this.emailFormControl.hasError("email")) {
      return "Please enter valid email address";
    }
    return "";
  }

  onCancel(): void {
    this.dialogRef.close();
    this.emailFormControl.setErrors(null);
  }
}
