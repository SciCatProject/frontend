import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: "app-sample-dialog",
  templateUrl: "./sample-dialog.component.html",
  styleUrls: ["./sample-dialog.component.scss"]
})
export class SampleDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
