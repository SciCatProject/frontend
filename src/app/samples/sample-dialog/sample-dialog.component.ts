import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sample } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import { AddSampleAction } from "state-management/actions/samples.actions";
import { getCurrentUser } from "state-management/selectors/users.selectors";

const shortid = require("shortid");

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
  sample: Sample;

  constructor(
    private store: Store<any>,
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
    this.sample = new Sample();
    this.sample.sampleCharacteristics = { "char": this.form.value.sampleCharacteristics };
    this.sample.description = this.form.value.description;
    this.sample.samplelId = shortid.generate();

    this.store.pipe(select(getCurrentUser)).subscribe(res => { this.sample.owner = res.username; return console.log(res); });

    this.sample.ownerGroup = "ess";
    this.store.dispatch(new AddSampleAction(this.sample));
  }

  close() {
    this.dialogRef.close();
  }


}
