import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sample } from "shared/sdk";
import { Store } from "@ngrx/store";
import { AddSampleAction } from "state-management/actions/samples.actions";

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
  description: string;

  constructor(
    private store: Store<Sample>,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) { description, sampleCharacteristics, owner }: Sample) {

    this.description = description;

    this.form = this.fb.group({
      description: [description, Validators.required],
      sampleCharacteristics: [sampleCharacteristics, Validators.required],
      owner: [owner, Validators.required]
    });
  }

  ngOnInit() {



  }

  getPreFill(field: any, multi: boolean): any {
    return field != null && !multi ? field.toString() : null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.form.value);
    console.log("gmnov", this.form.value);
    const sample = new Sample();
    this.store.dispatch(new AddSampleAction(sample));
  }

  close() {
    this.dialogRef.close();
  }


}
