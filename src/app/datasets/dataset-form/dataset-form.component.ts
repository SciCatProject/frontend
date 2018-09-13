import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, of, Subscription } from "rxjs";
import { RawDataset } from "../../shared/sdk/models";
import { SaveDatasetAction } from "../../state-management/actions/datasets.actions";
import { getCurrentDataset } from "../../state-management/selectors/datasets.selectors";
import { select, Store } from "@ngrx/store";
import { take } from "rxjs/operators";

interface MetadataField {
  name: string;
  value: string;
}

@Component({
  selector: "app-dataset-form",
  templateUrl: "./dataset-form.component.html",
  styleUrls: ["./dataset-form.component.css"]
})
export class DatasetFormComponent implements OnInit, OnDestroy {
  dataset$: Observable<RawDataset>;
  metadataField$: Observable<MetadataField>;
  submitted = false;
  datasetSubscription: void;
  metadataSubscription: Subscription;

  constructor(private store: Store<any>) {}

  onSubmit() {
    this.submitted = true;
    this.datasetSubscription = this.dataset$.pipe(take(1)).subscribe(updated_dataset => {
      this.metadataSubscription = this.metadataField$
        .pipe(take(1))
        .subscribe(metadata => {
          updated_dataset.scientificMetadata[metadata.name] = metadata.value;
          this.store.dispatch(new SaveDatasetAction(updated_dataset));
        });
    }).unsubscribe();
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.submitted = false;
    this.dataset$ = this.store.pipe(select<RawDataset>(getCurrentDataset));
    this.metadataField$ = of({ name: "Name", value: "Value" });
  }
}
