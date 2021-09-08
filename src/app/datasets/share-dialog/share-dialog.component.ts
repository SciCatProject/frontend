import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-share-dialog",
  templateUrl: "./share-dialog.component.html",
  styleUrls: ["./share-dialog.component.scss"],
})
export class ShareDialogComponent {
  emailFormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  emails: string[] = [];

  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>) {}

  isInvalid = (): boolean =>
    this.emailFormControl.hasError("email") ||
    this.emailFormControl.hasError("required");

  add = (email: string): void => {
    this.emails.push(email);
    this.emailFormControl.reset();
  };

  remove = (email: string): void => {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  };

  isEmpty = (): boolean => this.emails.length === 0;

  share = (): void => this.dialogRef.close({ users: this.emails });

  cancel = (): void => this.dialogRef.close();
}
