import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { RawDataset } from "../../shared/sdk/models";
import { SaveDatasetAction } from "../../state-management/actions/datasets.actions";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { select, Store } from "@ngrx/store";

interface MetadataField {
  name: string;
  value: string;
}

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.css"]
})
export class DatasetFormComponent implements OnInit {
  dataset$: Observable<RawDataset>;
  metadataField$: Observable<MetadataField>;
  submitted = false;

  constructor(private store: Store<any>) {}

  onSubmit() {
    this.submitted = true;
    this.metadataField$.subscribe(output => {});
    this.dataset$.subscribe(updated_dataset => {
      this.metadataField$.subscribe(metadata => {
        updated_dataset.scientificMetadata[metadata.name] = metadata.value;
        this.store.dispatch(new SaveDatasetAction(updated_dataset));
      });
    });
  }

  ngOnInit() {
    this.dataset$ = this.store.pipe(select<RawDataset>(getCurrentDataset));
    this.metadataField$ = of({ name: "Name", value: "Value" });
  }
}
