import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dataset } from "shared/sdk";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "app-metadata-table",
  templateUrl: "./metadata-table.component.html",
  styleUrls: ["./metadata-table.component.scss"]
})
export class MetadataTableComponent implements OnInit, OnDestroy {
  public metadata: object[];
  private metadataSubscription: Subscription;
  public displayMetadataColumns = ["name", "value", "unit"];

  createMetadataArray(scientificMetadata) {
    const objects = [];
    if (scientificMetadata) {
      Object.keys(scientificMetadata).forEach(key => {
        let metadataObject = {};
        if ("type" in scientificMetadata[key]) {
          metadataObject = {
            name: key,
            type: scientificMetadata[key].type,
            value: scientificMetadata[key].value,
            unit: scientificMetadata[key].unit
          };
        } else {
          metadataObject = {
            name: key,
            type: "",
            value: JSON.stringify(scientificMetadata[key]),
            unit: ""
          };
        }
        objects.push(metadataObject);
      });
    }
    return objects;
  }

  constructor(private store: Store<Dataset>) {}

  ngOnInit() {
    this.metadataSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe((dataset: any) => {
        if (dataset) {
          this.metadata = this.createMetadataArray(dataset.scientificMetadata);
        }
      });
  }

  ngOnDestroy() {
    this.metadataSubscription.unsubscribe();
  }
}
