import { Component, Inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { map } from "rxjs/operators";
import { Sample } from "shared/sdk";
import { fetchSamplesAction } from "state-management/actions/samples.actions";
import { getSamples } from "state-management/selectors/samples.selectors";

@Component({
  selector: "app-sample-edit",
  templateUrl: "./sample-edit.component.html",
  styleUrls: ["./sample-edit.component.scss"],
})
export class SampleEditComponent {
  samples$ = this.store.pipe(
    select(getSamples),
    map((samples) =>
      samples.filter((sample) => sample.ownerGroup === this.data.ownerGroup)
    )
  );

  form = new FormGroup({
    sample: new FormControl("", [Validators.required, this.sampleValidator()]),
  });

  sampleValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const sameSample = control.value.sampleId === this.data.sampleId;
      return sameSample ? { isCurrent: { value: control.value } } : null;
    };
  }

  checkValue() {
    console.log("value", this.sample.value);
  }

  fieldHasError(): boolean {
    return this.sample.hasError("isCurrent");
  }

  cancel = (): void => this.dialogRef.close();

  save = (): void =>
    this.dialogRef.close({ sampleId: this.sample.value.sampleId });

  isInvalid = (): boolean => this.form.invalid;

  get sample() {
    return this.form.get("sample");
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { ownerGroup: string; sampleId: string },
    public dialogRef: MatDialogRef<SampleEditComponent>,
    private store: Store<Sample>
  ) {
    this.store.dispatch(fetchSamplesAction());
  }
}
