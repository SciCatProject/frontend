import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sample } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import {
  addSampleAction,
  fetchSamplesAction
} from "state-management/actions/samples.actions";
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
    @Inject(MAT_DIALOG_DATA)
    { description, sampleCharacteristics, ownerGroup }: Sample
  ) {
    this.description = description;

    this.form = this.fb.group({
      description: [description, Validators.required],
      sampleCharacteristics: [sampleCharacteristics, Validators.required],
      ownerGroup: [ownerGroup, Validators.required]
    });
  }

  ngOnInit() {}

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
    this.sample.sampleCharacteristics = {
      characteristics: this.form.value.sampleCharacteristics
    };
    try {
      const parsed = JSON.parse(this.form.value.sampleCharacteristics);
      this.sample.sampleCharacteristics = parsed;
    } catch (e) {
      this.sample.sampleCharacteristics = {
        characteristics: this.form.value.sampleCharacteristics
      };
    }
    this.sample.description = this.form.value.description;
    this.sample.ownerGroup = this.form.value.ownerGroup;
    this.sample.sampleId = shortid.generate();

    this.store.pipe(select(getCurrentUser)).subscribe(res => {
      this.sample.owner = res.username.replace("ldap.", "");
      return console.log(res);
    });

    this.store.dispatch(addSampleAction({ sample: this.sample }));
    this.store.dispatch(fetchSamplesAction());
  }

  close() {
    this.dialogRef.close();
  }
}
