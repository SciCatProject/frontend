import { DatePipe } from "@angular/common";
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
import { TableColumn } from "shared/modules/table/table.component";
import { Sample } from "shared/sdk";
import { fetchSamplesAction } from "state-management/actions/samples.actions";
import { samples } from "state-management/selectors";
import {
  getPage,
  getSamples,
  getSamplesCount,
  getSamplesPerPage,
} from "state-management/selectors/samples.selectors";

@Component({
  selector: "app-sample-edit",
  templateUrl: "./sample-edit.component.html",
  styleUrls: ["./sample-edit.component.scss"],
})
export class SampleEditComponent {
  sampleCount$ = this.store.pipe(select(getSamplesCount));
  samplesPerPage$ = this.store.pipe(select(getSamplesPerPage));
  currentPage$ = this.store.pipe(select(getPage));
  samples$ = this.store.pipe(select(getSamples));
  tableData$ = this.samples$.pipe(
    map((samples) => this.formatTableData(samples))
  );

  tableColumns: TableColumn[] = [
    { name: "sampleId", icon: "fingerprint", sort: true, inList: false },
    { name: "description", icon: "description", sort: false, inList: true },
    { name: "owner", icon: "face", sort: true, inList: true },
    { name: "creationTime", icon: "date_range", sort: true, inList: true },
    { name: "ownerGroup", icon: "group", sort: false, inList: true },
  ];
  tablePaginate = true;

  formatTableData(samples: Sample[]): any {
    if (samples) {
      return samples.map((sample) => {
        return {
          sampleId: sample.sampleId,
          owner: sample.owner,
          creationTime: this.datePipe.transform(
            sample.createdAt,
            "yyyy-MM-dd, hh:mm"
          ),
          description: sample.description,
          ownerGroup: sample.ownerGroup,
        };
      });
    }
  }

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
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<SampleEditComponent>,
    private store: Store<Sample>
  ) {
    this.store.dispatch(fetchSamplesAction());
  }
}
