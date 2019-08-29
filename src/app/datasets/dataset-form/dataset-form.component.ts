import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { RawDataset } from "../../shared/sdk/models";
import { SaveDatasetAction } from "../../state-management/actions/datasets.actions";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { select, Store } from "@ngrx/store";
import { filter, take } from "rxjs/operators";

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.scss"]
})
export class DatasetFormComponent implements OnInit, OnDestroy {
  dataset$: Observable<RawDataset>;
  submitted = false;
  datasetSubscription: void;
  scientificMetaDataSubscription: Subscription;
  metadataForm: FormGroup;

  constructor(private store: Store<any>, private formBuilder: FormBuilder) {}

  get items() {
    return this.metadataForm.get("items") as FormArray;
  }

  addMetadata() {
    const field = this.formBuilder.group({
      fieldType: [],
      fieldName: [],
      fieldValue: [],
      fieldUnit: []
    });
    this.items.push(field);
  }

  onChange(index: any) {
    let typeValue = this.items.at(index).get("fieldType").value;
    if (typeValue === "string") {
      this.items
        .at(index)
        .get("fieldUnit")
        .reset();
      this.items
        .at(index)
        .get("fieldUnit")
        .disable();
    } else {
      this.items
        .at(index)
        .get("fieldUnit")
        .enable();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.datasetSubscription = this.dataset$
      .pipe(take(1))
      .subscribe(updatedDataset => {
        let metadata = {};
        this.items.controls.forEach(control => {
          const name = control.value.fieldName;

          metadata[name] = {
            type: control.value.fieldType,
            value: control.value.fieldValue
          };
          if (control.value.fieldType === "string") {
            metadata[name].unit = "";
          } else {
            metadata[name].unit = control.value.fieldUnit;
          }
        });

        updatedDataset.scientificMetadata = metadata;
        this.store.dispatch(new SaveDatasetAction(updatedDataset));
      })
      .unsubscribe();
  }

  onRemove(index: any) {
    this.items.removeAt(index);
  }

  ngOnInit() {
    this.dataset$ = this.store.pipe(select<RawDataset>(getCurrentDataset));
    this.submitted = false;

    this.metadataForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });

    this.scientificMetaDataSubscription = this.dataset$
      .pipe(
        filter(Boolean),
        take(1)
      )
      .subscribe((dataset: RawDataset) => {
        let jsonData: object;
        if (typeof dataset.scientificMetadata === "undefined") {
          jsonData = {};
        } else {
          jsonData = dataset.scientificMetadata;
        }
        console.log(jsonData);
        for (const key of Object.keys(jsonData)) {
          const field = {
            fieldName: key.toString(),
            fieldValue: jsonData[key].toString()
          };
          this.items.push(this.formBuilder.group(field));
        }
      });
  }

  ngOnDestroy() {
    this.scientificMetaDataSubscription.unsubscribe();
  }
}
