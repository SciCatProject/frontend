import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

export interface DialogData {
  sample: string;
  name: string;
}


@Component({
  selector: "app-sample-dialog",
  templateUrl: "./sample-dialog.component.html",
  styleUrls: ["./sample-dialog.component.scss"]
})
export class SampleDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.data = data;
  }

  ngOnInit() {


    this.form = this.fb.group({
      description: new FormControl({
        disabled: true
      })
    });

  }

  getPreFill(field: any, multi: boolean): any {
    return field != null && !multi ? field.toString() : null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }


}
