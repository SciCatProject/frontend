import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { RawDataset } from "../../shared/sdk/models";
import { SaveDatasetAction } from "../../state-management/actions/datasets.actions";
import { faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { select, Store } from "@ngrx/store";
import { take, filter } from "rxjs/operators";

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.scss"]
})
export class DatasetFormComponent implements OnInit, OnDestroy {
  faTimesCircle = faTimesCircle;
  faPlusCircle = faPlusCircle;
  dataset$: Observable<RawDataset>;
  submitted = false;
  datasetSubscription: void;
  scientificMetaDataSubscription: Subscription;
  metadataForm: FormGroup;

  constructor(private store: Store<any>, private formBuilder: FormBuilder) {}

  get items() {
    return this.metadataForm.get("items") as FormArray;
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: "",
      fieldValue: ""
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  onSubmit() {
    this.submitted = true;
    this.datasetSubscription = this.dataset$
      .pipe(take(1))
      .subscribe(updated_dataset => {
        const metadata_obj = {};
        const array = [];
        for (const control of this.items.controls) {
          console.log("gm", control.value.fieldName);
          console.log("gm", control.value.fieldValue);
          const name = control.value.fieldName;
          const value = control.value.fieldValue;
          const json = `{"${name}":"${value}"}`;
          console.log("json", json);
          const metadata_item2 = JSON.parse(json);
          for (const key of Object.keys(metadata_item2)) {
            metadata_obj[key] = metadata_item2[key];
          }
          array.push(metadata_item2);
        }

        updated_dataset.scientificMetadata = metadata_obj;
        this.store.dispatch(new SaveDatasetAction(updated_dataset));
      })
      .unsubscribe();
  }

  addMetadata() {
    console.log("add a field");
    const field = this.formBuilder.group({
      fieldName: [],
      fieldValue: []
    });
    this.items.push(field);
  }

  onRemove(index: any) {
    this.items.removeAt(index);
    console.log("TODO: remove");
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.metadataForm = this.formBuilder.group({
      field1: "",
      field2: "",
      items: this.formBuilder.array([])
    });
    this.submitted = false;
    this.dataset$ = this.store.pipe(select<RawDataset>(getCurrentDataset));

    this.scientificMetaDataSubscription = this.dataset$
      .pipe(
        filter(Boolean),
        take(1))
      .subscribe(data_set => {
        let json_data = {};
        if (typeof data_set.scientificMetadata === "undefined") {
          json_data = {};
        } else {
          json_data = data_set.scientificMetadata;
        }
        console.log(json_data);
        for (const key of Object.keys(json_data)) {
          console.log("gm key", key);
          console.log("gm json_data", json_data[key]);
          const field = {
            fieldName: key.toString(),
            fieldValue: json_data[key].toString()
          };
          this.items.push(this.formBuilder.group(field));
        }
      });
  }
}
