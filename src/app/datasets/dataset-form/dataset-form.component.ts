import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { SaveDatasetAction } from "../../state-management/actions/datasets.actions";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { select, Store } from "@ngrx/store";

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.scss"]
})
export class DatasetFormComponent implements OnInit, OnDestroy {
  dataset: any;
  datasetSubscription: Subscription;

  metadataForm: FormGroup;
  typeValues = ["date", "string", "quantity"];

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
    const typeValue = this.items.at(index).get("fieldType").value;
    if (typeValue !== "quantity") {
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
    let metadata = {};
    this.items.controls.forEach(control => {
      metadata[control.value.fieldName] = {
        type: control.value.fieldType
      };

      switch (control.value.fieldType) {
        case "string": {
          metadata[control.value.fieldName].value = control.value.fieldValue;
          metadata[control.value.fieldName].unit = "";
          return;
        }
        case "date": {
          metadata[control.value.fieldName].value = new Date(
            control.value.fieldValue
          );
          metadata[control.value.fieldName].unit = "";
          return;
        }
        default: {
          metadata[control.value.fieldName].value = control.value.fieldValue;
          metadata[control.value.fieldName].unit = control.value.fieldUnit;
          return;
        }
      }
    });

    this.dataset.scientificMetadata = metadata;
    this.store.dispatch(new SaveDatasetAction(this.dataset));
  }

  onRemove(index: any) {
    this.items.removeAt(index);
  }

  addCurrentMetadata() {
    if (this.dataset) {
      Object.keys(this.dataset.scientificMetadata).forEach(key => {
        let field = {
          fieldName: key,
          fieldType: this.dataset.scientificMetadata[key].type,
          fieldValue: this.dataset.scientificMetadata[key].value,
          fieldUnit: this.dataset.scientificMetadata[key].unit
        };
        this.items.push(this.formBuilder.group(field));
      });
      for (let i = 0; i < this.items.length; i++) {
        this.onChange(i);
      }
    }
  }

  ngOnInit() {
    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });

    this.metadataForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });

    this.addCurrentMetadata();
  }

  ngOnDestroy() {
    this.datasetSubscription.unsubscribe();
  }
}
