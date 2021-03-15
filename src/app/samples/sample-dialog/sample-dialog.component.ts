import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Sample } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import {
  addSampleAction,
  fetchSamplesAction
} from "state-management/actions/samples.actions";
import {
  getCurrentUser,
  getProfile
} from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";

import * as shortid from "shortid";

@Component({
  selector: "app-sample-dialog",
  templateUrl: "./sample-dialog.component.html",
  styleUrls: ["./sample-dialog.component.scss"]
})
export class SampleDialogComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  description: string;
  sample: Sample;

  username: string;
  userGroups: string[];
  subscriptions: Subscription[] = [];

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
      sampleCharacteristics: [sampleCharacteristics],
      ownerGroup: [ownerGroup, Validators.required]
    });
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
    if (!this.sample.sampleCharacteristics) {
      this.sample.sampleCharacteristics = {};
    }

    this.sample.description = this.form.value.description;
    this.sample.ownerGroup = this.form.value.ownerGroup;
    this.sample.sampleId = shortid.generate();
    this.sample.owner = this.username.replace("ldap.", "");

    this.store.dispatch(addSampleAction({ sample: this.sample }));
    this.store.dispatch(fetchSamplesAction());
  }

  close() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getCurrentUser)).subscribe(user => {
        if (user) {
          this.username = user.username;
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getProfile)).subscribe(profile => {
        if (profile) {
          this.userGroups = profile.accessGroups;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
