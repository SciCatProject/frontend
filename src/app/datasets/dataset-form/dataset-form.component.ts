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
  typeValues = ["date", "measurement", "number", "string"];

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

  detectType(index: any) {
    const typeValue = this.items.at(index).get("fieldType").value;
    if (typeValue !== "measurement") {
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
    this.dataset.scientificMetadata = this.createMetadataObjects();
    this.store.dispatch(new SaveDatasetAction(this.dataset));
  }

  onRemove(index: any) {
    this.items.removeAt(index);
  }

  addCurrentMetadata() {
    if (this.dataset) {
      Object.keys(this.dataset.scientificMetadata).forEach(key => {
        let field = {};
        if ("type" in this.dataset.scientificMetadata[key]) {
          field = {
            fieldName: key,
            fieldType: this.dataset.scientificMetadata[key].type,
            fieldValue: this.dataset.scientificMetadata[key].value,
            fieldUnit: this.dataset.scientificMetadata[key].unit
          };
        } else {
          field = {
            fieldName: key,
            fieldType: "string",
            fieldValue: JSON.stringify(this.dataset.scientificMetadata[key]),
            fieldUnit: ""
          };
        }
        this.items.push(this.formBuilder.group(field));
      });
      for (let i = 0; i < this.items.length; i++) {
        this.detectType(i);
      }
    }
  }

  createMetadataObjects(): object {
    let metadata = {};
    this.items.controls.forEach(control => {
      metadata[control.value.fieldName] = {
        type: control.value.fieldType
      };

      switch (control.value.fieldType) {
        case "date": {
          metadata[control.value.fieldName].value = new Date(
            control.value.fieldValue
          );
          metadata[control.value.fieldName].unit = "";
          break;
        }
        case "measurement": {
          metadata[control.value.fieldName].value = Number(
            control.value.fieldValue
          );
          metadata[control.value.fieldName].unit = control.value.fieldUnit;
        }
        case "number": {
          metadata[control.value.fieldName].value = Number(
            control.value.fieldValue
          );
          metadata[control.value.fieldName].unit = "";
          break;
        }
        case "string": {
          metadata[control.value.fieldName].value = control.value.fieldValue;
          metadata[control.value.fieldName].unit = "";
          break;
        }
        default: {
          metadata[control.value.fieldName].value = control.value.fieldValue;
          metadata[control.value.fieldName].unit = control.value.fieldUnit;
          break;
        }
      }
    });

    return metadata;
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
