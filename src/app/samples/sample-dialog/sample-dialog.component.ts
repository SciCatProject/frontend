import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SampleClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Store } from "@ngrx/store";
import {
  addSampleAction,
  fetchSamplesAction,
} from "state-management/actions/samples.actions";
import { selectSampleDialogPageViewModel } from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";

import * as shortid from "shortid";

@Component({
  selector: "app-sample-dialog",
  templateUrl: "./sample-dialog.component.html",
  styleUrls: ["./sample-dialog.component.scss"],
  standalone: false,
})
export class SampleDialogComponent implements OnInit, OnDestroy {
  private vm$ = this.store.select(selectSampleDialogPageViewModel);
  public form: FormGroup;
  description: string;
  sample: SampleClass;

  username = "";
  userGroups: string[] | undefined;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    { description, sampleCharacteristics, ownerGroup }: SampleClass,
  ) {
    this.description = description;

    this.form = this.fb.group({
      description: [description, Validators.required],
      sampleCharacteristics: [sampleCharacteristics],
      ownerGroup: [ownerGroup, Validators.required],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
    this.sample.sampleCharacteristics = {
      characteristics: this.form.value.sampleCharacteristics,
    };
    try {
      const parsed = JSON.parse(this.form.value.sampleCharacteristics);
      this.sample.sampleCharacteristics = parsed;
    } catch (e) {
      this.sample.sampleCharacteristics = {
        characteristics: this.form.value.sampleCharacteristics,
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
      this.vm$.subscribe((vm) => {
        if (vm.user) {
          this.username = vm.user.username;
        }
      }),
    );

    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        if (vm.profile) {
          this.userGroups = vm.profile.accessGroups;
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
